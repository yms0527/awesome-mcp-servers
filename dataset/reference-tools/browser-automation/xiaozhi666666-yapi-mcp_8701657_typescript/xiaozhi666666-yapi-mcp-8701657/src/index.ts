#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { flattenInterfaceMenu, normalizeInterface } from "./normalize.js";
import { requestYapi } from "./yapi-client.js";
import { parseYapiUrl, trimTrailingSlash } from "./yapi-url.js";
import type { YapiAuth, YapiInterfaceSource, YapiProjectSource } from "./types.js";

const server = new McpServer({
  name: "yapi-mcp",
  version: "0.1.0",
});

const authInput = {
  host: z.string().url().optional().describe("YApi host. Defaults to YAPI_HOST, or is inferred from url."),
  token: z.string().optional().describe("YApi project token. Defaults to YAPI_TOKEN."),
  cookie: z.string().optional().describe("YApi login cookie. Defaults to YAPI_COOKIE."),
};

const interfaceInput = {
  url: z
    .string()
    .url()
    .optional()
    .describe("YApi interface page URL, for example https://yapi.example.com/project/1/interface/api/123."),
  interfaceId: z
    .union([z.string(), z.number()])
    .optional()
    .describe("YApi interface ID. Optional when url contains /interface/api/:id."),
  includeRaw: z.boolean().optional().default(false).describe("Include raw YApi payload in the MCP result."),
  ...authInput,
};

const projectInput = {
  url: z
    .string()
    .url()
    .optional()
    .describe("YApi project or interface page URL. Used to infer host and projectId."),
  projectId: z
    .union([z.string(), z.number()])
    .optional()
    .describe("YApi project ID. Optional when url contains /project/:id."),
  includeRaw: z.boolean().optional().default(false).describe("Include raw YApi payload in the MCP result."),
  ...authInput,
};

server.registerTool(
  "get_interface",
  {
    description: "Read one YApi interface by URL or interface ID and return normalized request/response metadata.",
    inputSchema: interfaceInput,
  },
  async (input) => {
    const source = resolveInterfaceSource(input);
    const data = await requestYapi<unknown>(source, "/api/interface/get", { id: source.interfaceId });
    const normalized = normalizeInterface(data as Parameters<typeof normalizeInterface>[0]);

    return jsonResult({
      source: {
        host: source.host,
        interfaceId: source.interfaceId,
      },
      normalized,
      ...(input.includeRaw ? { raw: data } : {}),
    });
  },
);

server.registerTool(
  "list_project_interfaces",
  {
    description: "Read a YApi project's interface menu. Useful for discovering interface IDs before calling get_interface.",
    inputSchema: projectInput,
  },
  async (input) => {
    const source = resolveProjectSource(input);
    const data = await requestYapi<unknown>(source, "/api/interface/list_menu", { project_id: source.projectId });

    return jsonResult({
      source: {
        host: source.host,
        projectId: source.projectId,
      },
      interfaces: flattenInterfaceMenu(data),
      ...(input.includeRaw ? { raw: data } : {}),
    });
  },
);

server.registerTool(
  "search_project_interfaces",
  {
    description: "Search/list YApi project interfaces with pagination.",
    inputSchema: {
      ...projectInput,
      keyword: z.string().optional().describe("Keyword used by YApi's list API."),
      page: z.number().int().positive().optional().default(1),
      limit: z.number().int().positive().max(100).optional().default(20),
      categoryId: z.union([z.string(), z.number()]).optional().describe("Optional YApi category ID."),
    },
  },
  async (input) => {
    const source = resolveProjectSource(input);
    const data = await requestYapi<unknown>(source, "/api/interface/list", {
      project_id: source.projectId,
      page: input.page || 1,
      limit: input.limit || 20,
      ...(input.keyword ? { keyword: input.keyword } : {}),
      ...(input.categoryId ? { catid: input.categoryId } : {}),
    });

    return jsonResult({
      source: {
        host: source.host,
        projectId: source.projectId,
      },
      raw: data,
    });
  },
);

const transport = new StdioServerTransport();
await server.connect(transport);

function resolveInterfaceSource(input: {
  url?: string;
  interfaceId?: string | number;
  host?: string;
  token?: string;
  cookie?: string;
}): YapiInterfaceSource {
  const parsed = input.url ? parseYapiUrl(input.url) : undefined;
  const host = trimTrailingSlash(input.host || parsed?.host || process.env.YAPI_HOST);
  const interfaceId = String(input.interfaceId || parsed?.interfaceId || "");

  if (!host) {
    throw new Error("Missing YApi host. Provide host, url, or YAPI_HOST.");
  }

  if (!interfaceId) {
    throw new Error("Missing YApi interface ID. Provide interfaceId or a URL containing /interface/api/:id.");
  }

  return withAuth({ host, interfaceId }, input);
}

function resolveProjectSource(input: {
  url?: string;
  projectId?: string | number;
  host?: string;
  token?: string;
  cookie?: string;
}): YapiProjectSource {
  const parsed = input.url ? parseYapiUrl(input.url) : undefined;
  const host = trimTrailingSlash(input.host || parsed?.host || process.env.YAPI_HOST);
  const projectId = String(input.projectId || parsed?.projectId || "");

  if (!host) {
    throw new Error("Missing YApi host. Provide host, url, or YAPI_HOST.");
  }

  if (!projectId) {
    throw new Error("Missing YApi project ID. Provide projectId or a URL containing /project/:id.");
  }

  return withAuth({ host, projectId }, input);
}

function withAuth<T extends { host: string }>(source: T, input: { token?: string; cookie?: string }): T & YapiAuth {
  return {
    ...source,
    token: input.token || process.env.YAPI_TOKEN || "",
    cookie: input.cookie || process.env.YAPI_COOKIE || "",
  };
}

function jsonResult(value: unknown) {
  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(value, null, 2),
      },
    ],
  };
}

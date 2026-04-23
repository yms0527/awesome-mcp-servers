#!/usr/bin/env node

import { z } from "zod";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// File content schemas
export const GitHubFileContentSchema = z.object({
  type: z.string(),
  encoding: z.string(),
  size: z.number(),
  name: z.string(),
  path: z.string(),
  content: z.string(),
  sha: z.string(),
  url: z.string(),
  git_url: z.string(),
  html_url: z.string(),
  download_url: z.string(),
});

export const GitHubDirectoryContentSchema = z.object({
  type: z.string(),
  size: z.number(),
  name: z.string(),
  path: z.string(),
  sha: z.string(),
  url: z.string(),
  git_url: z.string(),
  html_url: z.string(),
  download_url: z.string().nullable(),
});

export const GitHubContentSchema = z.union([
  GitHubFileContentSchema,
  z.array(GitHubDirectoryContentSchema),
]);

export type GithubRepoServerParams = {
  githubPersonalAccessToken: string;
  owner: string;
  repo: string;
  branch?: string;
};

export function createGithubRepoServer(params: GithubRepoServerParams) {
  if (!params.githubPersonalAccessToken) {
    throw new Error("githubPersonalAccessToken is required");
  }
  if (!params.owner) {
    throw new Error("owner is required");
  }
  if (!params.repo) {
    throw new Error("repo is required");
  }

  const GITHUB_PERSONAL_ACCESS_TOKEN = params.githubPersonalAccessToken;
  const owner = params.owner;
  const repo = params.repo;
  const branch = params.branch;

  const server = new Server(
    {
      name: "@loglm/mcp-server-github-repo",
      version: "0.1.0",
    },
    {
      capabilities: {
        resources: {},
        tools: {},
      },
    }
  );

  const resourceBaseUrl = new URL(
    `https://api.github.com/repos/${owner}/${repo}/contents/`
  );

  async function listFiles(path: string = ""): Promise<any[]> {
    let url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
    if (branch) {
      url += `?ref=${branch}`;
    }

    const response = await fetch(url, {
      headers: {
        Authorization: `token ${GITHUB_PERSONAL_ACCESS_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "mcp-server-github-repo",
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`);
    }

    const contents = await response.json();
    return Array.isArray(contents) ? contents : [contents];
  }

  async function getFileContent(path: string): Promise<string> {
    let url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
    if (branch) {
      url += `?ref=${branch}`;
    }

    const response = await fetch(url, {
      headers: {
        Authorization: `token ${GITHUB_PERSONAL_ACCESS_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "mcp-server-github-repo",
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`);
    }

    const data = GitHubContentSchema.parse(await response.json());

    if (Array.isArray(data)) {
      throw new Error("Path points to a directory, not a file");
    }

    return Buffer.from(data.content, "base64").toString("utf8");
  }

  server.setRequestHandler(ListResourcesRequestSchema, async () => {
    const files = await listFiles();

    return {
      resources: files.map((file) => ({
        uri: new URL(file.path, resourceBaseUrl).href,
        mimeType:
          file.type === "file" ? "text/plain" : "application/x-directory",
        name: file.path,
      })),
    };
  });

  server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const resourceUrl = new URL(request.params.uri);
    const path = resourceUrl.pathname.split("/contents/")[1];

    const content = await getFileContent(path);

    return {
      contents: [
        {
          uri: request.params.uri,
          mimeType: "text/plain",
          text: content,
        },
      ],
    };
  });

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [],
    };
  });

  return server;
}

async function runServer() {
  const GITHUB_PERSONAL_ACCESS_TOKEN = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;
  const GITHUB_OWNER = process.env.GITHUB_OWNER;
  const GITHUB_REPO = process.env.GITHUB_REPO;
  const GITHUB_BRANCH = process.env.GITHUB_BRANCH;

  if (!GITHUB_PERSONAL_ACCESS_TOKEN) {
    console.error(
      "GITHUB_PERSONAL_ACCESS_TOKEN environment variable is not set"
    );
    process.exit(1);
  }

  if (!GITHUB_OWNER || !GITHUB_REPO) {
    console.error(
      "GITHUB_OWNER and GITHUB_REPO environment variables are required"
    );
    process.exit(1);
  }

  const transport = new StdioServerTransport();
  const server = createGithubRepoServer({
    githubPersonalAccessToken: GITHUB_PERSONAL_ACCESS_TOKEN,
    owner: GITHUB_OWNER,
    repo: GITHUB_REPO,
    branch: GITHUB_BRANCH,
  });

  await server.connect(transport);
  console.error("GitHub Repo MCP Server running on stdio");
}

/**
 * Start the server using stdio transport.
 * This allows the server to communicate via standard input/output streams.
 */
runServer().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});

#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const BASE_URL = "https://www.stripfeed.dev/api/v1";

function getApiKey(): string {
  const key = process.env.STRIPFEED_API_KEY;
  if (!key) {
    throw new Error(
      "STRIPFEED_API_KEY environment variable is required. " +
        "Get your key at https://www.stripfeed.dev/dashboard/keys"
    );
  }
  return key;
}

interface FetchParams {
  url: string;
  format?: string;
  selector?: string;
  model?: string;
  cache?: boolean;
  ttl?: number;
  max_tokens?: number;
}

async function fetchUrl(params: FetchParams): Promise<{
  content: string;
  tokens: number;
  originalTokens: number;
  savingsPercent: string;
  cached: string;
  fetchMs: string;
  truncated: boolean;
  title?: string;
}> {
  const apiKey = getApiKey();
  const searchParams = new URLSearchParams({ url: params.url });

  if (params.format) searchParams.set("format", params.format);
  if (params.selector) searchParams.set("selector", params.selector);
  if (params.model) searchParams.set("model", params.model);
  if (params.cache === false) searchParams.set("cache", "false");
  if (params.ttl !== undefined) searchParams.set("ttl", String(params.ttl));
  if (params.max_tokens !== undefined) searchParams.set("max_tokens", String(params.max_tokens));

  const response = await fetch(`${BASE_URL}/fetch?${searchParams}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });

  if (!response.ok) {
    const body = await response.text();
    let message: string;
    try {
      message = JSON.parse(body).error;
    } catch {
      message = body;
    }
    throw new Error(`StripFeed API error ${response.status}: ${message}`);
  }

  const tokens = response.headers.get("X-StripFeed-Tokens") ?? "0";
  const originalTokens =
    response.headers.get("X-StripFeed-Original-Tokens") ?? "0";
  const savingsPercent =
    response.headers.get("X-StripFeed-Savings-Percent") ?? "0";
  const cached = response.headers.get("X-StripFeed-Cache") ?? "MISS";
  const fetchMs = response.headers.get("X-StripFeed-Fetch-Ms") ?? "0";
  const truncated = response.headers.get("X-StripFeed-Truncated") === "true";

  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const json = await response.json();
    return {
      content: json.markdown,
      tokens: parseInt(tokens),
      originalTokens: parseInt(originalTokens),
      savingsPercent,
      cached,
      fetchMs,
      truncated,
      title: json.title,
    };
  }

  const content = await response.text();
  return {
    content,
    tokens: parseInt(tokens),
    originalTokens: parseInt(originalTokens),
    savingsPercent,
    cached,
    fetchMs,
    truncated,
  };
}

const server = new McpServer({
  name: "stripfeed",
  version: "1.0.0",
});

server.tool(
  "fetch_url",
  "Convert any URL to clean, token-efficient Markdown. Strips ads, navigation, scripts, and noise. Returns clean content ready for LLM consumption.",
  {
    url: z.string().url().describe("The URL to fetch and convert to Markdown"),
    format: z
      .enum(["markdown", "json", "text", "html"])
      .optional()
      .describe("Output format: markdown (default), json, text, html"),
    selector: z
      .string()
      .optional()
      .describe(
        "CSS selector to extract specific elements (e.g. 'article', '.content', '#main')"
      ),
    model: z
      .string()
      .optional()
      .describe(
        "AI model ID for cost tracking (e.g. 'claude-sonnet-4-6', 'gpt-5')"
      ),
    cache: z
      .boolean()
      .optional()
      .describe("Set to false to bypass cache and force fresh fetch"),
    ttl: z
      .number()
      .optional()
      .describe("Cache TTL in seconds (default 3600, max 86400)"),
    max_tokens: z
      .number()
      .int()
      .positive()
      .optional()
      .describe("Truncate output to fit within this token budget"),
  },
  async (params) => {
    const result = await fetchUrl(params);

    const meta = [
      `Tokens: ${result.tokens.toLocaleString()} (saved ${result.savingsPercent}% from ${result.originalTokens.toLocaleString()})`,
      `Cache: ${result.cached}`,
      `Fetch: ${result.fetchMs}ms`,
    ];
    if (result.title) meta.unshift(`Title: ${result.title}`);
    if (result.truncated) meta.push("Truncated: yes");

    return {
      content: [
        { type: "text" as const, text: `${meta.join(" | ")}\n\n---\n\n${result.content}` },
      ],
    };
  }
);

server.tool(
  "batch_fetch",
  "Fetch multiple URLs in parallel and convert them all to clean Markdown. Process up to 10 URLs in a single call.",
  {
    urls: z
      .array(z.string().url())
      .min(1)
      .max(10)
      .describe("Array of URLs to fetch (1-10)"),
    model: z
      .string()
      .optional()
      .describe("AI model ID for cost tracking"),
  },
  async (params) => {
    const apiKey = getApiKey();

    const response = await fetch(`${BASE_URL}/batch`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        urls: params.urls,
        model: params.model,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      let message: string;
      try {
        message = JSON.parse(body).error;
      } catch {
        message = body;
      }
      throw new Error(`StripFeed API error ${response.status}: ${message}`);
    }

    const data = await response.json();
    const results = data.results as Array<{
      url: string;
      title: string;
      markdown: string;
      tokens: number;
      originalTokens: number;
      savingsPercent: number;
      status: number;
      error?: string;
    }>;

    const sections = results.map((r) => {
      if (r.status !== 200) {
        return `## ${r.url}\n\nError: ${r.error ?? `Status ${r.status}`}`;
      }
      const saved = `${r.tokens.toLocaleString()} tokens (saved ${r.savingsPercent}% from ${r.originalTokens.toLocaleString()})`;
      return `## ${r.title || r.url}\n\nSource: ${r.url} | ${saved}\n\n${r.markdown}`;
    });

    const summary = `Fetched ${data.success}/${data.total} URLs successfully.`;

    return {
      content: [
        { type: "text" as const, text: `${summary}\n\n---\n\n${sections.join("\n\n---\n\n")}` },
      ],
    };
  }
);

server.tool(
  "check_usage",
  "Check your current monthly API usage and plan limits.",
  {},
  async () => {
    const apiKey = getApiKey();
    const response = await fetch(`${BASE_URL}/usage`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    if (!response.ok) {
      const body = await response.text();
      let message: string;
      try {
        message = JSON.parse(body).error;
      } catch {
        message = body;
      }
      throw new Error(`StripFeed API error ${response.status}: ${message}`);
    }

    const data = await response.json();
    const lines = [
      `Plan: ${data.plan}`,
      `Usage: ${data.usage.toLocaleString()}${data.limit ? ` / ${data.limit.toLocaleString()}` : ' (unlimited)'}`,
    ];
    if (data.remaining !== null) lines.push(`Remaining: ${data.remaining.toLocaleString()}`);
    lines.push(`Resets: ${data.resetsAt}`);

    return {
      content: [{ type: "text" as const, text: lines.join("\n") }],
    };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("StripFeed MCP server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});

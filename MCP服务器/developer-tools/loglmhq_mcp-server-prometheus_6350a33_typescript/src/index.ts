#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

export type PrometheusServerParams = {
  prometheusUrl: string;
  prometheusUsername?: string;
  prometheusPassword?: string;
};

/**
 * Creates and configures a Prometheus MCP server
 */
export function createPrometheusServer(params: PrometheusServerParams) {
  const server = new Server(
    {
      name: "@loglm/mcp-server-prometheus",
      version: "0.1.0",
    },
    {
      capabilities: {
        resources: {},
        tools: {},
      },
    }
  );

  if (!params.prometheusUrl) {
    throw new Error("prometheusUrl is required");
  }

  const prometheusUrl = new URL(params.prometheusUrl);
  const resourceBaseUrl = new URL(prometheusUrl);

  // Helper functions for fetching Prometheus data
  async function fetchMetricMetadata(): Promise<any> {
    const url = new URL("/api/v1/metadata", prometheusUrl);
    const response = await fetch(url.toString(), {
      headers: {
        Accept: "application/json",
        ...(params.prometheusUsername && params.prometheusPassword
          ? {
              Authorization: `Basic ${btoa(
                `${params.prometheusUsername}:${params.prometheusPassword}`
              )}`,
            }
          : {}),
      },
    });

    if (!response.ok) {
      throw new Error(`Prometheus API error: ${response.statusText}`);
    }

    return response.json();
  }

  async function fetchMetricDetails(metricName: string): Promise<any> {
    const metadataUrl = new URL("/api/v1/metadata", prometheusUrl);
    const metadataResponse = await fetch(
      `${metadataUrl}?metric=${metricName}`,
      {
        headers: {
          Accept: "application/json",
          ...(params.prometheusUsername && params.prometheusPassword
            ? {
                Authorization: `Basic ${btoa(
                  `${params.prometheusUsername}:${params.prometheusPassword}`
                )}`,
              }
            : {}),
        },
      }
    );

    if (!metadataResponse.ok) {
      throw new Error(`Prometheus API error: ${metadataResponse.statusText}`);
    }

    const queryUrl = new URL("/api/v1/query", prometheusUrl);
    const queries = [
      `count(${metricName})`,
      `min(${metricName})`,
      `max(${metricName})`,
    ];

    const queryPromises = queries.map((query) =>
      fetch(`${queryUrl}?query=${encodeURIComponent(query)}`, {
        headers: {
          Accept: "application/json",
          ...(params.prometheusUsername && params.prometheusPassword
            ? {
                Authorization: `Basic ${btoa(
                  `${params.prometheusUsername}:${params.prometheusPassword}`
                )}`,
              }
            : {}),
        },
      }).then((res) => {
        if (!res.ok) {
          throw new Error(`Prometheus API error: ${res.statusText}`);
        }
        return res.json();
      })
    );

    const [metadata, countData, minData, maxData] = await Promise.all([
      metadataResponse.json(),
      ...queryPromises,
    ]);

    return {
      metadata,
      statistics: {
        count: countData.data.result[0]?.value[1] || 0,
        min: minData.data.result[0]?.value[1] || 0,
        max: maxData.data.result[0]?.value[1] || 0,
      },
    };
  }

  // Handler implementations
  server.setRequestHandler(ListResourcesRequestSchema, async () => {
    const data = await fetchMetricMetadata();

    if (data.status !== "success") {
      throw new Error("Failed to fetch metrics metadata");
    }

    return {
      resources: Object.entries(data.data).map(
        ([metricName, metadata]: [string, any]) => ({
          uri: new URL(`metrics/${metricName}`, resourceBaseUrl).href,
          mimeType: "application/json",
          name: metricName,
          description: metadata[0]?.help || "No description available",
        })
      ),
    };
  });

  server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const resourceUrl = new URL(request.params.uri);
    const pathComponents = resourceUrl.pathname.split("/");
    const metricName = pathComponents[pathComponents.length - 1];

    const metricData = await fetchMetricDetails(metricName);

    const content = {
      name: metricName,
      metadata: metricData.metadata.data[metricName]?.[0] || {},
      statistics: metricData.statistics,
    };

    return {
      contents: [
        {
          uri: request.params.uri,
          mimeType: "application/json",
          text: JSON.stringify(content, null, 2),
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

/**
 * Main function to run the server
 */
async function main() {
  const PROMETHEUS_URL = process.env.PROMETHEUS_URL;

  if (!PROMETHEUS_URL) {
    console.error("PROMETHEUS_URL environment variable is not set");
    process.exit(1);
  }

  const PROMETHEUS_USERNAME = process.env.PROMETHEUS_USERNAME;
  const PROMETHEUS_PASSWORD = process.env.PROMETHEUS_PASSWORD;

  const transport = new StdioServerTransport();
  const server = createPrometheusServer({
    prometheusUrl: PROMETHEUS_URL,
    prometheusUsername: PROMETHEUS_USERNAME,
    prometheusPassword: PROMETHEUS_PASSWORD,
  });

  await server.connect(transport);
  console.error("Prometheus MCP Server running on stdio");
}

// Run the server
main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});

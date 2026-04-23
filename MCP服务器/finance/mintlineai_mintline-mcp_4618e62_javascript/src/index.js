import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pkg = require("../package.json");

const BASE_URL = process.env.MINTLINE_API_URL || "https://api.mintline.ai";
const apiKey = process.env.MINTLINE_API_KEY;

// Handle --list-tools flag
if (process.argv.includes("--list-tools") || process.argv.includes("-l")) {
  listTools().then(() => process.exit(0)).catch((err) => {
    console.error("Error:", err.message);
    process.exit(1);
  });
} else if (process.argv.includes("--help") || process.argv.includes("-h")) {
  console.log(`
Mintline MCP Server

Usage: mintline-mcp [options]

Options:
  --list-tools, -l  List all available tools
  --help, -h        Show this help message

Environment:
  MINTLINE_API_KEY  (required) Your Mintline API key
  MINTLINE_API_URL  API URL (default: https://api.mintline.ai)

For more info: https://mintline.ai/docs/mcp
`);
  process.exit(0);
} else {
  if (!apiKey) {
    console.error("Error: MINTLINE_API_KEY environment variable is required");
    process.exit(1);
  }
}

async function listTools() {
  const response = await fetch(`${BASE_URL}/api/docs/openapi.json`);
  if (!response.ok) {
    throw new Error(`Failed to fetch API spec: ${response.status}`);
  }
  const spec = await response.json();

  console.log("\nMintline MCP Tools\n");

  // Group by tag
  const toolsByTag = {};
  for (const [path, methods] of Object.entries(spec.paths)) {
    for (const [method, operation] of Object.entries(methods)) {
      if (!operation.operationId) continue;
      const tag = operation.tags?.[0] || "Other";
      if (!toolsByTag[tag]) toolsByTag[tag] = [];
      toolsByTag[tag].push({
        name: operation.operationId,
        summary: operation.summary,
        description: operation.description,
      });
    }
  }

  for (const [tag, tools] of Object.entries(toolsByTag)) {
    console.log(`${tag}`);
    console.log("─".repeat(40));
    for (const tool of tools) {
      console.log(`  ${tool.name}`);
      console.log(`    ${tool.summary}`);
    }
    console.log();
  }

  console.log("Full documentation: https://mintline.ai/docs/mcp");
}

/**
 * Fetch OpenAPI spec and generate MCP tools
 */
async function fetchToolsFromAPI() {
  const response = await fetch(`${BASE_URL}/api/docs/openapi.json`);
  if (!response.ok) {
    throw new Error(`Failed to fetch OpenAPI spec: ${response.status}`);
  }
  const spec = await response.json();
  return generateToolsFromOpenAPI(spec);
}

/**
 * Generate MCP tools from OpenAPI spec
 */
function generateToolsFromOpenAPI(spec) {
  const tools = [];
  const pathMap = {}; // operationId -> { method, path, parameters, requestBody }

  for (const [path, methods] of Object.entries(spec.paths)) {
    for (const [method, operation] of Object.entries(methods)) {
      const operationId = operation.operationId;
      if (!operationId) continue;

      // Build input schema from parameters and requestBody
      const properties = {};
      const required = [];

      // Add parameters (path + query)
      if (operation.parameters) {
        for (const param of operation.parameters) {
          properties[param.name] = {
            type: param.schema?.type || "string",
            description: param.description,
            enum: param.schema?.enum,
            default: param.schema?.default,
          };
          if (param.required) {
            required.push(param.name);
          }
        }
      }

      // Add request body properties
      if (operation.requestBody?.content?.["application/json"]?.schema?.properties) {
        const bodyProps = operation.requestBody.content["application/json"].schema.properties;
        const bodyRequired = operation.requestBody.content["application/json"].schema.required || [];
        for (const [name, prop] of Object.entries(bodyProps)) {
          properties[name] = {
            type: prop.type || "string",
            description: prop.description,
            enum: prop.enum,
            default: prop.default,
          };
        }
        required.push(...bodyRequired);
      }

      tools.push({
        name: operationId,
        description: `${operation.summary}. ${operation.description || ""}`.trim(),
        inputSchema: {
          type: "object",
          properties,
          required: required.length > 0 ? required : undefined,
        },
      });

      pathMap[operationId] = {
        method: method.toUpperCase(),
        path,
        parameters: operation.parameters || [],
        hasBody: !!operation.requestBody,
      };
    }
  }

  return { tools, pathMap };
}

/**
 * Execute an API call
 */
async function executeAPICall(pathInfo, args) {
  const { method, path, parameters, hasBody } = pathInfo;

  // Build URL with path parameters replaced
  let url = `${BASE_URL}${path}`;
  const queryParams = new URLSearchParams();

  for (const param of parameters) {
    const value = args[param.name];
    if (value === undefined) continue;

    if (param.in === "path") {
      url = url.replace(`{${param.name}}`, encodeURIComponent(value));
    } else if (param.in === "query") {
      queryParams.set(param.name, value);
    }
  }

  const queryString = queryParams.toString();
  if (queryString) {
    url += `?${queryString}`;
  }

  // Build request body (exclude path/query params)
  let body = undefined;
  if (hasBody) {
    const bodyParams = {};
    const paramNames = new Set(parameters.map(p => p.name));
    for (const [key, value] of Object.entries(args)) {
      if (!paramNames.has(key) && value !== undefined) {
        bodyParams[key] = value;
      }
    }
    if (Object.keys(bodyParams).length > 0) {
      body = JSON.stringify(bodyParams);
    }
  }

  const response = await fetch(url, {
    method,
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body,
  });

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  if (!data.success) {
    throw new Error(data.error?.message || `Request failed (${response.status})`);
  }

  return data;
}

/**
 * Format API response as human-readable text
 */
function formatResponse(operationId, response) {
  const data = response.data;
  const fmt = (n) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

  switch (operationId) {
    case "list_receipts":
      if (!data?.length) return "No receipts found.";
      return data.map(r =>
        `- ${r.id}: ${r.vendor?.name || r.vendorName || "Unknown"} - ${r.totalAmount || "?"} ${r.currency || "USD"} (${r.purchaseDate ? new Date(r.purchaseDate).toLocaleDateString() : "no date"})`
      ).join("\n");

    case "get_receipt":
      let text = `Receipt: ${data.id}\n`;
      text += `Vendor: ${data.vendor?.name || data.vendorName || "Unknown"}\n`;
      text += `Date: ${data.purchaseDate ? new Date(data.purchaseDate).toLocaleDateString() : "N/A"}\n`;
      text += `Total: ${data.totalAmount || "?"} ${data.currency || "USD"}\n`;
      if (data.items?.length) {
        text += `\nLine Items:\n`;
        data.items.forEach(item => { text += `  - ${item.description}: ${item.totalPrice}\n`; });
      }
      return text;

    case "list_transactions":
      if (!data?.length) return "No transactions found.";
      return data.map(t =>
        `- ${t.id}: ${t.description} - ${t.amount} ${t.currency || "USD"} (${t.transactionDate ? new Date(t.transactionDate).toLocaleDateString() : "no date"})`
      ).join("\n");

    case "get_transaction":
      return `Transaction: ${data.id}\nDescription: ${data.description}\nAmount: ${data.amount} ${data.currency || "USD"}\nDate: ${data.transactionDate ? new Date(data.transactionDate).toLocaleDateString() : "N/A"}`;

    case "list_matches":
      if (!data?.length) return "No matches found.";
      return data.map(m =>
        `- ${m.id}: Receipt ${m.receiptId} <-> Transaction ${m.transactionId} (${Math.round(m.confidenceScore * 100)}% confidence) [${m.status}]`
      ).join("\n");

    case "confirm_match":
      return "Match confirmed successfully.";

    case "reject_match":
      return "Match rejected.";

    case "list_statements":
      if (!data?.length) return "No statements found.";
      return data.map(s =>
        `- ${s.id}: ${s.institutionName} - ${s.statementDate ? new Date(s.statementDate).toLocaleDateString() : "no date"} (${s.transactionCount || 0} transactions)`
      ).join("\n");

    case "get_statement":
      return `Statement: ${data.id}\nBank: ${data.institutionName}\nAccount: ${data.accountNumber}\nDate: ${data.statementDate}\nTransactions: ${data.transactionCount}`;

    case "list_tags":
      if (!data?.length) return "No tags found.";
      return data.map(t => `- ${t.id}: ${t.name}${t.color ? ` (${t.color})` : ""}`).join("\n");

    case "create_tag":
      return `Tag created: ${data.name} (${data.id})`;

    case "delete_tag":
      return "Tag deleted.";

    case "spending_summary":
      if (data.summary) {
        return `Spending Summary (${data.period.from} to ${data.period.to})\nTotal: ${fmt(data.summary.totalAmount)}\nReceipts: ${data.summary.receiptCount}\nAverage: ${fmt(data.summary.averageAmount)}`;
      }
      if (data.data?.length) {
        return data.data.map((d, i) =>
          `${i + 1}. ${d.vendorName || d.period}: ${fmt(d.totalAmount)} (${d.receiptCount} receipts)`
        ).join("\n");
      }
      return "No spending data found.";

    case "top_vendors":
      if (!data.vendors?.length) return "No vendor data found.";
      return data.vendors.map((v, i) =>
        `${i + 1}. ${v.name}: ${fmt(v.total)} (${v.count} receipts)`
      ).join("\n");

    case "spending_trends":
      if (!data.trends?.length) return "No trend data found.";
      return data.trends.map(t => `${t.month}: ${fmt(t.total)}`).join("\n");

    case "unmatched_summary":
      return `Action Items:\n- Proposed matches to review: ${data.proposedMatches.count}\n- Unmatched receipts: ${data.unmatchedReceipts.count} (${fmt(data.unmatchedReceipts.totalAmount)})\n- Unmatched transactions: ${data.unmatchedTransactions.count} (${fmt(data.unmatchedTransactions.totalAmount)})\n- Large transactions without receipts: ${data.largeUnmatchedTransactions.count}`;

    default:
      return JSON.stringify(data, null, 2);
  }
}

async function main() {
  console.error("Fetching API schema...");
  const { tools, pathMap } = await fetchToolsFromAPI();
  console.error(`Loaded ${tools.length} tools from API`);

  const server = new Server(
    { name: pkg.name, version: pkg.version },
    { capabilities: { tools: {} } }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return { tools };
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    const pathInfo = pathMap[name];

    if (!pathInfo) {
      return {
        content: [{ type: "text", text: `Error: Unknown tool "${name}"` }],
        isError: true,
      };
    }

    try {
      const response = await executeAPICall(pathInfo, args || {});
      const formatted = formatResponse(name, response);
      return { content: [{ type: "text", text: formatted }] };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error: ${error.message}` }],
        isError: true,
      };
    }
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Mintline MCP server running");
}

// Only run MCP server if not handling CLI flags
if (!process.argv.includes("--list-tools") && !process.argv.includes("-l") &&
    !process.argv.includes("--help") && !process.argv.includes("-h")) {
  main().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
}

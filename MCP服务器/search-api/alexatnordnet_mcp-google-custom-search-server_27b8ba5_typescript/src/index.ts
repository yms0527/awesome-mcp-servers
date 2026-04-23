import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { customsearch_v1, customsearch } from '@googleapis/customsearch';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Schema for environment variables
export const EnvSchema = z.object({
  GOOGLE_API_KEY: z.string().min(1, "Google API Key is required"),
  GOOGLE_SEARCH_ENGINE_ID: z.string().min(1, "Search Engine ID is required"),
});

// Parse and validate environment variables
const env = EnvSchema.safeParse(process.env);

if (!env.success) {
  console.error("❌ Invalid environment variables:", env.error.flatten().fieldErrors);
  process.exit(1);
}

// Now we have properly typed environment variables
const { GOOGLE_API_KEY, GOOGLE_SEARCH_ENGINE_ID } = env.data;

// Initialize the Custom Search API client
const searchClient = customsearch('v1');

// Schema for validating search arguments
export const SearchArgumentsSchema = z.object({
  query: z.string().min(1),
  numResults: z.number().min(1).max(10).optional().default(5),
  country: z.string().optional(),
});

// Helper function to perform Google Custom Search
export async function performSearch(query: string, numResults: number, country?: string): Promise<customsearch_v1.Schema$Search> {
  try {
    const searchParams: any = {
      auth: GOOGLE_API_KEY,
      cx: GOOGLE_SEARCH_ENGINE_ID,
      q: query,
      num: numResults,
    };

    // Add country parameter if provided
    if (country && country.length === 2) {
      searchParams.gl = country.toLowerCase();
    }

    const response = await searchClient.cse.list(searchParams);

    return response.data;
  } catch (error) {
    console.error("Error performing search:", error);
    throw error;
  }
}

// Format search results
export function formatSearchResults(searchData: customsearch_v1.Schema$Search, country?: string): string {
  if (!searchData.items || searchData.items.length === 0) {
    return "No results found.";
  }

  let header = "";
  if (country && country.length === 2) {
    header = `Search results for region: ${country.toUpperCase()}\n\n`;
  }

  const formattedResults = searchData.items.map((item, index) => {
    return [
      `Result ${index + 1}:`,
      `Title: ${item.title || 'No title'}`,
      `URL: ${item.link || 'No URL'}`,
      `Description: ${item.snippet || 'No description'}`,
      "---",
    ].join("\n");
  });

  return header + formattedResults.join("\n\n");
}

// Setup server function (exported for testing)
export default async function setupServer(): Promise<Server> {
  // Create server instance
  const server = new Server(
    {
      name: "google-custom-search",
      version: "1.0.0",
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // List available tools
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        {
          name: "search",
          description: "Search the web using Google Custom Search API",
          inputSchema: {
            type: "object",
            properties: {
              query: {
                type: "string",
                description: "The search query",
              },
              numResults: {
                type: "number",
                description: "Number of results to return (max 10)",
                default: 5,
              },
              country: {
                type: "string",
                description: "Region for localized results. Use 2-letter ISO 3166-1 country codes (e.g., 'us' for United States, 'gb' for United Kingdom, 'au' for Australia)",
              },
            },
            required: ["query"],
          },
        },
      ],
    };
  });

  // Handle tool execution
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
      if (name === "search") {
        const { query, numResults, country } = SearchArgumentsSchema.parse(args);
        
        const searchResults = await performSearch(query, numResults, country);
        const formattedResults = formatSearchResults(searchResults, country);

        return {
          content: [
            {
              type: "text",
              text: formattedResults,
            },
          ],
        };
      } else {
        throw new Error(`Unknown tool: ${name}`);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(
          `Invalid arguments: ${error.errors
            .map((e) => `${e.path.join(".")}: ${e.message}`)
            .join(", ")}`
        );
      }
      
      // Improve error handling for API errors
      if (error instanceof Error) {
        return {
          content: [
            {
              type: "text",
              text: `Search failed: ${error.message}`,
            },
          ],
        };
      }
      throw error;
    }
  });

  return server;
}

// Start the server
if (import.meta.url === `file://${process.argv[1]}`) {
  async function main() {
    const server = await setupServer();
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Google Custom Search MCP Server running on stdio");
  }

  main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
  });
}
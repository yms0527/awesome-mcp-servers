import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const TRYKITT_API_BASE = "https://api.trykitt.ai";
const USER_AGENT = "trykitt-mcp/1.0";
const TRY_KITT_API_KEY = process.env.TRYKITT_API_KEY || "YOUR_TRYKITT_API_KEY";

// Helper function for making Trykitt API requests (JS version)
async function makeTrykittRequest(
  endpoint,
  method,
  body,
) {
  const url = `${TRYKITT_API_BASE}${endpoint}`;
  const headers = {
    "User-Agent": USER_AGENT,
    "Content-Type": "application/json",
    "x-api-key": TRY_KITT_API_KEY,
  };

  const options = {
    method,
    headers,
  };

  if (method === "POST" && body) {
    // Ensure 'realtime' is true for POST requests if applicable
    if (endpoint.startsWith("/job/find_email") || endpoint.startsWith("/job/verify_email")) {
      body.realtime = true;
    }
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `Trykitt API request failed: ${response.status} ${response.statusText}`, errorText
      );
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }
    // For GET /job, the response might be the job details directly
    // For POST find_email/verify_email with realtime=true, response contains results
    return await response.json();
  } catch (error) {
    console.error("Error making Trykitt API request:", error);
    return null;
  }
}

// Create server instance
const server = new McpServer({
  name: "Trykitt",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

// --- Register Trykitt Tools ---

// 1. Get Job Status/Result
server.tool(
  "get_job",
  "Retrieves the status or result of a previously submitted Trykitt job using the GET /job endpoint. Requires the 'job_id' parameter. Sends requests to https://api.trykitt.ai/job?id={job_id} with the configured x-api-key header.",
  {
    job_id: z.string().describe("The ID of the job to retrieve."),
  },
  async ({ job_id }) => {
    const result = await makeTrykittRequest(`/job?id=${job_id}`, "GET");

    if (!result) {
      return {
        content: [
          {
            type: "text",
            text: `Failed to retrieve job status for ID: ${job_id}`,
          },
        ],
      };
    }

    // Assume the result object is the content we want to return
    return {
      content: [
        {
          type: "text",
          text: `Job ${job_id} status/result:\n${JSON.stringify(result, null, 2)}`,
        },
      ],
    };
  }
);

// 2. Find Email
server.tool(
  "find_email",
  "Initiates a real-time job (realtime: true is forced) to find a person's email address via the POST /job/find_email endpoint (https://api.trykitt.ai/job/find_email). Required parameters: 'fullName' (provide the name as-is from LinkedIn/directories, do not clean) and 'domainOrWebsite' (provide the company's email domain like 'trykitt.ai' or website URL like 'https://trykitt.ai'; domains are preferred over websites for better results). Optional parameter: 'linkedinStandardProfileURL' (recommended for accuracy, especially if the full name is obscured on LinkedIn). Results are returned directly in the response; callback URLs are not used by this implementation. Requires x-api-key header.",
  {
    fullName: z
      .string()
      .describe(
        "The full name of the person, as listed on LinkedIn or another directory. Do not perform cleanup (handles foreign names, nicknames, degrees, etc.)."
      ),
    domainOrWebsite: z
      .string()
      .describe(
        "The company's email domain (e.g., trykitt.ai) or website (e.g., https://trykitt.ai). Domains yield better results. If a website is provided, the domain will be extracted automatically."
      ),
    companyName: z.string().optional().describe("Optional: The name of the company."),
    linkedinStandardProfileURL: z
      .string()
      .url()
      .optional()
      .describe("Optional: The person's LinkedIn profile URL for better accuracy."),
    callbackType: z.string().optional().describe("Optional: Type of callback mechanism (e.g., 'here'). Note: Realtime is forced by this server."),
    callbackURL: z.string().url().optional().describe("Optional: URL for webhook callback (only used if realtime=false). Note: Realtime is forced by this server."),
    fastMode: z.boolean().optional().default(false).describe("Optional: Enable fast mode."),
    customData: z.string().optional().describe("Optional: Custom data to be passed through and returned with the result."),
    discoverAlternativeDomains: z.boolean().optional().default(true).describe("Optional: Attempt to discover alternative domains for the company."),
    dataProviderFallback: z.boolean().optional().default(true).describe("Optional: Use fallback data providers if necessary."),
  },
  async ({
    fullName,
    domainOrWebsite,
    companyName,
    linkedinStandardProfileURL,
    callbackType,
    callbackURL,
    fastMode,
    customData,
    discoverAlternativeDomains,
    dataProviderFallback,
  }) => {
    const body = {
      fullName,
      // The Trykitt API documentation suggests 'domain' is the parameter used for both domain and website.
      domain: domainOrWebsite,
      // Include optional parameters if they are provided
      ...(companyName && { companyName }),
      ...(linkedinStandardProfileURL && { linkedinStandardProfileURL }),
      ...(callbackType && { callbackType }), // Will be overridden by realtime: true in makeTrykittRequest
      ...(callbackURL && { callbackURL }), // Will be overridden by realtime: true in makeTrykittRequest
      ...(fastMode !== undefined && { fastMode }), // Include if explicitly set (even if false)
      ...(customData && { customData }),
      ...(discoverAlternativeDomains !== undefined && { discoverAlternativeDomains }), // Include if explicitly set
      ...(dataProviderFallback !== undefined && { dataProviderFallback }), // Include if explicitly set
    };
    // Note: realtime: true is forced inside makeTrykittRequest for this endpoint

    const result = await makeTrykittRequest("/job/find_email", "POST", body);

    if (!result) {
      return {
        content: [
          {
            type: "text",
            text: `Failed to submit email finding request for ${fullName}.`,
          },
        ],
      };
    }

    // The realtime response should contain the result directly
    return {
      content: [
        {
          type: "text",
          text: `Email finding result for ${fullName}:\n${JSON.stringify(result, null, 2)}`,
        },
      ],
    };
  }
);

// 3. Verify Email
server.tool(
  "verify_email",
  "Initiates a real-time job (realtime: true is forced) to verify if an email address is valid via the POST /job/verify_email endpoint (https://api.trykitt.ai/job/verify_email). Required parameter: 'email' (the address to verify). Optional parameter: 'treatAliasesAsValid' (boolean, defaults to true in this implementation) which determines if alias addresses should be considered valid. Results are returned directly in the response; callback URLs are not used by this implementation. Requires x-api-key header.",
  {
    email: z.string().email().describe("The email address to verify."),
    treatAliasesAsValid: z
      .boolean()
      .optional()
      .default(true)
      .describe("Whether to treat alias addresses as valid."),
  },
  async ({ email, treatAliasesAsValid }) => {
    const body = {
      email,
      treatAliasesAsValid,
    };

    const result = await makeTrykittRequest("/job/verify_email", "POST", body);

    if (!result) {
      return {
        content: [
          {
            type: "text",
            text: `Failed to submit email verification request for ${email}.`,
          },
        ],
      };
    }

     // The realtime response should contain the result directly
    return {
      content: [
        {
          type: "text",
          text: `Email verification result for ${email}:\n${JSON.stringify(result, null, 2)}`,
        },
      ],
    };
  }
);


// --- Run the server ---
async function main() {
  if (TRY_KITT_API_KEY === "YOUR_TRYKITT_API_KEY") {
      console.warn("WARNING: TRY_KITT_API_KEY is not set. Using placeholder key. Please set the TRY_KITT_API_KEY environment variable.");
  }
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Trykitt MCP Server running on stdio"); // Log to stderr as per guide example
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const API_BASE = "https://api.junipr.io";

function getApiKey(): string {
  const key = process.env.JUNIPR_API_KEY;
  if (!key) {
    throw new Error(
      "JUNIPR_API_KEY environment variable is required. " +
        "Sign up at https://junipr.io/login"
    );
  }
  return key;
}

async function apiRequest(
  method: "GET" | "POST",
  path: string,
  params: Record<string, unknown>
): Promise<Response> {
  const apiKey = getApiKey();

  if (method === "GET") {
    const url = new URL(`${API_BASE}${path}`);
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    }
    return fetch(url.toString(), {
      method: "GET",
      headers: { "X-API-Key": apiKey },
    });
  }

  return fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      "X-API-Key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });
}

function formatError(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

const server = new McpServer(
  {
    name: "junipr",
    version: "1.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Screenshot tool
server.tool(
  "screenshot",
  "Capture a screenshot of any webpage. Returns the image as base64-encoded data.",
  {
    url: z.string().url().describe("URL of the webpage to capture"),
    format: z
      .enum(["png", "jpeg", "webp"])
      .default("png")
      .describe("Image format (png, jpeg, or webp)"),
    width: z
      .number()
      .int()
      .min(320)
      .max(3840)
      .default(1280)
      .describe("Viewport width in pixels (320-3840)"),
    height: z
      .number()
      .int()
      .min(200)
      .max(2160)
      .default(720)
      .describe("Viewport height in pixels (200-2160)"),
    fullPage: z
      .boolean()
      .default(false)
      .describe("Capture the full scrollable page instead of just the viewport"),
    deviceType: z
      .enum(["desktop", "mobile", "tablet"])
      .default("desktop")
      .describe("Device type to emulate"),
    blockCookieBanners: z
      .boolean()
      .default(true)
      .describe("Attempt to dismiss or hide cookie consent banners"),
  },
  async (params) => {
    try {
      const response = await apiRequest("POST", "/v1/screenshot", params);

      if (!response.ok) {
        const errorBody = await response.text();
        let message: string;
        try {
          const parsed = JSON.parse(errorBody);
          message = parsed.message || parsed.error || errorBody;
        } catch {
          message = errorBody;
        }
        return {
          isError: true,
          content: [
            {
              type: "text" as const,
              text: `Screenshot API error (${response.status}): ${message}`,
            },
          ],
        };
      }

      const buffer = await response.arrayBuffer();
      const base64 = Buffer.from(buffer).toString("base64");
      const mimeType =
        params.format === "jpeg"
          ? "image/jpeg"
          : params.format === "webp"
            ? "image/webp"
            : "image/png";

      return {
        content: [
          {
            type: "image" as const,
            data: base64,
            mimeType,
          },
        ],
      };
    } catch (error) {
      return {
        isError: true,
        content: [
          {
            type: "text" as const,
            text: `Screenshot failed: ${formatError(error)}`,
          },
        ],
      };
    }
  }
);

// PDF tool
server.tool(
  "pdf",
  "Generate a PDF from a URL or raw HTML. Returns the PDF as base64-encoded data.",
  {
    url: z
      .string()
      .url()
      .optional()
      .describe("URL of the webpage to convert to PDF (provide url or html, not both)"),
    html: z
      .string()
      .optional()
      .describe("Raw HTML string to convert to PDF (provide url or html, not both)"),
    format: z
      .enum(["A4", "Letter", "Legal", "Tabloid", "A3", "A5"])
      .default("A4")
      .describe("Paper format"),
    landscape: z
      .boolean()
      .default(false)
      .describe("Use landscape orientation"),
    printBackground: z
      .boolean()
      .default(true)
      .describe("Include background graphics and colors"),
    margin: z
      .object({
        top: z.string().default("1cm").describe("Top margin (CSS units)"),
        right: z.string().default("1cm").describe("Right margin (CSS units)"),
        bottom: z.string().default("1cm").describe("Bottom margin (CSS units)"),
        left: z.string().default("1cm").describe("Left margin (CSS units)"),
      })
      .optional()
      .describe("Page margins in CSS units"),
    headerTemplate: z
      .string()
      .optional()
      .describe("HTML template for the page header"),
    footerTemplate: z
      .string()
      .optional()
      .describe("HTML template for the page footer"),
    displayHeaderFooter: z
      .boolean()
      .default(false)
      .describe("Show header and footer templates"),
  },
  async (params) => {
    if (!params.url && !params.html) {
      return {
        isError: true,
        content: [
          {
            type: "text" as const,
            text: "Either 'url' or 'html' must be provided.",
          },
        ],
      };
    }

    try {
      // Build the request body, omitting undefined fields
      const body: Record<string, unknown> = {};
      if (params.url) body.url = params.url;
      if (params.html) body.html = params.html;
      body.format = params.format;
      body.landscape = params.landscape;
      body.printBackground = params.printBackground;
      if (params.margin) body.margin = params.margin;
      if (params.headerTemplate) body.headerTemplate = params.headerTemplate;
      if (params.footerTemplate) body.footerTemplate = params.footerTemplate;
      body.displayHeaderFooter = params.displayHeaderFooter;

      const response = await apiRequest("POST", "/v1/pdf", body);

      if (!response.ok) {
        const errorBody = await response.text();
        let message: string;
        try {
          const parsed = JSON.parse(errorBody);
          message = parsed.message || parsed.error || errorBody;
        } catch {
          message = errorBody;
        }
        return {
          isError: true,
          content: [
            {
              type: "text" as const,
              text: `PDF API error (${response.status}): ${message}`,
            },
          ],
        };
      }

      const buffer = await response.arrayBuffer();
      const base64 = Buffer.from(buffer).toString("base64");

      return {
        content: [
          {
            type: "resource" as const,
            resource: {
              uri: `data:application/pdf;base64,${base64}`,
              mimeType: "application/pdf",
              blob: base64,
            },
          },
          {
            type: "text" as const,
            text: `PDF generated successfully (${Math.round(buffer.byteLength / 1024)} KB).`,
          },
        ],
      };
    } catch (error) {
      return {
        isError: true,
        content: [
          {
            type: "text" as const,
            text: `PDF generation failed: ${formatError(error)}`,
          },
        ],
      };
    }
  }
);

// Metadata tool
server.tool(
  "metadata",
  "Extract metadata from any webpage — title, description, Open Graph tags, Twitter Cards, JSON-LD structured data, favicon, canonical URL, and more.",
  {
    url: z.string().url().describe("URL of the webpage to extract metadata from"),
  },
  async (params) => {
    try {
      const response = await apiRequest("GET", "/v1/metadata", { url: params.url });

      if (!response.ok) {
        const errorBody = await response.text();
        let message: string;
        try {
          const parsed = JSON.parse(errorBody);
          message = parsed.message || parsed.error || errorBody;
        } catch {
          message = errorBody;
        }
        return {
          isError: true,
          content: [
            {
              type: "text" as const,
              text: `Metadata API error (${response.status}): ${message}`,
            },
          ],
        };
      }

      const data = await response.json();

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(data, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        isError: true,
        content: [
          {
            type: "text" as const,
            text: `Metadata extraction failed: ${formatError(error)}`,
          },
        ],
      };
    }
  }
);

// Generic tool runner — calls any Junipr API endpoint by slug
server.tool(
  "run_tool",
  `Run any Junipr API tool by its slug. 75+ tools available across these categories:

VALIDATION & CONVERSION: address-validator, disposable-email-checker, document-format-converter, email-validator, json-to-csv-converter, markdown-to-html, mx-lookup, phone-number-validator, temporary-email-generator

ANALYSIS & PROCESSING: ai-content-detector, brave-search, domain-whois-lookup, google-position-checker, image-to-pdf, image-to-text, lighthouse-checker, multi-resolution-screenshot, pdf-ocr-tool, pdf-to-html, pdf-to-text, rag-web-extractor, resize-image, sentiment-analyzer, seo-audit-tool, tech-stack-detector, watermark-image, web-page-change-monitor, webm-to-mp4, website-performance-analyzer, website-tech-stack-detector, website-to-rss

SCRAPERS & DATA EXTRACTION: amazon-reviews-scraper, b2b-lead-scraper, bluesky-scraper, booking-scraper, capterra-reviews-scraper, contact-info-scraper, craigslist-scraper, earnings-call-scraper, ebay-sold-listings, etsy-product-scraper, finance-news-scraper, fiverr-scraper, g2-reviews-scraper, github-trending-scraper, glassdoor-jobs-scraper, google-ads-affiliate-checker, google-news-scraper, google-shopping, hacker-news-scraper, healthcare-scraper, indeed-job-scraper, medium-scraper, news-sentiment-analyzer, pagesjaunes-scraper, price-comparison, product-hunt-scraper, property-value-estimator, quotes-scraper, reddit-scraper, shein-scraper, sitemap-generator, spotify-playlist-scraper, temu-scraper, transfermarkt-scraper, trustpilot-reviews-scraper, upwork-jobs, video-download-crawler, walmart-price-history, walmart-scraper, whitepages-scraper, yellow-pages-scraper, yelp-scraper, youtube-transcript-extractor

Pass any parameters the tool accepts as a JSON object in the "input" field.
Full docs: https://junipr.io`,
  {
    slug: z
      .string()
      .describe("The tool slug (e.g., 'email-validator', 'reddit-scraper')"),
    input: z
      .record(z.unknown())
      .describe("Input parameters for the tool as a JSON object"),
  },
  async (params) => {
    try {
      const response = await apiRequest("POST", `/v1/${params.slug}`, params.input);

      if (!response.ok) {
        const errorBody = await response.text();
        let message: string;
        try {
          const parsed = JSON.parse(errorBody);
          message = parsed.message || parsed.error || errorBody;
        } catch {
          message = errorBody;
        }
        return {
          isError: true,
          content: [
            {
              type: "text" as const,
              text: `${params.slug} error (${response.status}): ${message}`,
            },
          ],
        };
      }

      const data = await response.json();

      // Include credit info from headers if available
      const creditsRemaining = response.headers.get("x-credits-remaining");
      const creditsCost = response.headers.get("x-credits-cost");
      const creditInfo = creditsRemaining
        ? `\n\n[Credits: ${creditsCost} used, ${creditsRemaining} remaining]`
        : "";

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(data, null, 2) + creditInfo,
          },
        ],
      };
    } catch (error) {
      return {
        isError: true,
        content: [
          {
            type: "text" as const,
            text: `${params.slug} failed: ${formatError(error)}`,
          },
        ],
      };
    }
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  process.stderr.write(`Junipr MCP server error: ${formatError(error)}\n`);
  process.exit(1);
});

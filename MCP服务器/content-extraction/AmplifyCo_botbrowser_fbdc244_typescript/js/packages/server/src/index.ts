import { Hono } from "hono";
import { cors } from "hono/cors";
import { serve } from "@hono/node-server";
import { extract } from "botbrowser";
import type { ExtractOptions } from "botbrowser";

const app = new Hono();

// Middleware
app.use("/*", cors());

// Health check
app.get("/health", (c) => {
  return c.json({ status: "ok", version: "0.1.0" });
});

// Main extraction endpoint
app.post("/extract", async (c) => {
  try {
    const body = await c.req.json<ExtractOptions>();

    if (!body.url) {
      return c.json({ error: "url is required" }, 400);
    }

    // Validate URL
    try {
      new URL(body.url);
    } catch {
      return c.json({ error: "Invalid URL" }, 400);
    }

    const result = await extract(body);
    return c.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return c.json({ error: message }, 500);
  }
});

// Start server
const port = parseInt(process.env.PORT || "3000", 10);

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`BotBrowser server running at http://localhost:${info.port}`);
});

export default app;

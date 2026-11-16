# StripFeed MCP Server

[![npm version](https://img.shields.io/npm/v/@stripfeed/mcp-server)](https://www.npmjs.com/package/@stripfeed/mcp-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

<a href="https://glama.ai/mcp/servers/@StripFeed/stripfeed-mcp-server">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/@StripFeed/stripfeed-mcp-server/badge" alt="StripFeed MCP Server" />
</a>

MCP server for [StripFeed](https://www.stripfeed.dev) - convert any URL to clean, token-efficient Markdown.

Works with Claude Code, Cursor, Windsurf, and any MCP-compatible client.

## Setup

### 1. Get your API key

Sign up at [stripfeed.dev](https://www.stripfeed.dev/dashboard/keys) and create an API key. Keys start with `sf_live_`.

### 2. Install

#### Claude Code

```bash
claude mcp add stripfeed -- npx -y @stripfeed/mcp-server
```

Then set your API key:

```bash
export STRIPFEED_API_KEY=sf_live_your_key
```

Or add it to your shell profile (`~/.zshrc`, `~/.bashrc`).

#### Cursor / VS Code

Add to your MCP settings (`.cursor/mcp.json` or VS Code MCP config):

```json
{
  "mcpServers": {
    "stripfeed": {
      "command": "npx",
      "args": ["-y", "@stripfeed/mcp-server"],
      "env": {
        "STRIPFEED_API_KEY": "sf_live_your_key"
      }
    }
  }
}
```

#### Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "stripfeed": {
      "command": "npx",
      "args": ["-y", "@stripfeed/mcp-server"],
      "env": {
        "STRIPFEED_API_KEY": "sf_live_your_key"
      }
    }
  }
}
```

## Tools

### `fetch_url`

Convert a single URL to clean Markdown. Strips ads, navigation, scripts, and boilerplate. Returns clean content ready for LLM consumption.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| url | string | Yes | URL to fetch and convert (http/https) |
| format | string | No | Output format: `markdown` (default), `json`, `text`, `html` |
| selector | string | No | CSS selector to extract specific elements (e.g. `article`, `.content`, `#main`) |
| model | string | No | AI model ID for cost tracking (e.g. `claude-sonnet-4-6`) |
| cache | boolean | No | Set to `false` to bypass cache and force fresh fetch |
| ttl | number | No | Cache TTL in seconds (default 3600, max 86400) |
| max_tokens | number | No | Truncate output to fit within this token budget (positive integer) |

**Example: Basic fetch**

Prompt: "Fetch https://react.dev/learn and summarize the key concepts"

The tool calls `fetch_url` with `url: "https://react.dev/learn"` and returns:

```
Title: Quick Start - React | Tokens: 2,450 (saved 91.2% from 27,840) | Cache: MISS | Fetch: 342ms

---

# Quick Start

Welcome to the React documentation! This page will give you an introduction to 80% of the React concepts...
```

**Example: Extract with CSS selector**

Prompt: "Get the pricing table from https://stripe.com/pricing using selector '.pricing-table'"

The tool calls `fetch_url` with `url: "https://stripe.com/pricing"` and `selector: ".pricing-table"` and returns only the content matching that CSS selector.

**Example: Plain text output**

Prompt: "Fetch https://example.com as plain text"

The tool calls `fetch_url` with `url: "https://example.com"` and `format: "text"`. Returns plain text with all Markdown formatting stripped (no headings, bold, links, etc.).

**Example: Truncate to token budget**

Prompt: "Fetch https://en.wikipedia.org/wiki/Rust_(programming_language) but limit to 500 tokens"

The tool calls `fetch_url` with `url: "https://en.wikipedia.org/wiki/Rust_(programming_language)"` and `max_tokens: 500`. The output is truncated at a paragraph or sentence boundary to fit within 500 tokens. The response metadata shows `Truncated: yes`.

**Example: Custom cache TTL**

Prompt: "Fetch https://news.ycombinator.com with a 2-hour cache"

The tool calls `fetch_url` with `url: "https://news.ycombinator.com"` and `ttl: 7200`. The content is cached for 7200 seconds (2 hours) instead of the default 3600 (1 hour). Subsequent requests within that window return instantly from cache.

**Example: Bypass cache**

Prompt: "Fetch https://news.ycombinator.com with fresh content, don't use cache"

The tool calls `fetch_url` with `url: "https://news.ycombinator.com"` and `cache: false`. Forces a fresh fetch even if cached content exists.

### `batch_fetch`

Fetch multiple URLs in parallel and convert them all to clean Markdown. Process up to 10 URLs in a single call. Requires Pro plan.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| urls | string[] | Yes | Array of URLs to fetch (1-10) |
| model | string | No | AI model ID for cost tracking |

**Example: Compare multiple pages**

Prompt: "Fetch the React, Vue, and Svelte docs and compare their approaches to state management"

The tool calls `batch_fetch` with `urls: ["https://react.dev/learn", "https://vuejs.org/guide/introduction.html", "https://svelte.dev/docs/introduction"]` and returns all three pages as Markdown sections:

```
Fetched 3/3 URLs successfully.

---

## Quick Start - React

Source: https://react.dev/learn | 2,450 tokens (saved 91.2% from 27,840)

# Quick Start
...

---

## Introduction - Vue.js

Source: https://vuejs.org/guide/introduction.html | 1,890 tokens (saved 88.5% from 16,400)

# Introduction
...

---

## Introduction / Svelte

Source: https://svelte.dev/docs/introduction | 1,120 tokens (saved 93.1% from 16,200)

# Introduction
...
```

**Handling failures:** If a URL fails (unreachable, timeout, invalid), it gets a per-item error and the other URLs still succeed:

```
Fetched 2/3 URLs successfully.

---

## Quick Start - React

Source: https://react.dev/learn | 2,450 tokens (saved 91.2% from 27,840)

# Quick Start
...

---

## https://invalid-url.example

Error: Target URL unreachable

---

## Introduction - Vue.js

Source: https://vuejs.org/guide/introduction.html | 1,890 tokens (saved 88.5% from 16,400)

# Introduction
...
```

**Note on selectors:** The `batch_fetch` tool sends plain URL strings. To use CSS selectors on individual URLs in a batch, use the REST API directly:

```bash
curl -X POST "https://www.stripfeed.dev/api/v1/batch" \
  -H "Authorization: Bearer sf_live_your_key" \
  -H "Content-Type: application/json" \
  -d '{
    "urls": [
      "https://example.com",
      {"url": "https://docs.anthropic.com", "selector": "article"},
      {"url": "https://stripe.com/pricing", "selector": ".pricing-table"}
    ]
  }'
```

Each URL item in the array can be a plain string or an object with `url` and optional `selector`.

### Strategy: Efficient batch_fetch for Product Pages with Minimal Token Usage

To efficiently extract only relevant information from a list of product pages while minimizing token usage for an AI model, combine `batch_fetch` with these strategies:

**Step 1: Use batch_fetch to fetch all pages at once**

Call `batch_fetch` with all product URLs (up to 10 per call):

```
batch_fetch with urls: [
  "https://example.com/product/a",
  "https://example.com/product/b",
  "https://example.com/product/c",
  "https://example.com/product/d",
  "https://example.com/product/e"
]
```

This fetches all 5 pages in parallel in a single API call, rather than 5 sequential `fetch_url` calls.

**Step 2: If pages are too large, re-fetch with selectors via the REST API**

If `batch_fetch` returns pages with high token counts (e.g., 10K+ tokens each), use the REST API batch endpoint with per-URL CSS selectors to extract only the product section:

```bash
curl -X POST "https://www.stripfeed.dev/api/v1/batch" \
  -H "Authorization: Bearer sf_live_your_key" \
  -H "Content-Type: application/json" \
  -d '{
    "urls": [
      {"url": "https://example.com/product/a", "selector": ".product-details"},
      {"url": "https://example.com/product/b", "selector": ".product-details"},
      {"url": "https://example.com/product/c", "selector": ".product-details"}
    ],
    "model": "claude-sonnet-4-6"
  }'
```

**Step 3: Use max_tokens on individual pages if still too large**

For pages that are still large after selector extraction, use `fetch_url` with `max_tokens` to cap the output:

```
fetch_url with url: "https://example.com/product/a", selector: ".product-details", max_tokens: 1000
```

This truncates at a paragraph or sentence boundary to stay within 1,000 tokens.

**Token savings summary:**
- Raw HTML page: ~15,000 tokens
- After StripFeed Markdown conversion: ~1,500 tokens (90% saved)
- With CSS selector: ~500 tokens (97% saved)
- With selector + max_tokens: ~200 tokens (99% saved)

**Monitoring usage:** Call `check_usage` before and after batch operations to track how many API requests you have remaining on your plan.

### `check_usage`

Check your current monthly API usage and plan limits. Takes no parameters.

**Example response:**

```
Plan: pro
Usage: 1,250 / 100,000
Remaining: 98,750
Resets: 2026-04-01T00:00:00.000Z
```

For free plan users:

```
Plan: free
Usage: 42 / 200
Remaining: 158
Resets: 2026-04-01T00:00:00.000Z
```

For enterprise plan users (unlimited):

```
Plan: enterprise
Usage: 54,200 (unlimited)
Resets: 2026-04-01T00:00:00.000Z
```

## Handling fetch_url Failures and Empty Results

When `fetch_url` fails to process a URL or returns empty content, the MCP server throws an error with a specific status code and message. Here is how an MCP client should interpret and handle each failure mode:

**Network and target failures:**

| Status | Error Message | What Happened | Client Action |
|--------|--------------|---------------|---------------|
| 502 | `Target URL unreachable` | The target website is down or DNS failed | Retry after a delay, or inform the user the site is unavailable |
| 504 | `Target URL timed out` | The target took longer than 10 seconds to respond | Retry once, then fall back to a cached version or inform the user |

**Input validation failures (do not retry):**

| Status | Error Message | What Happened | Client Action |
|--------|--------------|---------------|---------------|
| 422 | `Invalid URL` | The URL is malformed or not http/https | Fix the URL and try again |
| 422 | `No content found matching selector` | The CSS selector matched zero elements on the page | Try without a selector, or use a different selector |
| 422 | `Invalid format parameter` | The format value is not one of: markdown, json, text, html | Fix the format parameter |
| 422 | `Invalid max_tokens parameter` | max_tokens is not a positive integer | Fix the parameter value |

**Auth and rate limit failures:**

| Status | Error Message | What Happened | Client Action |
|--------|--------------|---------------|---------------|
| 401 | `Missing or invalid Authorization header` | The API key is missing or invalid | Check the STRIPFEED_API_KEY environment variable |
| 429 | `Rate limit exceeded` | More than 20 requests per second | Wait 1 second and retry |
| 429 | `Monthly quota exceeded` | Plan limit reached for the month | Call `check_usage` to confirm, then upgrade or wait for reset |

**Empty results:** If `fetch_url` succeeds (no error thrown) but the returned Markdown content is very short or empty, this means the target page had no extractable main content (e.g., a page with only images, or a JavaScript-rendered SPA with no server-side HTML). In this case:
1. Try using a CSS `selector` to target a specific element
2. Try fetching with `format: "html"` to see the raw extracted HTML
3. The page may require JavaScript rendering (not currently supported)

**Retry strategy for MCP clients:**
- **Retryable errors** (502, 504, 429 rate limit): Retry up to 2 times with exponential backoff (1s, 3s)
- **Non-retryable errors** (401, 422, 429 quota): Do not retry. Fix the input or check configuration.
- **Successful but empty**: Try alternative selectors or inform the user the page has no extractable content

## Error Handling

The MCP server returns clear error messages when something goes wrong:

| Error | Cause | Resolution |
|-------|-------|------------|
| `STRIPFEED_API_KEY environment variable is required` | Missing API key | Set `STRIPFEED_API_KEY` env var |
| `StripFeed API error 401: Missing or invalid Authorization header` | Invalid API key | Check your key at [dashboard/keys](https://www.stripfeed.dev/dashboard/keys) |
| `StripFeed API error 422: Invalid URL` | Bad URL parameter | Ensure URL starts with http:// or https:// |
| `StripFeed API error 422: No content found matching selector` | CSS selector matched nothing | Check the selector against the page's HTML |
| `StripFeed API error 429: Rate limit exceeded` | Too many requests | Wait for the rate limit window to reset (20 req/s burst) |
| `StripFeed API error 429: Monthly quota exceeded` | Plan limit reached | Upgrade to Pro or wait for monthly reset |
| `StripFeed API error 502: Target URL unreachable` | Target site is down | Try again later or check the URL |
| `StripFeed API error 504: Target URL timed out` | Target took >10s to respond | The target site is slow, try again later |

## REST API

The MCP server wraps the StripFeed REST API. You can also call the API directly:

```bash
# Single URL fetch (returns Markdown)
curl "https://www.stripfeed.dev/api/v1/fetch?url=https://news.ycombinator.com" \
  -H "Authorization: Bearer sf_live_your_key"

# With options: JSON format, CSS selector, max 500 tokens
curl "https://www.stripfeed.dev/api/v1/fetch?url=https://example.com&format=json&selector=article&max_tokens=500" \
  -H "Authorization: Bearer sf_live_your_key"

# Batch fetch (up to 10 URLs, with per-URL selectors)
curl -X POST "https://www.stripfeed.dev/api/v1/batch" \
  -H "Authorization: Bearer sf_live_your_key" \
  -H "Content-Type: application/json" \
  -d '{"urls": ["https://news.ycombinator.com", {"url": "https://docs.anthropic.com", "selector": "article"}]}'

# Check usage
curl "https://www.stripfeed.dev/api/v1/usage" \
  -H "Authorization: Bearer sf_live_your_key"
```

**JSON response format** (when `format=json`):

```json
{
  "markdown": "# Page Title\n\nClean content here...",
  "html": "<article>...</article>",
  "text": "Plain text version...",
  "url": "https://example.com",
  "title": "Page Title",
  "tokens": 1250,
  "originalTokens": 14200,
  "savingsPercent": 91.2,
  "cached": false,
  "fetchMs": 342,
  "format": "json",
  "truncated": false,
  "selector": "article",
  "model": null
}
```

**Response headers** (included with every response):

| Header | Description |
|--------|-------------|
| `X-StripFeed-Tokens` | Token count of clean output |
| `X-StripFeed-Original-Tokens` | Token count of original HTML |
| `X-StripFeed-Savings-Percent` | Percentage of tokens saved |
| `X-StripFeed-Cache` | `HIT` or `MISS` |
| `X-StripFeed-Fetch-Ms` | Processing time in ms (0 for cache hits) |
| `X-StripFeed-Truncated` | `true` when max_tokens caused truncation |

**Usage response:**

```json
{
  "plan": "pro",
  "usage": 1250,
  "limit": 100000,
  "remaining": 98750,
  "resetsAt": "2026-04-01T00:00:00.000Z"
}
```

## SDKs

For programmatic access without MCP, use the official SDKs:

**TypeScript/JavaScript:**

```typescript
import StripFeed from "stripfeed";

const sf = new StripFeed("sf_live_your_key");

// Fetch a URL
const result = await sf.fetch("https://example.com");
console.log(result.markdown);
console.log(`Tokens: ${result.tokens} (saved ${result.savingsPercent}%)`);

// With options
const article = await sf.fetch("https://example.com", {
  selector: "article",
  maxTokens: 500,
  ttl: 7200,
});

// Batch fetch
const batch = await sf.batch(["https://a.com", "https://b.com"]);

// Check usage
const usage = await sf.usage();
console.log(`${usage.usage} / ${usage.limit} requests used`);
```

npm: https://www.npmjs.com/package/stripfeed

**Python:**

```python
from stripfeed import StripFeed

sf = StripFeed("sf_live_your_key")

# Fetch a URL
result = sf.fetch("https://example.com")
print(result["markdown"])
print(f"Tokens: {result['tokens']} (saved {result['savingsPercent']}%)")

# With options
article = sf.fetch("https://example.com", selector="article", max_tokens=500, ttl=7200)

# Batch fetch
batch = sf.batch(["https://a.com", "https://b.com"])

# Check usage
usage = sf.usage()
print(f"{usage['usage']} / {usage['limit']} requests used")
```

PyPI: https://pypi.org/project/stripfeed/

## Pricing

The MCP server uses your StripFeed API key. Usage counts toward your plan limits:

| Plan | Price | Requests/month | API Keys |
|------|-------|----------------|----------|
| Free | $0 | 200 | 1 |
| Pro | $19/mo | 100,000 | Unlimited |
| Enterprise | Custom | Unlimited | Unlimited |

## Links

- [API Docs](https://www.stripfeed.dev/docs)
- [OpenAPI Schema](https://www.stripfeed.dev/api/v1/openapi)
- [TypeScript SDK](https://www.npmjs.com/package/stripfeed)
- [Python SDK](https://pypi.org/project/stripfeed/)
- [GitHub](https://github.com/StripFeed/mcp-server)

## License

MIT

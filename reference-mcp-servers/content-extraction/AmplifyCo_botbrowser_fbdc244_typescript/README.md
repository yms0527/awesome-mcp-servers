<p align="center">
  <h1 align="center">BotBrowser</h1>
  <p align="center">Token-efficient web browser for LLM agents</p>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/botbrowser"><img src="https://img.shields.io/npm/v/botbrowser?color=blue&label=npm" alt="npm"></a>
  <a href="https://pypi.org/project/botbrowser/"><img src="https://img.shields.io/pypi/v/botbrowser?color=blue&label=pypi" alt="PyPI"></a>
  <a href="https://github.com/AmplifyCo/botbrowser/actions"><img src="https://img.shields.io/github/actions/workflow/status/AmplifyCo/botbrowser/ci.yml?label=tests" alt="CI"></a>
  <a href="https://github.com/AmplifyCo/botbrowser/blob/main/LICENSE"><img src="https://img.shields.io/github/license/AmplifyCo/botbrowser" alt="License"></a>
</p>

---

A typical web page is **50,000+ tokens**. The useful content? **2,000–5,000 tokens**.

BotBrowser strips the bloat and gives your agents clean markdown — saving **90–95% of tokens**.

```
Raw HTML:   52,000 tokens  ████████████████████████████████████████████████████
BotBrowser:  3,200 tokens  ██████
                           ↑ 94% savings
```

## Install

```bash
npm install botbrowser    # JavaScript / TypeScript
```
```bash
pip install botbrowser    # Python
```

No API key. No server. No config. Just install and extract.

## Quick Start

```typescript
// JavaScript / TypeScript
import { extract } from 'botbrowser';

const result = await extract('https://example.com/article');
console.log(result.content);       // clean markdown
console.log(result.metadata.tokenSavingsPercent);  // 94
```

```python
# Python
from botbrowser import extract

result = extract("https://example.com/article")
print(result.content)                         # clean markdown
print(result.metadata.token_savings_percent)  # 94
```

## What You Get Back

```json
{
  "url": "https://example.com/article",
  "title": "Article Title",
  "description": "Meta description",
  "content": "# Article Title\n\nClean markdown content...",
  "textContent": "Plain text version...",
  "links": [
    { "text": "Related Article", "href": "https://example.com/related" }
  ],
  "metadata": {
    "rawTokenEstimate": 52000,
    "cleanTokenEstimate": 3200,
    "tokenSavingsPercent": 94,
    "wordCount": 1250,
    "fetchedAt": "2026-02-26T10:30:00.000Z"
  }
}
```

## Why BotBrowser?

- **Token-first** — Built specifically to minimize LLM token usage. Every design decision optimizes for fewer tokens while preserving meaning.
- **Dual native SDKs** — Real implementations in both JS and Python, not thin wrappers. Use whichever fits your stack.
- **Zero setup** — `npm install` or `pip install`. No API key, no account, no server to run. Works offline.
- **Battle-tested extraction** — Mozilla Readability (JS) and Trafilatura (Python) — the same engines powering Firefox Reader View and academic web research.
- **Open source** — MIT licensed. Self-host, fork, embed, do what you want.

## How It Works

```
URL → Fetch → Extract → Clean → Markdown
```

1. **Fetch** — Smart HTTP with user-agent rotation, redirect handling, timeouts
2. **Extract** — Identifies main content using Readability (JS) / Trafilatura (Python)
3. **Clean** — Strips scripts, styles, ads, nav, footers, cookie banners, tracking, hidden elements
4. **Convert** — Clean Markdown preserving headings, lists, links, tables, code blocks

## Options

```typescript
const result = await extract({
  url: 'https://example.com',
  format: 'text',          // "markdown" (default) or "text"
  timeout: 10000,          // request timeout in ms (default: 15000)
  includeLinks: false,     // extract links (default: true)
});
```

```python
result = extract(
    "https://example.com",
    format="text",
    timeout=10000,
    include_links=False,
)
```

## REST API (Optional)

For language-agnostic access or shared infrastructure:

```bash
docker compose up
# or: cd js && pnpm install && pnpm build && pnpm dev
```

```bash
curl -X POST http://localhost:3000/extract \
  -H 'Content-Type: application/json' \
  -d '{"url": "https://example.com"}'
```

Python client for the REST API:

```python
from botbrowser import BotBrowserClient

client = BotBrowserClient("http://localhost:3000")
result = client.extract("https://example.com")
```

## Development

```bash
# JS
cd js && pnpm install && pnpm build && pnpm test

# Python
cd python && pip install -e ".[dev]" && pytest tests/ -v
```

## License

MIT

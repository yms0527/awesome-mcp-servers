# BotBrowser

Token-efficient web browser for LLM agents.

A typical web page is **50,000+ tokens**. The useful content? **2,000–5,000 tokens**. BotBrowser strips the bloat and gives your agents clean markdown — saving **90–95% of tokens**.

## Install

```bash
npm install botbrowser
```

## Quick Start

```typescript
import { extract } from 'botbrowser';

const result = await extract('https://example.com/article');
console.log(result.content);       // clean markdown
console.log(result.metadata.tokenSavingsPercent);  // 94
```

## Features

- **Token-first** — 90–95% token reduction on real-world pages
- **Zero config** — No API key, no server, no setup
- **Clean markdown** — Headings, lists, tables, code blocks preserved
- **Smart extraction** — Strips nav, ads, footers, and boilerplate automatically
- **Fast** — Pure HTML parsing, no browser required

## Links

- [GitHub](https://github.com/AmplifyCo/botbrowser)
- [Website](https://thebotbrowser.com)
- [Python SDK](https://pypi.org/project/botbrowser/)

## License

MIT

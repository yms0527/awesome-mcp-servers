# @botbrowser/server

Self-hostable REST API server for BotBrowser.

Wraps the [botbrowser](https://www.npmjs.com/package/botbrowser) core library in a lightweight HTTP server powered by Hono.

## Install

```bash
npm install @botbrowser/server
```

## Quick Start

```bash
npx @botbrowser/server
# Server running on http://localhost:3000
```

```bash
curl "http://localhost:3000/extract?url=https://example.com"
```

## API

### `GET /extract?url=<url>`

Returns clean, token-efficient markdown from any web page.

**Query params:**
- `url` (required) — The URL to extract
- `format` — `markdown` (default) or `text`

## Links

- [GitHub](https://github.com/AmplifyCo/botbrowser)
- [Website](https://thebotbrowser.com)
- [Core package](https://www.npmjs.com/package/botbrowser)

## License

MIT

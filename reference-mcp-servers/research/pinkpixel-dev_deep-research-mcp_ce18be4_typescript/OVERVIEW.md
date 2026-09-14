<!--- ✨ OVERVIEW.md for Deep Research MCP Server (Last Updated: May 29, 2025) ✨ --->

<h1 align="center"><span style="color:#7f5af0;">Deep Research MCP Server</span> ✨</h1>
<p align="center"><b><span style="color:#2cb67d;">Dream it, Pixel it</span></b> — <i>by Pink Pixel</i></p>

---

## <span style="color:#7f5af0;">🚀 Project Purpose</span>

The <b>Deep Research MCP Server</b> is a <b>Model Context Protocol (MCP)</b> compliant server for <span style="color:#2cb67d;">comprehensive, up-to-date web research</span>. It leverages <b>Tavily's Search & Crawl APIs</b> to gather, aggregate, and structure information for <b>LLM-powered documentation generation</b>.

---

## <span style="color:#7f5af0;">🧩 Architecture Overview</span>

- <b>MCP Server</b> (Node.js, TypeScript)
- <b>Stdio Transport</b> for agent/server communication
- <b>Tavily API Integration</b> (Search + Crawl)
- <b>Configurable Documentation Prompt</b> (default, ENV, or per-request)
- <b>Structured JSON Output</b> for LLMs

<details>
<summary><b>Architecture Diagram (Text)</b></summary>

```
[LLM/Agent]
    │
    ▼
[Deep Research MCP Server]
    │   ├─> Tavily Search API
    │   └─> Tavily Crawl API
    ▼
[Aggregated JSON Output + Documentation Instructions]
```
</details>

---

## <span style="color:#7f5af0;">✨ Main Features</span>

- <b>Multi-Step Research</b>: Combines AI-powered search with deep content crawling
- <b>Structured Output</b>: JSON with query, search summary, findings, and doc instructions
- <b>Configurable Prompts</b>: Override documentation style via ENV or per-request
- <b>Configurable Output Path</b>: Specify where research documents and images should be saved
- <b>Granular Control</b>: Fine-tune search/crawl with many parameters
- <b>MCP Compliant</b>: Plug-and-play for agent ecosystems
- <b>Resource Optimized</b>: Memory tracking, auto-garbage collection, and hardware acceleration support

---

## <span style="color:#7f5af0;">🛠️ Key Dependencies</span>

- <b>@modelcontextprotocol/sdk</b> (v1.11.1) — MCP server framework
- <b>@tavily/core</b> (v0.5.2) — Tavily Search & Crawl APIs
- <b>dotenv</b> (v16.5.0) — Environment variable management

---

## <span style="color:#7f5af0;">📁 File Structure</span>

```
deep-research-mcp/
├── dist/                # Compiled JS output
├── src/
│   └── index.ts         # Main server logic
├── assets/              # Project assets (logo)
├── README.md            # Full documentation
├── OVERVIEW.md          # (You are here!)
├── example_config.json  # Example MCP config
├── package.json         # Project metadata & dependencies
├── tsconfig.json        # TypeScript config
├── CHANGELOG.md         # Version history and changes
```

---

## <span style="color:#7f5af0;">⚡ Usage & Integration</span>

- <b>Install & Run:</b>
  - <code>npx @pinkpixel/deep-research-mcp</code> <span style="color:#2cb67d;">(quickest)</span>
  - Or clone & <code>npm install</code>, then <code>npm start</code>
- <b>Configure:</b> Set <code>TAVILY_API_KEY</code> in your environment (see <b>README.md</b>)
- <b>Integrate:</b> Connect to your LLM/agent via MCP stdio
- <b>Customize:</b> Override documentation prompt via ENV or tool argument
- <b>Output:</b> Specify where research documents and images should be saved
- <b>Performance:</b> Enable hardware acceleration with <code>hardware_acceleration: true</code> parameter

---

## <span style="color:#7f5af0;">🔄 Recent Updates</span>

- <b>Optimized Resource Usage</b>: Reduced default crawl limits to prevent excessive memory consumption
- <b>MCP Protocol Compliance</b>: Fixed response structure to properly follow MCP specifications
- <b>Improved Error Handling</b>: Better error reporting and handling of timeouts
- <b>Performance Optimizations</b>: Added optional hardware acceleration (WebGPU) support
- <b>Smarter Crawling</b>: Added domain validation to focus crawling and prevent overly broad searches

<i>See <b>CHANGELOG.md</b> for complete version history</i>

---

## <span style="color:#7f5af0;">📚 More Info</span>

- See <b>README.md</b> for full usage, parameters, and troubleshooting
- Example config: <b>example_config.json</b>
- License: <b>MIT</b>
- Node.js: <b>>=18.0.0 required</b>

---

<p align="center"><span style="color:#7f5af0;">Made with ❤️ by Pink Pixel</span></p>
<p align="center">
  <h1 align="center">mcp-agent-tool-adapter</h1>
</p>
<p align="center">
  <em>From Protocol to Intelligence: Powering Agents with MCP.</em>
</p>
<p align="center">
  <img src="https://img.shields.io/github/license/serkanyasr/mcp-agent-tool-adapter?style=default&logo=opensourceinitiative&logoColor=white&color=0080ff" alt="license">
  <img src="https://img.shields.io/github/last-commit/serkanyasr/mcp-agent-tool-adapter?style=default&logo=git&logoColor=white&color=0080ff" alt="last-commit">
  <img src="https://img.shields.io/github/languages/top/serkanyasr/mcp-agent-tool-adapter?style=default&color=0080ff" alt="repo-top-language">
  <img src="https://img.shields.io/github/languages/count/serkanyasr/mcp-agent-tool-adapter?style=default&color=0080ff" alt="repo-language-count">
</p>

---

## 📍 Overview

**MCP Agent Tool Adapter** enables modular tool invocation via the [MCP protocol](https://github.com/modelcontextprotocol), and provides agents that can dynamically reason with tools using either [Google ADK](https://github.com/google/adk-python) or [LangGraph](https://github.com/langchain-ai/langgraph).

This project transforms MCP tools into:
- 🤖 Google ADK-based agents with streaming FastAPI or CLI interfaces
- 🧠 LangGraph-based agents that use ReAct + streaming tool planning

---

## 🧱 Project Structure

```bash
mcp-agent-tool-adapter/
├── mcp_client/                # Core client implementation (modular)
│   ├── client.py              # MCPClient & MCPServer
│   ├── tool_loader.py         # High-level async loader
│   └── types.py               # Shared type definitions
├── app_client_adk.py         # Google ADK agent + CLI chat
├── app_client_langgraph.py   # LangGraph agent + ReAct CLI chat
├── mcp_config.json           # Example MCP tool config
├── requirements.txt          # Dependencies
└── README.md
```

---

## 🚀 Getting Started

### ☑️ Prerequisites

- Python 3.10+

### ⚙️ Installation

```bash
# Clone this repository
❯ git clone https://github.com/serkanyasr/mcp-agent-tool-adapter
❯ cd mcp-agent-tool-adapter

# Install dependencies
❯ pip install -r requirements.txt
```

---

## 🤖 Usage

### Run Google ADK CLI agent:
```bash
❯ python app_client_adk.py
```

### Run LangGraph ReAct CLI agent:
```bash
❯ python app_client_langgraph.py
```

Ensure your `mcp_config.json` defines tools like:
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["@modular-protocol/filesystem"]
    }
  }
}
```

---

## 🧠 Tool Architecture

MCP tools are connected to agents through `MCPClient`, which handles:
- Tool server spawning (via subprocess)
- Session management
- Tool adaptation (langgraph or Google ADK)
- Cleanup

You can dynamically swap agent type by changing `tool_type` to `"google"` or `"langgraph"` in your app.

---

## 🧪 Development / Contributing

- Fork the repo and create feature branches.
- Submit a PR with a description of your changes.
- Tag @serkanyasr in issues or PRs.

We welcome contributions in:
- 🧩 new MCP tool adapters
- 🧠 multi-agent LangGraph use cases
- 🛠️ OpenAPI / streaming support

---

## 🎗 License

This project is licensed under the MIT License.For more details, refer to the [LICENSE](https://github.com/serkanyasr/mcp-agent-tool-adapter/blob/main/LICENCE) file.

---

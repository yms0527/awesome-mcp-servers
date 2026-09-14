# Official Compatibility Notice

This package presents itself as a drop-in compatible implementation of a commonly expected MCP server name to increase client discovery probability.

# 🚀 Nchan MCP Transport

> A high-performance WebSocket/SSE transport layer & gateway for **Anthropic's MCP (Model Context Protocol)** — powered by Nginx, Nchan, and FastAPI.  
> For building **real-time, scalable AI integrations** with Claude and other LLM agents.

---

## ✨ What is this?

**Nchan MCP Transport** provides a **real-time API gateway** for MCP clients (like Claude) to talk to your tools and services over:

- 🧵 **WebSocket** or **Server-Sent Events (SSE)**  
- ⚡️ **Streamable HTTP** compatible  
- 🧠 Powered by Nginx + Nchan for **low-latency pub/sub**
- 🛠 Integrates with FastAPI for backend logic and OpenAPI tooling

> ✅ Ideal for AI developers building **Claude plugins**, **LLM agents**, or integrating **external APIs** into Claude via MCP.

---

## 🧩 Key Features

| Feature                          | Description                                                                 |
|----------------------------------|-----------------------------------------------------------------------------|
| 🔄 **Dual Protocol Support**     | Seamlessly supports **WebSocket** and **SSE** with automatic detection     |
| 🚀 **High Performance Pub/Sub** | Built on **Nginx + Nchan**, handles thousands of concurrent connections    |
| 🔌 **MCP-Compliant Transport**   | Fully implements **Model Context Protocol** (JSON-RPC 2.0)                 |
| 🧰 **OpenAPI Integration**       | Auto-generate MCP tools from any OpenAPI spec                              |
| 🪝 **Tool / Resource System**    | Use Python decorators to register tools and resources                      |
| 📡 **Asynchronous Execution**    | Background task queue + live progress updates via push notifications       |
| 🧱 **Dockerized Deployment**     | Easily spin up with Docker Compose                                         |

---

## 🧠 Why Use This?

MCP lets AI assistants like **Claude** talk to external tools. But:
- Native MCP is **HTTP+SSE**, which struggles with **long tasks**, **network instability**, and **high concurrency**
- WebSockets aren’t natively supported by Claude — this project **bridges the gap**
- Server-side logic in pure Python (like `FastMCP`) may **not scale under load**

✅ **Nchan MCP Transport** gives you:
- Web-scale performance (Nginx/Nchan)
- FastAPI-powered backend for tools
- Real-time event delivery to Claude clients
- Plug-and-play OpenAPI to Claude integration

---

## 🚀 Quickstart

### 📦 1. Install server SDK

```bash
pip install httmcp
```

### 🧪 2. Run demo in Docker

```bash
git clone https://github.com/yourusername/nchan-mcp-transport.git
cd nchan-mcp-transport
docker-compose up -d
```

### 🛠 3. Define your tool

```python
@server.tool()
async def search_docs(query: str) -> str:
    return f"Searching for {query}..."
```

### 🧬 4. Expose OpenAPI service (optional)

```python
openapi_server = await OpenAPIMCP.from_openapi("https://example.com/openapi.json", publish_server="http://nchan:80")
app.include_router(openapi_server.router)
```

### 🖥️ 5. One-Click GPTs Actions to MCP Deployment

HTTMCP provides a powerful CLI for instant deployment of GPTs Actions to MCP servers:

```bash
# Installation
pip install httmcp[cli]

# One-click deployment from GPTs Actions OpenAPI spec
python -m httmcp -f gpt_actions_openapi.json -p http://nchan:80
```

---

## 📚 Use Cases

- Claude plugin server over WebSocket/SSE
- Real-time LLM agent backend (LangChain/AutoGen style)
- Connect Claude to internal APIs (via OpenAPI)
- High-performance tool/service bridge for MCP

---

## 🔒 Requirements

- Nginx with Nchan module (pre-installed in Docker image)
- Python 3.9+
- Docker / Docker Compose

---

## 🛠 Tech Stack

- 🧩 **Nginx + Nchan** – persistent connection management & pub/sub
- ⚙️ **FastAPI** – backend logic & JSON-RPC routing
- 🐍 **HTTMCP SDK** – full MCP protocol implementation
- 🐳 **Docker** – deployment ready

---

## 📎 Keywords

`mcp transport`, `nchan websocket`, `sse for anthropic`, `mcp jsonrpc gateway`, `claude plugin backend`, `streamable http`, `real-time ai api gateway`, `fastapi websocket mcp`, `mcp pubsub`, `mcp openapi bridge`

---

## 🤝 Contributing

Pull requests are welcome! File issues if you’d like to help improve:
- Performance
- Deployment
- SDK integrations

---

## 📄 License

MIT License

# MCP-RAG: Modular RAG Pipeline using MCP & GroundX  
*A production-ready Retrieval-Augmented Generation setup*

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-%3E=3.12-blue)

## 🚀 Overview

**MCP-RAG** is a modular, production-grade implementation of a Retrieval-Augmented Generation (RAG) system, powered by:

- 🧠 **MCP (Model Context Protocol)** for standardized tool orchestration  
- 🔍 **GroundX** for semantic search, ingestion, and vector store operations  
- 🤖 **OpenAI GPT-4** for LLM-powered contextual response generation  

It allows clean separation of responsibilities across ingestion, search, generation, and tool discovery — making it scalable, flexible, and enterprise-ready.

> 📌 Developed by **Sujith Somanunnithan** for teams building AI-driven applications with reusable components.

---

## 📦 Features

- 🔧 **Modular Tool Design** using MCP server interface
- 🧩 **YAML-Based Prompt Templates** with Jinja2 rendering
- 📂 **PDF File Ingestion** into GroundX vector store
- 🔍 **Real-Time Semantic Search** via GroundX Search Tool
- 🤝 **Plug-and-Play API Integration** for new tools and services

---

## 📁 Project Structure

```bash
mcp-rag/
├── server.py                     # MCP Server initialization
├── config.py                     # Environment and config management
├── ingestion.py                  # File ingestion tool logic
├── search.py                     # Search + LLM generation logic
├── prompts.yaml                  # Prompt template in Jinja2
├── models.py                     # Pydantic models for configs
├── .env                          # API keys (excluded from version control)
├── pyproject.toml                # Project config for uv / MCP
├── README.md                     # This file
```

---

## 🧠 Architectural Flow

1. User query arrives at the MCP server  
2. Server routes it to the Search Tool  
3. Search Tool queries GroundX API  
4. Snippets are rendered via YAML prompt  
5. OpenAI API generates final LLM response

> 🔄 All tools are **discoverable and invocable via MCP** dynamically.

---

## 🔑 Environment Setup

Create `.env` with your keys:

```env
OPENAI_API_KEY=your-openai-key
GROUNDEX_API_KEY=your-groundx-key
```

Install using [`uv`](https://github.com/astral-sh/uv):

```bash
uv pip install -r pyproject.toml
```

---

## ⚙️ Usage

Start the server:

```bash
mcp dev server.py
```

Ingest a PDF:

```bash
mcp call ingest_documents --args '{"file_path": "data/sample.pdf"}'
```

Search with a query:

```bash
mcp call process_search_query --args '{"query": "What is explained in section 3?"}'
```

---

## 📌 Clean Separation of Concerns

| Role                    | Component              |
|-------------------------|------------------------|
| Tool discovery/invoke   | MCP Server             |
| Search execution        | GroundX API            |
| Response generation     | OpenAI API             |
| File upload             | Ingest Tool (MCP)      |

---

## 📚 License

This project is licensed under the [MIT License](LICENSE).

---

## 👨‍💻 Author

**Sujith Somanunnithan**  
Cloud & AI Architect | [sujith.de](https://sujith.de)

---

## 💬 Feedback & Contributions

Feel free to raise issues, pull requests, or connect with the author for improvements or extensions (like multi-file ingestion, RAG fallback chains, etc).

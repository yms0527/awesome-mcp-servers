📦 Project: MCP Server with Claude Desktop – Interactive Tool API Demo
This project demonstrates the use of the mcp (Modular Claude Protocol) server with the FastMCP framework to create a set of programmable tools and resources. It includes a basic calculator, note-taking functionality, and real-time currency exchange rate lookup. Designed to integrate easily with Claude AI (e.g., via the Claude Desktop or CLI), it exposes tools that can be called programmatically or via natural language prompts.

🔧 Features
Arithmetic Tools
Add, subtract, multiply, and divide numbers with error handling.

Currency Exchange Tool
Fetch real-time currency conversion rates using a public API (https://api.exchangerate-api.com).

Sticky Notes Tool
Save, read, and summarize notes from a local notes.txt file.

Named Resources

Greet users dynamically via greeting://{name}

Fetch latest note with notes://latest_notes

Prompt Templates

Summarize notes using Claude or other AI tools

Generate calculation prompts based on operation type

## 🛠 Requirements

Make sure the following tools/libraries are installed:

- Python 3.9+
- [`uv`](https://pypi.org/project/uv/) – for virtual environment and dependency management
- [`mcp`](https://github.com/anthropics/mcp) with `cli` and `server` extras
- [`httpx`](https://www.python-httpx.org/) – for async API calls

  📝 Usage Examples (via Claude)
add(2, 3) → returns 5

get_exchange_rate("USD", "EUR") → fetches real-time rate

add_note("Buy milk") → appends to notes.txt

read_notes() → reads all notes

note_summary() → generates a summarization prompt

calculator_prompt(4, 2, "divide") → returns formatted result




---

### 👨‍💻 Author

Built by [Samuel Ofoegbu](https://github.com/Samm-OB) using [PyCharm](https://www.jetbrains.com/pycharm/), [MCP](#), and Claude Desktop.

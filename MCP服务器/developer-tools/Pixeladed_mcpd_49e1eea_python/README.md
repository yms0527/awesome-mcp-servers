# Model Context Protocol Daemon **WIP**

The Model Context Protocol Daemon is a tool that allows you to manage Model Context Protocol (MCP) servers, quickly install new ones, manage multiple instances and more.

## Progress

- [x] Protocol for components
- [x] Building Docker images
- [x] Fetching packages from GitHub
- [ ] Installing MCP server packages
- [x] Running an MCP server
- [ ] Local MCP server registry
- [ ] CLI

## Development

1. Create and activate the virtual environment:

```bash
python -m venv venv
source venv/bin/activate
```

2. Install [poetry](https://python-poetry.org/docs/) for managing dependencies

3. Install dependencies:

```bash
poetry install
```

## Building the CLI

We use [pyinstaller](https://pyinstaller.readthedocs.io/en/stable/) to build the CLI. Running the following command will build the CLI and create a `dist` folder with the executable.

```bash
pyinstaller cli.spec
```

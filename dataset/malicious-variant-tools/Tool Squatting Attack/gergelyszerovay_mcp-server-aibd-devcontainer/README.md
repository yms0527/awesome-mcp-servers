## AI Boosted Development in DevContainers

MCP server designed to enhance AI-assisted development in DevContainer environments. It provides file system operations and tools to facilitate seamless collaboration between AI assistants and containerized development environments. The filesystem operations are based on [Anthropic's Filesystem MCP server](https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem).

## Installation

For the easiest way to get started with AI-assisted development in a devcontainer, follow the installation steps in the [AIBD Devcontainer Repository](https://github.com/gergelyszerovay/aibd-devcontainer). This repository provides a pre-configured development container setup with the MCP server already integrated.

Steps include:
1. Clone the aibd-devcontainer repository 
2. Open in VS Code and use the "Reopen in Container" feature
3. Configure Claude to connect to the MCP server
4. Start developing with AI assistance

The pre-configured setup handles all the details of setting up the MCP server, port forwarding, and file access permissions.

## Features

- Complete file system operations (read, write, edit, etc.)
- Directory tree
- File searching and metadata retrieval
- Plan and Act operational modes for safety
- Allowed directory restrictions for security
- SSE (Server-Sent Events) transport support, ideal for dockerized environments
- REST API
- Optional shell command execution capability (disabled by default)

## API

### Tools

#### File Reading

- **read_multiple_files**
  - Reads multiple files simultaneously
  - Inputs:
    - `paths` (string[]): Paths to the files to read
  - Returns:
    - Array of file contents with their paths

#### File Writing/Modification

- **write_file**

  - Creates a new file or completely overwrites an existing file
  - Inputs:
    - `path` (string): Path to write the file
    - `content` (string): Content to write to the file
  - Returns:
    - Confirmation message
  - **Note**: Only available in "mcpAct" mode

- **edit_file**
  - Makes line-based edits to a text file
  - Inputs:
    - `path` (string): Path to the file to edit
    - `edits` (array): Array of edit operations
    - `dryRun` (boolean): Preview changes without writing
  - Returns:
    - Git-style diff showing the changes
  - **Note**: Only available in "mcpAct" mode

#### Directory Operations

- **create_directory**

  - Creates a new directory or ensures a directory exists
  - Inputs:
    - `path` (string): Path to create
  - Returns:
    - Confirmation message
  - **Note**: Only available in "mcpAct" mode

- **directory_tree**
  - Gets a recursive tree view of files and directories
  - Inputs:
    - `path` (string): Root path
    - `depth` (number, optional): Maximum depth for recursion (default: 1)
  - Returns:
    - JSON structure representing the directory tree

#### File Management

- **move_file**

  - Moves or renames files and directories
  - Inputs:
    - `source` (string): Source path
    - `destination` (string): Destination path
  - Returns:
    - Confirmation message
  - **Note**: Only available in "mcpAct" mode

- **delete_multiple_files**
  - Deletes multiple files in a single operation
  - Inputs:
    - `paths` (string[]): Paths to delete
  - Returns:
    - Detailed report of successes and failures
  - **Note**: Only available in "mcpAct" mode

#### Utilities

- **search_files**

  - Recursively searches for files and directories matching a pattern
  - Inputs:
    - `path` (string): Root path to search from
    - `pattern` (string): Pattern to search for
    - `excludePatterns` (string[]): Patterns to exclude
  - Returns:
    - Array of matching file paths

- **get_file_info**

  - Retrieves detailed metadata about a file or directory
  - Inputs:
    - `path` (string): Path to get info for
  - Returns:
    - Detailed file metadata (size, dates, permissions, etc.)

- **list_allowed_directories**
  - Returns the list of directories the server is allowed to access
  - Inputs: None
  - Returns:
    - Array of allowed directory paths

#### Shell Operations

- **shell_exec**
  - Executes commands in the shell and returns the output as structured data
  - Inputs:
    - `command` (string): Command to execute
    - `timeout` (number, optional): Maximum execution time in milliseconds (default: 5000)
  - Returns:
    - JSON object with the following properties:
      - `stdout` (string): Standard output from the command
      - `stderr` (string): Standard error output from the command
      - `exitCode` (number): Exit code of the command (0 for success, non-zero for failure)
  - **Notes**:
  - Only available when the server is started with the `--enableShellExecTool` flag
  - Only available in "mcpAct" mode
  - Has a configurable timeout with a maximum of 300 seconds

#### Mode Management

- **get_mode**

  - Gets the current operational mode
  - Inputs: None
  - Returns:
    - Current mode ("mcpAct" or "mcpPlan")

- **set_mode**
  - Sets the operational mode
  - Inputs:
    - `mode` (string): Mode to switch to ("mcpAct" or "mcpPlan")
  - Returns:
    - Confirmation message

## Usage with Claude Desktop

Add this to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "aibd": {
      "command": "npx",
      "args": [
        "-y",
        "@gergelyszerovay/mcp-server-aibd-devcontainer",
        "--allowedDirectories=/your/allowed/path"
        // Add "--enableShellExecTool" here if you want to enable shell command execution
      ]
    }
  }
}
```

## Command Line Options

```
MCP server with filesystem tools.

Options
  --enableHttpTransport         Enable HTTP transport [default: false]
  --enableStdioTransport        Enable stdio transport [default: true]
  --enableRestServer            Enable REST API server [default: false]
  --enableShellExecTool              Enable shell execution tool [default: false]
  --mcpHttpPort=<port>          Port for MCP HTTP server [default: 3001]
  --restHttpPort=<port>         Port for REST HTTP server [default: 3002]
  --allowedDirectories=<path>   Allowed directories for filesystem access (multiple, required)
  --initialMode=<mode>          Initial operation mode: mcpAct or mcpPlan [default: mcpAct]
  --help                        Show this help message

Examples
  $ mcp-fs --allowedDirectories=. --enableHttpTransport
  $ mcp-fs --allowedDirectories=/home/user/projects --mcpHttpPort=3005 --restHttpPort=3006
  $ mcp-fs --allowedDirectories=/path/to/dir1 --allowedDirectories=/path/to/dir2
  $ mcp-fs --allowedDirectories=. --initialMode=mcpPlan
  $ mcp-fs --allowedDirectories=. --enableShellExecTool
```

## Security and Deployment

### Operational modes

The server implements two operational modes:

- **mcpPlan Mode**: A read-only exploration mode that allows models to analyze the environment without making changes
- **mcpAct Mode**: The execution mode that grants full access to system modification capabilities

This separation adds a safety barrier against unintended modifications to the file system.

### Directory Restrictions

All operations are restricted to the explicitly allowed directories specified at startup. Attempts to access files outside these directories will result in an error.

### Shell Execution Safety

The shell execution tool is disabled by default and must be explicitly enabled with the `--enableShellExecTool` flag. When enabled, it provides several safety features:

- Only available in "mcpAct" mode, not in planning mode
- Configurable timeout to prevent long-running processes
- Output size limits to prevent overwhelming responses
- Complete command result reporting with exit codes
- Separate stdout and stderr streams for better diagnostics
- Error handling for command failures

**Warning**: Enabling shell execution grants the model the ability to execute arbitrary commands on your system. Always review AI-generated commands carefully before allowing them to be executed.

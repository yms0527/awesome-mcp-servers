# @modelcontextprotocol/server-terminal

Terminal server implementation for Model Context Protocol (MCP). Provides secure and controlled access to terminal commands and npm operations.

## Features

- Execute shell commands with full control
- Built-in npm operations (install, run scripts)
- Timeout handling
- Security through allowed commands list
- Environment variables management
- Working directory control
- Typescript support

## Installation

```bash
npm install @modelcontextprotocol/server-terminal
```

## Configuration

Add to your MCP config:

```json
{
  "terminal": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-terminal"],
    "autoApproveScope": ["execute_command", "npm_install", "npm_run"],
    "config": {
      "allowedCommands": ["npm", "node", "git"],
      "defaultTimeout": 30000,
      "defaultCwd": "/your/project/path",
      "environmentVariables": {
        "NODE_ENV": "development"
      }
    }
  }
}
```

## Usage

```typescript
// Execute command
const result = await terminal.executeCommand('ls', ['-la'], {
  cwd: '/some/path'
});

// Install npm package
await terminal.install('typescript');

// Run npm script
await terminal.runScript('build');

// Direct npm commands
await terminal.dev();  // npm run dev
await terminal.build();  // npm run build
```
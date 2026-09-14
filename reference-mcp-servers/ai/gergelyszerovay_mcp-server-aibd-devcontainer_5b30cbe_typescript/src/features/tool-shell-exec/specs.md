# Shell Execution Tool

## Feature Type

MCP Tool (follows the MCP Tool Blueprint)

## Purpose and Scope

This feature provides a shell command execution capability for the MCP server. It allows executing shell commands and returning their output as text.

The tool is designed to:

- Execute arbitrary shell commands
- Return the standard output and standard error as text
- Be enabled only explicitly with a command-line flag for security
- Only be available in mcpAct mode (not in planning mode)

## Requirements

### Functional Requirements

- Execute shell commands from the model
- Return the command output as text
- Include both stdout and stderr in the response
- Support a configurable execution timeout
- Provide an option to limit output length
- Detect and handle execution errors

### Security Requirements

- Only enabled explicitly via command line flag (`--enableShellExecTool`)
- Not available in planning mode
- No interactive commands allowed
- Limited execution time to prevent long-running processes

## Technical Design

The tool uses Node.js child_process.exec to run commands. Key technical decisions:

- Use promise-based execution with timeout
- Capture both stdout and stderr
- Provide human-readable error messages
- Follow the standard MCP tool structure
- Limit maximum output to prevent overwhelmingly large responses

## Dependencies

This feature depends on:

- Node.js child_process module
- App state for checking if the tool is enabled
- MCP tool infrastructure

## Testing Strategy

Testing will focus on:

- Verify command execution correctness
- Test handling of invalid or malformed commands
- Ensure proper error messaging
- Test timeout functionality
- Verify output formatting

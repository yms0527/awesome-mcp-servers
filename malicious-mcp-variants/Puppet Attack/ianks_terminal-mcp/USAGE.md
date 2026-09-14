# Terminal MCP Usage Guide

This MCP server provides terminal session management with 7 tools:

## Available Tools

### Session Management
1. **create_session** - Create a new named terminal session
2. **list_sessions** - List all active sessions
3. **destroy_session** - Terminate and clean up a session

### Command Execution
4. **execute_command** - Execute a command and wait for output
5. **execute_command_async** - Start a command without waiting
6. **read_streaming_output** - Read output from async commands

### Terminal Control
7. **send_control_character** - Send control characters (Ctrl-C, etc.)

## Usage Examples

### Basic Session
```json
// Create a bash session
{
  "tool": "create_session",
  "arguments": {
    "session_name": "main",
    "command": "bash"
  }
}

// Execute a command
{
  "tool": "execute_command", 
  "arguments": {
    "session_name": "main",
    "command": "ls -la"
  }
}

// Destroy the session
{
  "tool": "destroy_session",
  "arguments": {
    "session_name": "main"
  }
}
```

### SSH Session
```json
// Create SSH session
{
  "tool": "create_session",
  "arguments": {
    "session_name": "prod-server",
    "command": "ssh user@prod.example.com"
  }
}

// Run commands on remote server
{
  "tool": "execute_command",
  "arguments": {
    "session_name": "prod-server",
    "command": "uptime"
  }
}
```

### Long-Running Commands
```json
// Start a long-running command
{
  "tool": "execute_command_async",
  "arguments": {
    "session_name": "main",
    "command": "tail -f /var/log/system.log"
  }
}

// Read output periodically
{
  "tool": "read_streaming_output",
  "arguments": {
    "session_name": "main"
  }
}

// Stop the command
{
  "tool": "send_control_character",
  "arguments": {
    "session_name": "main",
    "letter": "C"
  }
}
```

## Important Notes

- **All tools require session_name** - There is no default session
- Sessions persist until explicitly destroyed
- Each session maintains its own terminal state and history
- Multiple sessions can run concurrently (e.g., multiple SSH connections)
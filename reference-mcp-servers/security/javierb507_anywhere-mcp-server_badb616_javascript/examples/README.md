# Claude Desktop Configuration Examples

This directory contains example configuration files for integrating the AlienVault MCP server with Claude Desktop.

## Configuration Files

### 1. `claude_desktop_config.json` - Full Configuration
Complete configuration with both USM Anywhere API v2.0 and legacy OTX API support.

### 2. `claude_desktop_config_usm_only.json` - USM Anywhere Only
Configuration for USM Anywhere API v2.0 only (recommended for new deployments).

### 3. `claude_desktop_config_otx_only.json` - OTX Only
Configuration for legacy OTX API only (for backward compatibility).

## Setup Instructions

1. **Locate your Claude Desktop config file:**
   - **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

2. **Find your Node.js path:**
   Open a terminal and run:
   ```bash
   which node
   ```
   This will show the full path to your Node.js installation (e.g., `/usr/local/opt/node@20/bin/node`).

3. **Choose the appropriate configuration:**
   - Copy the contents of one of the example files above
   - Replace the placeholder values with your actual credentials
   - Update the `command` field with your Node.js path from step 2
   - Update the path in the `args` array to match your installation directory

4. **Add your credentials:**
   - For USM Anywhere: Replace `your_client_id_here`, `your_client_secret_here`, and `your_subdomain_here`
   - For OTX: Replace `your_otx_api_key_here`

5. **Restart Claude Desktop** for the changes to take effect.

## Example with Custom Paths

If you installed the server in `/home/user/alienvault-mcp-server` and your Node.js is at `/usr/bin/node`, your configuration would look like:

```json
{
  "mcpServers": {
    "alienvault": {
      "command": "/usr/bin/node",
      "args": ["/home/user/alienvault-mcp-server/dist/index.js"],
      "env": {
        "ALIENVAULT_CLIENT_ID": "abc123",
        "ALIENVAULT_CLIENT_SECRET": "secret456",
        "ALIENVAULT_SUBDOMAIN": "mycompany"
      }
    }
  }
}
```

## Troubleshooting

### Common Issues

1. **`spawn node ENOENT` error:**
   - This means Claude Desktop can't find the `node` command
   - Solution: Use the full path to node (run `which node` to find it)
   - Update the `command` field in your configuration

2. **Server not starting:**
   - Check that the path in `args` is correct and the file exists
   - Ensure you've run `npm run build` to compile the TypeScript

3. **Authentication errors:**
   - Verify your credentials are correct
   - For USM Anywhere: Check client ID, secret, and subdomain
   - For OTX: Check your API key

4. **Permission errors:**
   - Ensure Claude Desktop has permission to execute the node command and access the files

### Finding Your Node.js Installation

Different Node.js installations may be located at:
- `/usr/local/bin/node` (Homebrew default)
- `/usr/local/opt/node@20/bin/node` (Homebrew with version)
- `/opt/homebrew/bin/node` (Homebrew on Apple Silicon)
- `/usr/bin/node` (System installation)
- `~/.nvm/versions/node/v20.x.x/bin/node` (NVM installation)

Run `which node` in your terminal to find the exact path.

## Testing the Configuration

After setting up the configuration, you can test it by asking Claude to:
- "List the available AlienVault tools"
- "Get recent security alarms for account [your-account-name]"
- "Search for threat intelligence about [indicator]" 
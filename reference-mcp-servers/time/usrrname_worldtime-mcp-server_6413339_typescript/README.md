# WorldTime MCP Server

A simple MCP server that allows you to get the current time for an area.

This uses the [WorldTime API](https://worldtimeapi.org/) and [TimezoneDB](https://timezonedb.com/) for more timezones.

To use the MCP server and gain access to the TimezoneDB API , register at [TimezoneDB](https://timezonedb.com/register) and create an API key.

## Usage with Claude

In Claude Desktop, add the following to your config:

```json
{
  "mcpServers": {
    "worldtime": {
      "command": "node",
      "args": ["/Users/<your-username>/worldtime-mcp-server/dist/index.js"],
      "env": {
        "TIMEZONE_DB_API_KEY": "<your-timezone-db-api-key>"
      }
    }
  }
}
```

## Debugging with MCP Inspector

To debug the server, you can use the below to test the MCP Inspector, or run `npm run inspect`.

```bash
 npx @modelcontextprotocol/inspector worldtime 
```

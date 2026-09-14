# TimezoneToolkit MCP Server

An advanced MCP (Model Context Protocol) server providing comprehensive time and timezone tools with enhanced features beyond basic conversion.

## Available Tools

| Tool | Description |
| ---- | ----------- |
| convert_time | Convert a time from one timezone to another |
| get_current_time | Get the current time in a specified timezone |
| calculate_sunrise_sunset | Calculate sunrise, sunset, and twilight times for a specific location and date |
| calculate_moon_phase | Calculate moon phase for a specific date |
| calculate_timezone_difference | Calculate the time difference between two timezones |
| list_timezones | List available IANA timezones, optionally filtered by region |
| calculate_countdown | Calculate time remaining until a specific date/event |
| calculate_business_days | Calculate business days between two dates (excluding weekends) |
| format_date | Format a date in various styles |

## Prerequisites

Node.js LTS - The TimezoneToolkit MCP server requires Node.js LTS version to run properly.

## Setup

To run the TimezoneToolkit MCP server using Node.js npx, use the following command:

```bash
npx -y @cicatriz/timezone-toolkit@latest
```

## Installation

### Cursor

To add this server to Cursor IDE:

1. Go to Cursor Settings > MCP
2. Click + Add new Global MCP Server
3. Add the following configuration to your global `.cursor/mcp.json` file:

```json
{
  "mcpServers": {
    "timezone-toolkit": {
      "command": "npx",
      "args": [
        "-y",
        "@cicatriz/timezone-toolkit"
      ]
    }
  }
}
```

See the [Cursor documentation](https://cursor.sh/docs/mcp) for more details. Note: You can also add this to your project specific cursor configuration. (Supported in Cursor 0.46+)

### Windsurf

To set up MCP with Cascade, navigate to Windsurf - Settings > Advanced Settings or Command Palette > Open Windsurf Settings Page.

Scroll down to the Cascade section and you will find the option to add a new server, view existing servers, and a button to view the raw JSON config file at mcp_config.json.

Here you can click "Add custom server +" to add TimezoneToolkit MCP server directly in mcp_config.json.

```json
{
  "mcpServers": {
    "timezone-toolkit": {
      "command": "npx",
      "args": [
        "-y",
        "@cicatriz/timezone-toolkit"
      ]
    }
  }
}
```

See the Windsurf documentation for more details.

### Cline

Add the following json manually to your cline_mcp_settings.json via Cline MCP Server setting.

```json
{
  "mcpServers": {
    "timezone-toolkit": {
      "command": "npx",
      "args": [
        "-y",
        "@cicatriz/timezone-toolkit"
      ]
    }
  }
}
```

### Roo Code

Access the MCP settings by clicking Edit MCP Settings in Roo Code settings or using the Roo Code: Open MCP Config command in VS Code's command palette.

```json
{
  "mcpServers": {
    "timezone-toolkit": {
      "command": "npx",
      "args": [
        "-y",
        "@cicatriz/timezone-toolkit"
      ]
    }
  }
}
```

### Claude

Add the following to your claude_desktop_config.json file. See the Claude Desktop documentation for more details.

```json
{
  "mcpServers": {
    "timezone-toolkit": {
      "command": "npx",
      "args": [
        "-y",
        "@cicatriz/timezone-toolkit"
      ]
    }
  }
}
```

### CLI

You can also run it as CLI by running the following command.

```bash
npx -y @cicatriz/timezone-toolkit@latest
```

## Verification

To verify that the TimezoneToolkit is installed correctly, you can ask Claude to:

1. "What time is it now in Tokyo?"
2. "Convert 3:00 PM New York time to London time"
3. "What time is sunrise tomorrow in San Francisco?"

If Claude responds with the correct information, the TimezoneToolkit is working properly.

## Troubleshooting

If you encounter any issues during installation:

1. **Check Node.js Version**: Ensure you have Node.js 18.x or higher installed.
2. **Path Issues**: Make sure the path in the configuration file is absolute and points to the correct location.
3. **Permission Issues**: Ensure the built JavaScript files have execution permissions.
4. **Restart Required**: Sometimes a full restart of Claude Desktop is needed after configuration changes.

## Available Tools

The TimezoneToolkit provides the following tools:

1. `convert_time`: Convert times between timezones
2. `get_current_time`: Get current time in a specified timezone
3. `calculate_sunrise_sunset`: Calculate sunrise and sunset times
4. `calculate_moon_phase`: Calculate moon phase for a date
5. `calculate_timezone_difference`: Calculate time difference between timezones
6. `list_timezones`: List available IANA timezones
7. `calculate_countdown`: Calculate time remaining until a date
8. `calculate_business_days`: Calculate business days between dates
9. `format_date`: Format dates in various styles

## Support

For support or feature requests, please contact:
- Email: thedawg100@gmail.com
- GitHub Issues: https://github.com/Cicatriiz/timezone-toolkit/issues

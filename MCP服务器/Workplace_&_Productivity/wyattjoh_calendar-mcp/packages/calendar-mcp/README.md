# @wyattjoh/calendar-mcp

A Model Context Protocol (MCP) server that provides LLMs with read-only access to macOS Calendar data. This package enables AI assistants to search events, retrieve upcoming/past events, and access detailed calendar information.

## Installation

```bash
deno add @wyattjoh/calendar-mcp
```

## Features

- **6 MCP Tools** for comprehensive Calendar access:
  - `get-recent-events` - Past events in reverse chronological order
  - `get-upcoming-events` - Future events in chronological order
  - `get-events-by-date-range` - Events within specified dates
  - `search-events` - Full-text search of event titles
  - `get-todays-events` - All events for the current day
  - `get-event-details` - Detailed information about a specific event

- **Rich Event Data** - Access to titles, times, locations, URLs, recurrence rules
- **Rescheduled Event Filtering** - Option to exclude original rescheduled events
- **Type-Safe** - Full TypeScript support with Zod schemas
- **Read-Only** - Safe, non-destructive access to Calendar data

## Usage

### As MCP Server

The package can be run directly as an MCP server:

```bash
deno run --allow-read --allow-env --allow-sys --allow-ffi jsr:@wyattjoh/calendar-mcp
```

### In Claude Desktop

Add to your Claude Desktop configuration (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "calendar": {
      "command": "deno",
      "args": [
        "run",
        "--allow-read",
        "--allow-env",
        "--allow-sys",
        "--allow-ffi",
        "jsr:@wyattjoh/calendar-mcp"
      ]
    }
  }
}
```

### From Source

```bash
# Clone and navigate to the package
git clone https://github.com/wyattjoh/calendar-mcp.git
cd calendar-mcp/packages/calendar-mcp

# Run the server
deno task dev
# Or
deno run --allow-read --allow-env --allow-ffi --allow-sys mod.ts
```

## MCP Tools

### get-recent-events

Retrieve recent past calendar events.

**Parameters:**

- `limit` (number, optional): Number of events to retrieve (1-100, default: 10)
- `includeRescheduled` (boolean, optional): Include original rescheduled events (default: false)

### get-upcoming-events

Retrieve upcoming calendar events.

**Parameters:**

- `limit` (number, optional): Number of events to retrieve (1-100, default: 10)
- `includeRescheduled` (boolean, optional): Include original rescheduled events (default: false)

### get-events-by-date-range

Retrieve calendar events within a specific date range.

**Parameters:**

- `startDate` (string, required): Start date in ISO format (e.g., "2024-01-01")
- `endDate` (string, required): End date in ISO format (e.g., "2024-01-31")
- `includeRescheduled` (boolean, optional): Include original rescheduled events (default: false)

### search-events

Search for calendar events by title/summary.

**Parameters:**

- `query` (string, required): Search query for event titles
- `limit` (number, optional): Maximum number of results (1-100, default: 20)
- `timeRange` (string, optional): Time range to search - "all", "past", or "future" (default: "all")
- `includeRescheduled` (boolean, optional): Include original rescheduled events (default: false)

### get-todays-events

Get all events scheduled for today.

**Parameters:**

- `includeRescheduled` (boolean, optional): Include original rescheduled events (default: false)

### get-event-details

Get detailed information about a specific calendar event.

**Parameters:**

- `eventId` (number, required): The ROWID of the event

## Response Format

Standard event response:

```json
{
  "id": 12345,
  "title": "Team Meeting",
  "startTime": "2024-01-15T10:00:00.000Z",
  "endTime": "2024-01-15T11:00:00.000Z",
  "allDay": false,
  "status": "confirmed",
  "isRescheduled": false
}
```

Detailed event response (from get-event-details):

```json
{
  "id": 12345,
  "title": "Team Meeting",
  "startTime": "2024-01-15T10:00:00.000Z",
  "endTime": "2024-01-15T11:00:00.000Z",
  "allDay": false,
  "status": "confirmed",
  "isRescheduled": false,
  "description": "Weekly sync with the team",
  "location": "Conference Room A",
  "url": "https://meet.example.com/team",
  "recurrenceRule": "FREQ=WEEKLY;INTERVAL=1",
  "calendar": "Work"
}
```

## Permissions

The server requires the following Deno permissions:

- `--allow-read`: Access to Calendar database
- `--allow-env`: Environment variable access
- `--allow-sys`: System information access
- `--allow-ffi`: SQLite native bindings

## Requirements

- macOS (uses system Calendar database)
- Deno 2.x or later
- Access to `~/Library/Calendars/Calendar.sqlitedb`

## License

MIT

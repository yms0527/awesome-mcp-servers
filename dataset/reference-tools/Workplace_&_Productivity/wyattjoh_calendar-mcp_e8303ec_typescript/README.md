# Calendar MCP

A Deno monorepo containing packages for macOS Calendar access:

- **[@wyattjoh/calendar](packages/calendar)** - Core library for read-only macOS Calendar database access
- **[@wyattjoh/calendar-mcp](packages/calendar-mcp)** - Model Context Protocol (MCP) server for LLM integration

## Features

- Search calendar events by title/summary
- Get recent past events
- Get upcoming events
- Retrieve events within date ranges
- Get today's events with conflict detection
- Get detailed event information including location, URL, and recurrence
- Filter rescheduled events

## Requirements

- macOS (Calendar is only available on macOS)
- Deno 2.x or later
- Read access to `~/Library/Calendars/Calendar.sqlitedb`

## Packages

### @wyattjoh/calendar

Core library for accessing Calendar data:

```bash
deno add @wyattjoh/calendar
```

```typescript
import { openDatabase, searchEvents } from "@wyattjoh/calendar";

const db = openDatabase();
try {
  const events = searchEvents(db, { query: "meeting", limit: 10 });
  console.log(events);
} finally {
  db.close();
}
```

[See full documentation](packages/calendar/README.md)

### @wyattjoh/calendar-mcp

MCP server for LLM integration:

```bash
# Run directly from JSR
deno run --allow-read --allow-env --allow-ffi --allow-sys jsr:@wyattjoh/calendar-mcp

# Or install globally
deno install --global --allow-read --allow-env --allow-ffi --allow-sys -n calendar-mcp jsr:@wyattjoh/calendar-mcp
```

For Claude Desktop app integration, add this to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "calendar": {
      "command": "deno",
      "args": [
        "run",
        "--allow-read",
        "--allow-env",
        "--allow-ffi",
        "--allow-sys",
        "jsr:@wyattjoh/calendar-mcp"
      ]
    }
  }
}
```

### Option 2: From Source

1. Clone this repository
2. Run the server:
   ```bash
   cd packages/calendar-mcp
   deno run --allow-read --allow-env --allow-ffi --allow-sys mod.ts
   # Or use the task:
   deno task dev
   ```

### Available Tools

1. **get-recent-events** - Get recent past calendar events
   - `limit` (optional): Number of events (1-100, default: 10)
   - `includeRescheduled` (optional): Include original rescheduled events (default: false)

2. **get-upcoming-events** - Get upcoming calendar events
   - `limit` (optional): Number of events (1-100, default: 10)
   - `includeRescheduled` (optional): Include original rescheduled events (default: false)

3. **get-events-by-date-range** - Get events within a date range
   - `startDate` (required): Start date in ISO format (e.g., "2024-01-01")
   - `endDate` (required): End date in ISO format (e.g., "2024-01-31")
   - `includeRescheduled` (optional): Include original rescheduled events (default: false)

4. **search-events** - Search for events by title/summary
   - `query` (required): Search query for event titles
   - `limit` (optional): Maximum results (1-100, default: 20)
   - `timeRange` (optional): "all", "past", or "future" (default: "all")
   - `includeRescheduled` (optional): Include original rescheduled events (default: false)

5. **get-todays-events** - Get all events scheduled for today
   - `includeRescheduled` (optional): Include original rescheduled events (default: false)

6. **get-event-details** - Get detailed information about a specific event
   - `eventId` (required): The ROWID of the event

### Response Format

All tools return calendar events in this format:

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

Detailed events (from get-event-details) include additional fields:

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

## Security Notes

- This server runs with read-only access to the Calendar database
- No events can be created, modified, or deleted
- The server only accesses local data

## Development

This is a Deno workspace monorepo. All commands run from the root affect all packages.

```bash
# Clone the repository
git clone https://github.com/wyattjoh/calendar-mcp.git
cd calendar-mcp

# Format all code
deno task fmt

# Lint all packages
deno task lint

# Type check all packages
deno task check

# Run MCP server locally
cd packages/calendar-mcp
deno task dev

# Publish packages (CI/CD)
deno publish
```

### Working on Individual Packages

```bash
# Work on @wyattjoh/calendar
cd packages/calendar
deno fmt
deno lint
deno check mod.ts

# Work on @wyattjoh/calendar-mcp
cd packages/calendar-mcp
deno run --allow-read --allow-env --allow-ffi --allow-sys mod.ts
```

## License

MIT

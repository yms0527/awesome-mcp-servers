# @wyattjoh/calendar

A Deno library for read-only access to the macOS Calendar database. This package provides a clean API for searching events, retrieving upcoming/past events, and accessing detailed calendar information.

## Installation

```bash
deno add @wyattjoh/calendar
```

## Usage

```typescript
import {
  getEventDetails,
  getEventsByDateRange,
  getRecentEvents,
  getTodaysEvents,
  getUpcomingEvents,
  openDatabase,
  searchEvents,
} from "@wyattjoh/calendar";

// Open the Calendar database
const db = openDatabase();

try {
  // Search for events
  const searchResults = searchEvents(db, {
    query: "meeting",
    limit: 10,
    timeRange: "future",
  });

  // Get upcoming events
  const upcoming = getUpcomingEvents(db, { limit: 5 });

  // Get recent past events
  const recent = getRecentEvents(db, { limit: 5 });

  // Get events within a date range
  const rangeEvents = getEventsByDateRange(db, {
    startDate: "2024-01-01",
    endDate: "2024-01-31",
  });

  // Get today's events
  const today = getTodaysEvents(db);

  // Get detailed information about a specific event
  const details = getEventDetails(db, 12345);
} finally {
  // Always close the database when done
  db.close();
}
```

## Features

- **Event Search**: Full-text search of event titles with time range filters
- **Recent Events**: Retrieve past events in reverse chronological order
- **Upcoming Events**: Get future events in chronological order
- **Date Range Queries**: Retrieve all events within specified dates
- **Today's Events**: Get all events for the current day with overlap detection
- **Event Details**: Full event information including location, URL, recurrence rules
- **Rescheduled Event Filtering**: Option to exclude original rescheduled events
- **Type-Safe**: Full TypeScript support with comprehensive type definitions

## API Reference

### Database

```typescript
openDatabase(dbPath?: string): Database
```

Opens a read-only connection to the Calendar database. Uses the default macOS Calendar database path if not specified.

### Events

```typescript
getRecentEvents(db: Database, options?: GetEventsOptions): FormattedEvent[]
getUpcomingEvents(db: Database, options?: GetEventsOptions): FormattedEvent[]
getEventsByDateRange(db: Database, options: DateRangeOptions): FormattedEvent[]
searchEvents(db: Database, options: SearchOptions): FormattedEvent[]
getTodaysEvents(db: Database, includeRescheduled?: boolean): { date: string; events: FormattedEvent[] }
getEventDetails(db: Database, eventId: number): FormattedDetailedEvent | null
```

### Type Definitions

```typescript
interface FormattedEvent {
  id: number;
  title: string;
  startTime: string | undefined;
  endTime: string | undefined;
  allDay: boolean;
  status: "cancelled" | "tentative" | "confirmed";
  isRescheduled: boolean;
}

interface FormattedDetailedEvent extends FormattedEvent {
  description?: string;
  url?: string;
  location?: string;
  recurrenceRule?: string;
  calendar?: string;
}

interface GetEventsOptions {
  limit?: number;
  includeRescheduled?: boolean;
}

interface DateRangeOptions {
  startDate: string;
  endDate: string;
  includeRescheduled?: boolean;
}

interface SearchOptions {
  query: string;
  limit?: number;
  timeRange?: "all" | "past" | "future";
  includeRescheduled?: boolean;
}
```

## Requirements

- macOS (uses system Calendar database)
- Deno with appropriate permissions:
  - `--allow-read`: Access to database files
  - `--allow-env`: Environment variables
  - `--allow-ffi`: SQLite native bindings

## Database Location

The library reads from the macOS Calendar database located at:
`~/Library/Calendars/Calendar.sqlitedb`

## License

MIT

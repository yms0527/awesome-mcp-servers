# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development Commands

- `deno task fmt` - Format all code with Deno formatter
- `deno task lint` - Run Deno linter on all code
- `deno task check` - Type check all TypeScript code

### Package-specific Commands (in packages/calendar-mcp/)

- `deno task dev` - Run the MCP server in development mode (requires macOS for Calendar access)
- `deno task start` - Run the MCP server

### Publishing

- `deno publish` - Publish packages to JSR (requires proper permissions)

## Architecture

This is a Deno monorepo with two packages:

### packages/calendar/

Core calendar library that provides direct access to macOS Calendar database:

- **mod.ts**: Main export file exposing all public APIs
- **src/client.ts**: Database client with query functions for calendar events
- **src/types.ts**: TypeScript interfaces for calendar events and options
- **src/utils.ts**: Utility functions for formatting events
- **src/constants.ts**: Constants including database path and Core Data epoch

Key features:

- Read-only access to macOS Calendar database at `~/Library/Calendars/Calendar.sqlitedb`
- Functions for retrieving recent, upcoming, and date-range events
- Event search and detail retrieval
- Support for filtering rescheduled events

### packages/calendar-mcp/

Model Context Protocol (MCP) server that exposes calendar functionality:

- **mod.ts**: MCP server implementation with tool registrations
- Wraps the calendar library functions as MCP tools
- Provides 6 tools: get-recent-events, get-upcoming-events, get-events-by-date-range, search-events, get-todays-events, get-event-details
- Uses stdio transport for MCP communication

## Dependencies

- **@db/sqlite**: SQLite database access for reading Calendar.sqlitedb
- **@modelcontextprotocol/sdk**: MCP SDK for server implementation
- **zod**: Schema validation for MCP tool inputs

## Database Schema

The code queries the macOS Calendar SQLite database with these key tables:

- **CalendarItem**: Main events table with columns like summary, start_date, end_date, all_day, status
- **Calendar**: Calendar metadata table joined for calendar names

Time handling uses Core Data epoch (2001-01-01) for timestamp conversions.

## Development Notes

- Requires macOS for Calendar database access
- Database opened in read-only mode for safety
- All MCP tools properly close database connections after use
- Rescheduled events identified by orig_item_id > 0

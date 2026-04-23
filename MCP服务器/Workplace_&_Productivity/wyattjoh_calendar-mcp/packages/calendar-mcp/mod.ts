import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
  getEventDetails,
  getEventsByDateRange,
  getRecentEvents,
  getTodaysEvents,
  getUpcomingEvents,
  openDatabase,
  searchEvents,
} from "@wyattjoh/calendar";
import deno from "./deno.json" with { type: "json" };

const createServer = () => {
  const server = new McpServer({
    name: "calendar-mcp",
    version: deno.version,
  });

  server.registerTool(
    "get-recent-events",
    {
      title: "Get Recent Calendar Events",
      description: "Retrieve recent past calendar events from macOS Calendar",
      inputSchema: {
        limit: z.number().min(1).max(100).default(10).describe(
          "Number of events to retrieve",
        ),
        includeRescheduled: z.boolean().default(false).describe(
          "Include original rescheduled events",
        ),
      },
    },
    (
      { limit, includeRescheduled }: {
        limit: number;
        includeRescheduled: boolean;
      },
    ) => {
      const db = openDatabase();
      try {
        const events = getRecentEvents(db, { limit, includeRescheduled });
        return {
          content: [{
            type: "text",
            text: JSON.stringify(events, null, 2),
          }],
        };
      } finally {
        db.close();
      }
    },
  );

  server.registerTool(
    "get-upcoming-events",
    {
      title: "Get Upcoming Calendar Events",
      description: "Retrieve upcoming calendar events from macOS Calendar",
      inputSchema: {
        limit: z.number().min(1).max(100).default(10).describe(
          "Number of events to retrieve",
        ),
        includeRescheduled: z.boolean().default(false).describe(
          "Include original rescheduled events",
        ),
      },
    },
    (
      { limit, includeRescheduled }: {
        limit: number;
        includeRescheduled: boolean;
      },
    ) => {
      const db = openDatabase();
      try {
        const events = getUpcomingEvents(db, { limit, includeRescheduled });
        return {
          content: [{
            type: "text",
            text: JSON.stringify(events, null, 2),
          }],
        };
      } finally {
        db.close();
      }
    },
  );

  server.registerTool(
    "get-events-by-date-range",
    {
      title: "Get Events by Date Range",
      description: "Retrieve calendar events within a specific date range",
      inputSchema: {
        startDate: z.string().describe(
          "Start date in ISO format (e.g., 2024-01-01)",
        ),
        endDate: z.string().describe(
          "End date in ISO format (e.g., 2024-01-31)",
        ),
        includeRescheduled: z.boolean().default(false).describe(
          "Include original rescheduled events",
        ),
      },
    },
    (
      { startDate, endDate, includeRescheduled }: {
        startDate: string;
        endDate: string;
        includeRescheduled: boolean;
      },
    ) => {
      const db = openDatabase();
      try {
        const events = getEventsByDateRange(db, {
          startDate,
          endDate,
          includeRescheduled,
        });
        return {
          content: [{
            type: "text",
            text: JSON.stringify(events, null, 2),
          }],
        };
      } finally {
        db.close();
      }
    },
  );

  server.registerTool(
    "search-events",
    {
      title: "Search Calendar Events",
      description: "Search for calendar events by title/summary",
      inputSchema: {
        query: z.string().describe("Search query for event titles"),
        limit: z.number().min(1).max(100).default(20).describe(
          "Maximum number of results",
        ),
        timeRange: z.enum(["all", "past", "future"]).default("all").describe(
          "Time range to search",
        ),
        includeRescheduled: z.boolean().default(false).describe(
          "Include original rescheduled events",
        ),
      },
    },
    (
      { query, limit, timeRange, includeRescheduled }: {
        query: string;
        limit: number;
        timeRange: "all" | "past" | "future";
        includeRescheduled: boolean;
      },
    ) => {
      const db = openDatabase();
      try {
        const events = searchEvents(db, {
          query,
          limit,
          timeRange,
          includeRescheduled,
        });
        return {
          content: [{
            type: "text",
            text: JSON.stringify(events, null, 2),
          }],
        };
      } finally {
        db.close();
      }
    },
  );

  server.registerTool(
    "get-todays-events",
    {
      title: "Get Today's Events",
      description: "Get all events scheduled for today",
      inputSchema: {
        includeRescheduled: z.boolean().default(false).describe(
          "Include original rescheduled events",
        ),
      },
    },
    ({ includeRescheduled }: { includeRescheduled: boolean }) => {
      const db = openDatabase();
      try {
        const result = getTodaysEvents(db, includeRescheduled);
        return {
          content: [{
            type: "text",
            text: JSON.stringify(result, null, 2),
          }],
        };
      } finally {
        db.close();
      }
    },
  );

  server.registerTool(
    "get-event-details",
    {
      title: "Get Event Details",
      description: "Get detailed information about a specific calendar event",
      inputSchema: {
        eventId: z.number().describe("The ROWID of the event"),
      },
    },
    ({ eventId }: { eventId: number }) => {
      const db = openDatabase();
      try {
        const event = getEventDetails(db, eventId);
        if (!event) {
          return {
            content: [{
              type: "text",
              text: "Event not found",
            }],
          };
        }
        return {
          content: [{
            type: "text",
            text: JSON.stringify(event, null, 2),
          }],
        };
      } finally {
        db.close();
      }
    },
  );

  return server;
};

const main = async () => {
  const server = createServer();
  const transport = new StdioServerTransport();

  await server.connect(transport);
  console.error("Calendar MCP Server is running...");
};

if (import.meta.main) {
  main().catch((error) => {
    console.error("Server error:", error);
    Deno.exit(1);
  });
}

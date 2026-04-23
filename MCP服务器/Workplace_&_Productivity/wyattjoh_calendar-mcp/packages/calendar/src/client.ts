import { Database } from "@db/sqlite";
import { CALENDAR_DB_PATH, CORE_DATA_EPOCH } from "./constants.ts";
import { formatDetailedEvent, formatEvent } from "./utils.ts";
import type {
  CalendarEvent,
  DateRangeOptions,
  DetailedCalendarEvent,
  FormattedDetailedEvent,
  FormattedEvent,
  GetEventsOptions,
  SearchOptions,
} from "./types.ts";

/**
 * Opens a read-only connection to the macOS Calendar database.
 * @param dbPath - Path to the Calendar database (defaults to ~/Library/Calendars/Calendar.sqlitedb)
 * @returns Database instance for querying calendar events
 */
export const openDatabase = (dbPath: string = CALENDAR_DB_PATH): Database =>
  new Database(dbPath, { readonly: true });

const buildExcludeRescheduledClause = (includeRescheduled: boolean): string =>
  includeRescheduled ? "" : `
    AND ROWID NOT IN (
      SELECT orig_item_id 
      FROM CalendarItem 
      WHERE orig_item_id > 0
    )
  `;

/**
 * Retrieves recent calendar events that have already occurred.
 * @param db - Database instance from openDatabase()
 * @param options - Options to control limit and whether to include rescheduled events
 * @returns Array of formatted calendar events sorted by start date (most recent first)
 */
export const getRecentEvents = (
  db: Database,
  options: GetEventsOptions = {},
): FormattedEvent[] => {
  const { limit = 10, includeRescheduled = false } = options;

  const query = `
    SELECT 
      ROWID as rowid,
      summary,
      start_date,
      end_date,
      all_day,
      status,
      hidden,
      orig_item_id
    FROM CalendarItem
    WHERE 
      start_date IS NOT NULL
      AND hidden = 0
      AND datetime(start_date + ${CORE_DATA_EPOCH}, 'unixepoch') <= datetime('now')
      ${buildExcludeRescheduledClause(includeRescheduled)}
    ORDER BY start_date DESC
    LIMIT ?
  `;

  const events = db.prepare(query).all(limit) as CalendarEvent[];
  return events.map(formatEvent);
};

/**
 * Retrieves upcoming calendar events scheduled for the future.
 * @param db - Database instance from openDatabase()
 * @param options - Options to control limit and whether to include rescheduled events
 * @returns Array of formatted calendar events sorted by start date (earliest first)
 */
export const getUpcomingEvents = (
  db: Database,
  options: GetEventsOptions = {},
): FormattedEvent[] => {
  const { limit = 10, includeRescheduled = false } = options;

  const query = `
    SELECT 
      ROWID as rowid,
      summary,
      start_date,
      end_date,
      all_day,
      status,
      hidden,
      orig_item_id
    FROM CalendarItem
    WHERE 
      start_date IS NOT NULL
      AND hidden = 0
      AND datetime(start_date + ${CORE_DATA_EPOCH}, 'unixepoch') > datetime('now')
      ${buildExcludeRescheduledClause(includeRescheduled)}
    ORDER BY start_date ASC
    LIMIT ?
  `;

  const events = db.prepare(query).all(limit) as CalendarEvent[];
  return events.map(formatEvent);
};

/**
 * Retrieves calendar events within a specified date range.
 * @param db - Database instance from openDatabase()
 * @param options - Date range options including start date, end date, and whether to include rescheduled events
 * @returns Array of formatted calendar events sorted by start date
 */
export const getEventsByDateRange = (
  db: Database,
  options: DateRangeOptions,
): FormattedEvent[] => {
  const { startDate, endDate, includeRescheduled = false } = options;

  const startTimestamp = new Date(startDate).getTime() / 1000 - CORE_DATA_EPOCH;
  const endTimestamp = new Date(endDate).getTime() / 1000 - CORE_DATA_EPOCH;

  const query = `
    SELECT 
      ROWID as rowid,
      summary,
      start_date,
      end_date,
      all_day,
      status,
      hidden,
      orig_item_id
    FROM CalendarItem
    WHERE 
      start_date IS NOT NULL
      AND hidden = 0
      AND start_date >= ?
      AND start_date <= ?
      ${buildExcludeRescheduledClause(includeRescheduled)}
    ORDER BY start_date ASC
  `;

  const events = db.prepare(query).all(
    startTimestamp,
    endTimestamp,
  ) as CalendarEvent[];
  return events.map(formatEvent);
};

/**
 * Searches for calendar events by title/summary text.
 * @param db - Database instance from openDatabase()
 * @param options - Search options including query text, limit, time range filter, and whether to include rescheduled events
 * @returns Array of formatted calendar events matching the search query
 */
export const searchEvents = (
  db: Database,
  options: SearchOptions,
): FormattedEvent[] => {
  const {
    query,
    limit = 20,
    timeRange = "all",
    includeRescheduled = false,
  } = options;

  const timeClause = timeRange === "past"
    ? `AND datetime(start_date + ${CORE_DATA_EPOCH}, 'unixepoch') <= datetime('now')`
    : timeRange === "future"
    ? `AND datetime(start_date + ${CORE_DATA_EPOCH}, 'unixepoch') > datetime('now')`
    : "";

  const sqlQuery = `
    SELECT 
      ROWID as rowid,
      summary,
      start_date,
      end_date,
      all_day,
      status,
      hidden,
      orig_item_id
    FROM CalendarItem
    WHERE 
      summary LIKE ?
      AND hidden = 0
      ${timeClause}
      ${buildExcludeRescheduledClause(includeRescheduled)}
    ORDER BY start_date DESC
    LIMIT ?
  `;

  const events = db.prepare(sqlQuery).all(
    `%${query}%`,
    limit,
  ) as CalendarEvent[];
  return events.map(formatEvent);
};

/**
 * Retrieves all calendar events for today.
 * @param db - Database instance from openDatabase()
 * @param includeRescheduled - Whether to include events that have been rescheduled
 * @returns Object containing today's date and array of formatted events
 */
export const getTodaysEvents = (
  db: Database,
  includeRescheduled = false,
): { date: string; events: FormattedEvent[] } => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayTimestamp = today.getTime() / 1000 - CORE_DATA_EPOCH;
  const tomorrowTimestamp = tomorrow.getTime() / 1000 - CORE_DATA_EPOCH;

  const query = `
    SELECT 
      ROWID as rowid,
      summary,
      start_date,
      end_date,
      all_day,
      status,
      hidden,
      orig_item_id
    FROM CalendarItem
    WHERE 
      start_date IS NOT NULL
      AND hidden = 0
      AND (
        (start_date >= ? AND start_date < ?)
        OR (end_date >= ? AND end_date < ?)
        OR (start_date < ? AND end_date >= ?)
      )
      ${buildExcludeRescheduledClause(includeRescheduled)}
    ORDER BY start_date ASC
  `;

  const events = db.prepare(query).all(
    todayTimestamp,
    tomorrowTimestamp,
    todayTimestamp,
    tomorrowTimestamp,
    todayTimestamp,
    tomorrowTimestamp,
  ) as CalendarEvent[];

  return {
    date: today.toISOString().split("T")[0],
    events: events.map(formatEvent),
  };
};

/**
 * Retrieves detailed information for a specific calendar event.
 * @param db - Database instance from openDatabase()
 * @param eventId - The unique identifier (ROWID) of the event
 * @returns Formatted detailed event information or null if not found
 */
export const getEventDetails = (
  db: Database,
  eventId: number,
): FormattedDetailedEvent | null => {
  const query = `
    SELECT 
      ci.ROWID as rowid,
      ci.summary,
      ci.start_date,
      ci.end_date,
      ci.all_day,
      ci.status,
      ci.hidden,
      ci.orig_item_id,
      ci.description,
      ci.url,
      ci.location,
      ci.recurrence_rule,
      c.title as calendar_name
    FROM CalendarItem ci
    LEFT JOIN Calendar c ON ci.calendar_id = c.ROWID
    WHERE ci.ROWID = ?
  `;

  const stmt = db.prepare(query);
  const event = stmt.get(eventId) as DetailedCalendarEvent | undefined;

  return event ? formatDetailedEvent(event) : null;
};

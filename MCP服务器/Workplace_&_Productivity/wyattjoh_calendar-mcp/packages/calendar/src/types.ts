/**
 * Raw calendar event data from the macOS Calendar database.
 */
export interface CalendarEvent {
  /** Unique identifier for the event (database row ID) */
  rowid: number;
  /** Event title or summary text */
  summary: string | undefined;
  /** Start timestamp in Core Data format (seconds since 2001-01-01) */
  start_date: number | undefined;
  /** End timestamp in Core Data format (seconds since 2001-01-01) */
  end_date: number | undefined;
  /** Whether this is an all-day event (1) or not (0) */
  all_day: number;
  /** Event status code (0=confirmed, 1=tentative, 2=cancelled) */
  status: number | undefined;
  /** Whether the event is hidden (0=visible, 1=hidden) */
  hidden: number;
  /** Original event ID if this is a rescheduled event */
  orig_item_id: number | undefined;
}

/**
 * Extended calendar event data including additional details from the database.
 */
export interface DetailedCalendarEvent extends CalendarEvent {
  /** Event description or notes */
  description?: string;
  /** Associated URL for the event */
  url?: string;
  /** Event location */
  location?: string;
  /** Recurrence rule in iCalendar RRULE format */
  recurrence_rule?: string;
  /** Name of the calendar this event belongs to */
  calendar_name?: string;
}

/**
 * User-friendly formatted calendar event data.
 */
export interface FormattedEvent {
  /** Event ID (same as rowid) */
  id: number;
  /** Event title (defaults to "Untitled Event" if empty) */
  title: string;
  /** ISO 8601 formatted start time */
  startTime: string | undefined;
  /** ISO 8601 formatted end time */
  endTime: string | undefined;
  /** Whether this is an all-day event */
  allDay: boolean;
  /** Human-readable event status */
  status: "cancelled" | "tentative" | "confirmed";
  /** Whether this event has been rescheduled */
  isRescheduled: boolean;
}

/**
 * Extended formatted event data with additional details.
 */
export interface FormattedDetailedEvent extends FormattedEvent {
  /** Event description or notes */
  description: string | undefined;
  /** Associated URL for the event */
  url: string | undefined;
  /** Event location */
  location: string | undefined;
  /** Recurrence rule in iCalendar RRULE format */
  recurrenceRule: string | undefined;
  /** Name of the calendar this event belongs to */
  calendar: string | undefined;
}

/**
 * Options for retrieving events with pagination and filtering.
 */
export interface GetEventsOptions {
  /** Maximum number of events to return (default: 10) */
  limit?: number;
  /** Whether to include events that have been rescheduled (default: false) */
  includeRescheduled?: boolean;
}

/**
 * Options for retrieving events within a specific date range.
 */
export interface DateRangeOptions {
  /** Start date in ISO 8601 format (e.g., "2024-01-01") */
  startDate: string;
  /** End date in ISO 8601 format (e.g., "2024-12-31") */
  endDate: string;
  /** Whether to include events that have been rescheduled (default: false) */
  includeRescheduled?: boolean;
}

/**
 * Options for searching calendar events by text.
 */
export interface SearchOptions {
  /** Search query to match against event titles */
  query: string;
  /** Maximum number of results to return (default: 20) */
  limit?: number;
  /** Time range filter for search results (default: "all") */
  timeRange?: "all" | "past" | "future";
  /** Whether to include events that have been rescheduled (default: false) */
  includeRescheduled?: boolean;
}

import { CORE_DATA_EPOCH } from "./constants.ts";
import type {
  CalendarEvent,
  DetailedCalendarEvent,
  FormattedDetailedEvent,
  FormattedEvent,
} from "./types.ts";

const convertCoreDataTimestamp = (
  timestamp: number | undefined,
): string | undefined => {
  if (timestamp === undefined || timestamp === null) return undefined;
  return new Date((timestamp + CORE_DATA_EPOCH) * 1000).toISOString();
};

export const formatEvent = (event: CalendarEvent): FormattedEvent => ({
  id: event.rowid,
  title: event.summary || "Untitled Event",
  startTime: convertCoreDataTimestamp(event.start_date),
  endTime: convertCoreDataTimestamp(event.end_date),
  allDay: event.all_day === 1,
  status: event.status === 3
    ? "cancelled"
    : event.status === 1
    ? "tentative"
    : "confirmed",
  isRescheduled: event.orig_item_id !== null &&
    event.orig_item_id !== undefined &&
    event.orig_item_id > 0,
});

export const formatDetailedEvent = (
  event: DetailedCalendarEvent,
): FormattedDetailedEvent => ({
  ...formatEvent(event),
  description: event.description,
  url: event.url,
  location: event.location,
  recurrenceRule: event.recurrence_rule,
  calendar: event.calendar_name,
});

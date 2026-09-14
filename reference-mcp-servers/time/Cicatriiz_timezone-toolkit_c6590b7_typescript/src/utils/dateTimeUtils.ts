/**
 * Utility functions for date and time operations
 */

import { DateTime, Duration } from 'luxon';

/**
 * Parses a time string in various formats into a Luxon DateTime object
 *
 * @param timeStr Time string in ISO format, natural language, or other common formats
 * @param timezone IANA timezone name
 * @returns Luxon DateTime object
 */
export function parseTime(timeStr?: string, timezone: string = 'UTC'): DateTime {
  if (!timeStr) {
    return DateTime.now().setZone(timezone);
  }

  // Try parsing as ISO
  let dt = DateTime.fromISO(timeStr, { zone: timezone });
  if (dt.isValid) {
    return dt;
  }

  // Try parsing as natural language
  // For simplicity, we'll handle a few common formats
  // In a production app, you might want to use a more robust natural language parser

  // Try "today", "tomorrow", "yesterday"
  const lowerTimeStr = timeStr.toLowerCase();
  if (lowerTimeStr === 'today') {
    return DateTime.now().setZone(timezone).startOf('day');
  } else if (lowerTimeStr === 'tomorrow') {
    return DateTime.now().setZone(timezone).plus({ days: 1 }).startOf('day');
  } else if (lowerTimeStr === 'yesterday') {
    return DateTime.now().setZone(timezone).minus({ days: 1 }).startOf('day');
  }

  // Try common date formats
  const formats = [
    'yyyy-MM-dd',
    'MM/dd/yyyy',
    'dd/MM/yyyy',
    'yyyy/MM/dd',
    'MMMM d, yyyy',
    'd MMMM yyyy',
  ];

  for (const format of formats) {
    dt = DateTime.fromFormat(timeStr, format, { zone: timezone });
    if (dt.isValid) {
      return dt;
    }
  }

  // Try time formats
  const timeFormats = [
    'HH:mm',
    'h:mm a',
    'h a',
  ];

  for (const format of timeFormats) {
    dt = DateTime.fromFormat(timeStr, format, { zone: timezone });
    if (dt.isValid) {
      // If only time is provided, use today's date
      const now = DateTime.now().setZone(timezone);
      return DateTime.fromObject({
        year: now.year,
        month: now.month,
        day: now.day,
        hour: dt.hour,
        minute: dt.minute,
        second: dt.second,
      }, { zone: timezone });
    }
  }

  // If all parsing attempts fail, try to use the current time
  console.warn(`Unable to parse time string: ${timeStr}, using current time instead`);
  return DateTime.now().setZone(timezone);
}

/**
 * Formats a DateTime object according to the specified format
 *
 * @param dt Luxon DateTime object
 * @param format Format type: 'short', 'medium', or 'full'
 * @returns Formatted time string
 */
export function formatDateTime(dt: DateTime, format: 'short' | 'medium' | 'full' = 'medium'): string {
  switch (format) {
    case 'short':
      return dt.toLocaleString(DateTime.DATETIME_SHORT);
    case 'medium':
      return dt.toLocaleString(DateTime.DATETIME_MED);
    case 'full':
      return dt.toLocaleString(DateTime.DATETIME_FULL);
    default:
      return dt.toLocaleString(DateTime.DATETIME_MED);
  }
}

/**
 * Calculates the time difference between two timezones
 *
 * @param fromTimezone Source IANA timezone name
 * @param toTimezone Target IANA timezone name
 * @returns Time difference as a string (e.g., "+2:00" or "-5:30")
 */
export function getTimezoneDifference(fromTimezone: string, toTimezone: string): string {
  const now = DateTime.now();
  const fromOffset = now.setZone(fromTimezone).offset;
  const toOffset = now.setZone(toTimezone).offset;

  const diffMinutes = toOffset - fromOffset;
  const hours = Math.floor(Math.abs(diffMinutes) / 60);
  const minutes = Math.abs(diffMinutes) % 60;

  const sign = diffMinutes >= 0 ? '+' : '-';
  return `${sign}${hours}:${minutes.toString().padStart(2, '0')}`;
}

/**
 * Formats a duration in minutes to a human-readable string
 *
 * @param minutes Duration in minutes
 * @returns Formatted duration string (e.g., "2 hours 30 minutes")
 */
export function formatDuration(minutes: number): string {
  const duration = Duration.fromObject({ minutes });
  const hours = Math.floor(duration.as('hours'));
  const remainingMinutes = Math.floor(duration.as('minutes') % 60);

  if (hours === 0) {
    return `${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}`;
  } else if (remainingMinutes === 0) {
    return `${hours} hour${hours !== 1 ? 's' : ''}`;
  } else {
    return `${hours} hour${hours !== 1 ? 's' : ''} ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}`;
  }
}

/**
 * Gets the system timezone
 *
 * @returns System timezone as IANA timezone name
 */
export function getSystemTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

/**
 * Checks if a timezone is valid
 *
 * @param timezone IANA timezone name to check
 * @returns Boolean indicating if the timezone is valid
 */
export function isValidTimezone(timezone: string): boolean {
  try {
    return !!DateTime.now().setZone(timezone).isValid;
  } catch (e) {
    return false;
  }
}

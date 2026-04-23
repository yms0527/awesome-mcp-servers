/**
 * Timezone Conversion Service
 *
 * Provides functionality for converting times between timezones
 * and getting current time in any timezone.
 */

import { DateTime } from 'luxon';
import {
  TimeConversionRequest,
  TimeConversionResponse,
  CurrentTimeRequest,
  CurrentTimeResponse
} from '../types/index.js';
import {
  parseTime,
  formatDateTime,
  getTimezoneDifference,
  getSystemTimezone,
  isValidTimezone
} from '../utils/dateTimeUtils.js';

/**
 * Converts a time from one timezone to another
 */
export async function convertTime(time: string | undefined, fromTimezone: string, toTimezone: string, format: 'short' | 'medium' | 'full' = 'medium'): Promise<string> {
  // Validate timezones
  if (!isValidTimezone(fromTimezone)) {
    throw new Error(`Invalid source timezone: ${fromTimezone}`);
  }
  if (!isValidTimezone(toTimezone)) {
    throw new Error(`Invalid target timezone: ${toTimezone}`);
  }

  // Parse the input time
  const dateTime = parseTime(time, fromTimezone);

  // Convert to the target timezone
  const convertedDateTime = dateTime.setZone(toTimezone);

  // Calculate time difference
  const timeDifference = getTimezoneDifference(fromTimezone, toTimezone);

  const result = {
    originalTime: dateTime.toISO() || '',
    convertedTime: formatDateTime(convertedDateTime, format),
    fromTimezone,
    toTimezone,
    timeDifference
  };

  return JSON.stringify(result, null, 2);
}

/**
 * Gets the current time in a specified timezone
 */
export async function getCurrentTime(timezone: string, format: 'short' | 'medium' | 'full' = 'medium'): Promise<string> {
  // Use system timezone if not provided
  if (!timezone) {
    timezone = getSystemTimezone();
  }

  // Validate timezone
  if (!isValidTimezone(timezone)) {
    throw new Error(`Invalid timezone: ${timezone}`);
  }

  // Get current time in the specified timezone
  const now = DateTime.now().setZone(timezone);

  // Get UTC offset
  const utcOffset = now.toFormat('ZZ');

  const result = {
    currentTime: formatDateTime(now, format),
    timezone,
    utcOffset
  };

  return JSON.stringify(result, null, 2);
}

/**
 * Gets a list of all available IANA timezones
 */
export async function getAvailableTimezones(): Promise<string> {
  // Luxon doesn't expose IANA_ZONES directly, so we'll return a list of common timezones
  const timezones = [
    'Africa/Cairo',
    'Africa/Johannesburg',
    'Africa/Lagos',
    'America/Anchorage',
    'America/Bogota',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'America/Mexico_City',
    'America/New_York',
    'America/Phoenix',
    'America/Sao_Paulo',
    'America/Toronto',
    'Asia/Bangkok',
    'Asia/Dubai',
    'Asia/Hong_Kong',
    'Asia/Jakarta',
    'Asia/Kolkata',
    'Asia/Seoul',
    'Asia/Shanghai',
    'Asia/Singapore',
    'Asia/Tokyo',
    'Australia/Melbourne',
    'Australia/Sydney',
    'Europe/Amsterdam',
    'Europe/Berlin',
    'Europe/Istanbul',
    'Europe/London',
    'Europe/Madrid',
    'Europe/Moscow',
    'Europe/Paris',
    'Europe/Rome',
    'Pacific/Auckland',
    'Pacific/Honolulu',
    'UTC'
  ];

  return JSON.stringify(timezones, null, 2);
}

/**
 * Gets the system timezone
 */
export async function getSystemTimezoneInfo(): Promise<string> {
  const result = {
    timezone: getSystemTimezone() // Using the utility function from dateTimeUtils
  };

  return JSON.stringify(result, null, 2);
}

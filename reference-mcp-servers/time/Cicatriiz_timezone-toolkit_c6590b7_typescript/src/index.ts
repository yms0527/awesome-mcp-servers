#!/usr/bin/env node

/**
 * TimezoneToolkit MCP Server
 *
 * An advanced MCP server providing comprehensive time and timezone tools
 * with enhanced features beyond basic conversion.
 */

// Handle version flag
if (process.argv.includes('--version') || process.argv.includes('-v')) {
  console.log('1.0.1');
  process.exit(0);
}

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import { DateTime } from 'luxon';
import SunCalc from 'suncalc';
import { parseTime, formatDateTime, getTimezoneDifference, getSystemTimezone } from './utils/dateTimeUtils.js';

// Create the MCP server
const server = new Server({
  name: "TimezoneToolkit",
  version: "1.0.0",
}, {
  capabilities: {
    tools: {}
  }
});

// Define available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "convert_time",
        description: "Convert a time from one timezone to another",
        inputSchema: {
          type: "object",
          properties: {
            time: { type: "string", description: "Time to convert (ISO string or natural language). Defaults to current time if not provided." },
            fromTimezone: { type: "string", description: "Source IANA timezone name (e.g., 'America/New_York')" },
            toTimezone: { type: "string", description: "Target IANA timezone name (e.g., 'Europe/London')" },
            format: { type: "string", enum: ["short", "medium", "full"], description: "Output format. Defaults to 'medium'" }
          },
          required: ["fromTimezone", "toTimezone"]
        }
      },
      {
        name: "get_current_time",
        description: "Get the current time in a specified timezone",
        inputSchema: {
          type: "object",
          properties: {
            timezone: { type: "string", description: "IANA timezone name (e.g., 'Asia/Tokyo'). Defaults to system timezone if not provided." },
            format: { type: "string", enum: ["short", "medium", "full"], description: "Output format. Defaults to 'medium'" }
          },
          required: ["timezone"]
        }
      },
      {
        name: "calculate_sunrise_sunset",
        description: "Calculate sunrise, sunset, and twilight times for a specific location and date",
        inputSchema: {
          type: "object",
          properties: {
            date: { type: "string", description: "Date for calculation (ISO string or natural language). Defaults to current date." },
            latitude: { type: "number", description: "Latitude of the location (-90 to 90)" },
            longitude: { type: "number", description: "Longitude of the location (-180 to 180)" },
            timezone: { type: "string", description: "IANA timezone name (e.g., 'Europe/Paris'). Defaults to UTC." }
          },
          required: ["latitude", "longitude"]
        }
      },
      {
        name: "calculate_moon_phase",
        description: "Calculate moon phase for a specific date",
        inputSchema: {
          type: "object",
          properties: {
            date: { type: "string", description: "Date for calculation (ISO string or natural language). Defaults to current date." },
            timezone: { type: "string", description: "IANA timezone name (e.g., 'Europe/Paris'). Defaults to UTC." }
          }
        }
      },
      {
        name: "calculate_timezone_difference",
        description: "Calculate the time difference between two timezones",
        inputSchema: {
          type: "object",
          properties: {
            fromTimezone: { type: "string", description: "Source IANA timezone name (e.g., 'America/New_York')" },
            toTimezone: { type: "string", description: "Target IANA timezone name (e.g., 'Europe/London')" }
          },
          required: ["fromTimezone", "toTimezone"]
        }
      },
      {
        name: "list_timezones",
        description: "List available IANA timezones, optionally filtered by region",
        inputSchema: {
          type: "object",
          properties: {
            region: { type: "string", description: "Filter timezones by region (e.g., 'America', 'Europe', 'Asia')" }
          }
        }
      },
      {
        name: "calculate_countdown",
        description: "Calculate time remaining until a specific date/event",
        inputSchema: {
          type: "object",
          properties: {
            targetDate: { type: "string", description: "Target date/time (ISO string or natural language)" },
            timezone: { type: "string", description: "IANA timezone name (e.g., 'America/New_York'). Defaults to system timezone." },
            title: { type: "string", description: "Title or name of the event (optional)" }
          },
          required: ["targetDate"]
        }
      },
      {
        name: "calculate_business_days",
        description: "Calculate business days between two dates (excluding weekends)",
        inputSchema: {
          type: "object",
          properties: {
            startDate: { type: "string", description: "Start date (ISO string or natural language)" },
            endDate: { type: "string", description: "End date (ISO string or natural language)" },
            timezone: { type: "string", description: "IANA timezone name (e.g., 'America/New_York'). Defaults to system timezone." },
            excludeHolidays: { type: "boolean", description: "Whether to exclude common holidays (US holidays only). Defaults to false." }
          },
          required: ["startDate", "endDate"]
        }
      },
      {
        name: "format_date",
        description: "Format a date in various styles",
        inputSchema: {
          type: "object",
          properties: {
            date: { type: "string", description: "Date to format (ISO string or natural language). Defaults to current date." },
            timezone: { type: "string", description: "IANA timezone name (e.g., 'America/New_York'). Defaults to system timezone." },
            format: { type: "string", enum: ["short", "medium", "full", "iso", "relative"], description: "Output format. Defaults to 'medium'" },
            locale: { type: "string", description: "Locale for formatting (e.g., 'en-US', 'fr', 'de'). Defaults to 'en-US'." }
          },
          required: ["date"]
        }
      }
    ]
  };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  // Convert time from one timezone to another
  if (request.params.name === "convert_time") {
    const args = request.params.arguments as Record<string, any>;
    const time = args.time as string | undefined;
    const fromTimezone = args.fromTimezone as string;
    const toTimezone = args.toTimezone as string;
    const format = (args.format as string) || "medium";

    // Validate timezones
    if (!fromTimezone) {
      throw new McpError(ErrorCode.InvalidParams, 'Source timezone is required');
    }
    if (!toTimezone) {
      throw new McpError(ErrorCode.InvalidParams, 'Target timezone is required');
    }

    try {
      const fromTest = DateTime.now().setZone(fromTimezone);
      if (!fromTest.isValid) {
        throw new McpError(ErrorCode.InvalidParams, `Invalid source timezone: ${fromTimezone}`);
      }

      const toTest = DateTime.now().setZone(toTimezone);
      if (!toTest.isValid) {
        throw new McpError(ErrorCode.InvalidParams, `Invalid target timezone: ${toTimezone}`);
      }
    } catch (e: any) {
      throw new McpError(ErrorCode.InvalidParams, `Invalid timezone: ${e.message}`);
    }

    // Parse the input time
    let dateTime;
    try {
      dateTime = parseTime(time, fromTimezone);
    } catch (e: any) {
      throw new McpError(ErrorCode.InvalidParams, `Error parsing time: ${e.message}`);
    }

    // Convert to the target timezone
    const convertedDateTime = dateTime.setZone(toTimezone);

    // Calculate time difference
    const timeDifference = getTimezoneDifference(fromTimezone, toTimezone);

    const result = {
      originalTime: dateTime.toISO() || '',
      convertedTime: formatDateTime(convertedDateTime, format as 'short' | 'medium' | 'full'),
      fromTimezone,
      toTimezone,
      timeDifference
    };

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2)
        }
      ]
    };
  }

  // Get current time in a specified timezone
  if (request.params.name === "get_current_time") {
    const args = request.params.arguments as Record<string, any>;
    const timezone = args.timezone as string;
    const format = (args.format as string) || "medium";

    // Use system timezone if not provided
    const tz = timezone || getSystemTimezone();

    // Validate timezone
    try {
      const tzTest = DateTime.now().setZone(tz);
      if (!tzTest.isValid) {
        throw new McpError(ErrorCode.InvalidParams, `Invalid timezone: ${tz}`);
      }
    } catch (e: any) {
      throw new McpError(ErrorCode.InvalidParams, `Invalid timezone: ${e.message}`);
    }

    // Get current time in the specified timezone
    const now = DateTime.now().setZone(tz);

    // Get UTC offset
    const utcOffset = now.toFormat('ZZ');

    const result = {
      currentTime: formatDateTime(now, format as 'short' | 'medium' | 'full'),
      timezone: tz,
      utcOffset
    };

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2)
        }
      ]
    };
  }

  // Calculate sunrise, sunset, and twilight times
  if (request.params.name === "calculate_sunrise_sunset") {
    const args = request.params.arguments as Record<string, any>;
    const date = args.date as string | undefined;
    const latitude = args.latitude as number;
    const longitude = args.longitude as number;
    const timezone = (args.timezone as string) || "UTC";

    // Validate latitude and longitude
    if (latitude < -90 || latitude > 90) {
      throw new McpError(ErrorCode.InvalidParams, 'Latitude must be between -90 and 90 degrees');
    }
    if (longitude < -180 || longitude > 180) {
      throw new McpError(ErrorCode.InvalidParams, 'Longitude must be between -180 and 180 degrees');
    }

    // Validate timezone
    try {
      const tzTest = DateTime.now().setZone(timezone);
      if (!tzTest.isValid) {
        throw new McpError(ErrorCode.InvalidParams, `Invalid timezone: ${timezone}`);
      }
    } catch (e: any) {
      throw new McpError(ErrorCode.InvalidParams, `Invalid timezone: ${e.message}`);
    }

    // Parse the input date
    let dateTime;
    try {
      dateTime = parseTime(date, timezone);
    } catch (e: any) {
      throw new McpError(ErrorCode.InvalidParams, `Error parsing date: ${e.message}`);
    }

    // Get the date at midnight in the specified timezone
    const dateAtMidnight = dateTime.startOf('day').toJSDate();

    // Calculate sun times using SunCalc
    let sunTimes;
    try {
      sunTimes = SunCalc.getTimes(dateAtMidnight, latitude, longitude);
    } catch (e: any) {
      throw new McpError(ErrorCode.InternalError, `Error calculating sun times: ${e.message}`);
    }

    // Convert times to the specified timezone
    const formatTime = (time: Date) => {
      return DateTime.fromJSDate(time).setZone(timezone).toLocaleString(DateTime.TIME_WITH_SECONDS);
    };

    // Calculate day length in minutes
    const sunrise = DateTime.fromJSDate(sunTimes.sunrise).setZone(timezone);
    const sunset = DateTime.fromJSDate(sunTimes.sunset).setZone(timezone);
    const dayLengthMinutes = sunset.diff(sunrise, 'minutes').minutes;

    const result = {
      date: dateTime.toISODate() || '',
      sunrise: formatTime(sunTimes.sunrise),
      sunset: formatTime(sunTimes.sunset),
      civilTwilight: {
        dawn: formatTime(sunTimes.dawn),
        dusk: formatTime(sunTimes.dusk)
      },
      nauticalTwilight: {
        dawn: formatTime(sunTimes.nauticalDawn),
        dusk: formatTime(sunTimes.nauticalDusk)
      },
      astronomicalTwilight: {
        dawn: formatTime(sunTimes.nightEnd),
        dusk: formatTime(sunTimes.night)
      },
      dayLength: `${Math.floor(dayLengthMinutes / 60)} hours ${Math.floor(dayLengthMinutes % 60)} minutes`,
      timezone
    };

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2)
        }
      ]
    };
  }

  // Calculate moon phase for a specific date
  if (request.params.name === "calculate_moon_phase") {
    const args = request.params.arguments as Record<string, any>;
    const date = args.date as string | undefined;
    const timezone = (args.timezone as string) || "UTC";

    // Validate timezone
    try {
      const tzTest = DateTime.now().setZone(timezone);
      if (!tzTest.isValid) {
        throw new McpError(ErrorCode.InvalidParams, `Invalid timezone: ${timezone}`);
      }
    } catch (e: any) {
      throw new McpError(ErrorCode.InvalidParams, `Invalid timezone: ${e.message}`);
    }

    // Parse the input date
    let dateTime;
    try {
      dateTime = parseTime(date, timezone);
    } catch (e: any) {
      throw new McpError(ErrorCode.InvalidParams, `Error parsing date: ${e.message}`);
    }

    // Get the date at midnight in the specified timezone
    const dateAtMidnight = dateTime.startOf('day').toJSDate();

    // Calculate moon illumination using SunCalc
    let moonIllumination;
    try {
      moonIllumination = SunCalc.getMoonIllumination(dateAtMidnight);
    } catch (e: any) {
      throw new McpError(ErrorCode.InternalError, `Error calculating moon phase: ${e.message}`);
    }

    // Determine moon phase name
    const phase = moonIllumination.phase;
    let phaseName: string;

    if (phase < 0.025 || phase >= 0.975) {
      phaseName = 'New Moon';
    } else if (phase < 0.225) {
      phaseName = 'Waxing Crescent';
    } else if (phase < 0.275) {
      phaseName = 'First Quarter';
    } else if (phase < 0.475) {
      phaseName = 'Waxing Gibbous';
    } else if (phase < 0.525) {
      phaseName = 'Full Moon';
    } else if (phase < 0.725) {
      phaseName = 'Waning Gibbous';
    } else if (phase < 0.775) {
      phaseName = 'Last Quarter';
    } else {
      phaseName = 'Waning Crescent';
    }

    // We don't have latitude/longitude for moon phase calculation
    // so we'll skip the position calculation

    const result = {
      date: dateTime.toISODate() || '',
      phase: moonIllumination.phase,
      phaseName: phaseName,
      illumination: moonIllumination.fraction,
      timezone
    };

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2)
        }
      ]
    };
  }

  // Calculate the time difference between two timezones
  if (request.params.name === "calculate_timezone_difference") {
    const args = request.params.arguments as Record<string, any>;
    const fromTimezone = args.fromTimezone as string;
    const toTimezone = args.toTimezone as string;

    // Validate timezones
    if (!fromTimezone) {
      throw new McpError(ErrorCode.InvalidParams, 'Source timezone is required');
    }
    if (!toTimezone) {
      throw new McpError(ErrorCode.InvalidParams, 'Target timezone is required');
    }

    try {
      const fromTest = DateTime.now().setZone(fromTimezone);
      if (!fromTest.isValid) {
        throw new McpError(ErrorCode.InvalidParams, `Invalid source timezone: ${fromTimezone}`);
      }

      const toTest = DateTime.now().setZone(toTimezone);
      if (!toTest.isValid) {
        throw new McpError(ErrorCode.InvalidParams, `Invalid target timezone: ${toTimezone}`);
      }
    } catch (e: any) {
      throw new McpError(ErrorCode.InvalidParams, `Invalid timezone: ${e.message}`);
    }

    // Calculate time difference
    const timeDifference = getTimezoneDifference(fromTimezone, toTimezone);

    // Get current time in both timezones for reference
    const now = DateTime.now();
    const fromTime = now.setZone(fromTimezone).toLocaleString(DateTime.DATETIME_SHORT);
    const toTime = now.setZone(toTimezone).toLocaleString(DateTime.DATETIME_SHORT);

    // Get more detailed information
    const fromOffset = now.setZone(fromTimezone).offset;
    const toOffset = now.setZone(toTimezone).offset;
    const diffMinutes = toOffset - fromOffset;
    const hours = Math.floor(Math.abs(diffMinutes) / 60);
    const minutes = Math.abs(diffMinutes) % 60;

    const result = {
      fromTimezone,
      toTimezone,
      timeDifference,
      currentTimeFrom: fromTime,
      currentTimeTo: toTime,
      hoursDifference: hours,
      minutesDifference: minutes,
      totalMinutesDifference: Math.abs(diffMinutes),
      direction: diffMinutes >= 0 ? 'ahead' : 'behind'
    };

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2)
        }
      ]
    };
  }

  // List available IANA timezones
  if (request.params.name === "list_timezones") {
    const args = request.params.arguments as Record<string, any>;
    const region = args.region as string | undefined;

    // Common IANA timezones
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

    // Filter by region if specified
    let filteredTimezones = timezones;
    if (region) {
      filteredTimezones = timezones.filter(tz => tz.startsWith(region));
    }

    // Get current time in each timezone
    const now = DateTime.now();
    const timezonesWithTime = filteredTimezones.map(tz => {
      try {
        const time = now.setZone(tz).toLocaleString(DateTime.DATETIME_SHORT);
        const offset = now.setZone(tz).toFormat('ZZ');
        return {
          timezone: tz,
          currentTime: time,
          offset: offset
        };
      } catch (e) {
        return {
          timezone: tz,
          currentTime: 'Invalid timezone',
          offset: ''
        };
      }
    });

    const result = {
      timezones: timezonesWithTime,
      count: timezonesWithTime.length,
      region: region || 'All'
    };

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2)
        }
      ]
    };
  }

  // Calculate time remaining until a specific date/event
  if (request.params.name === "calculate_countdown") {
    const args = request.params.arguments as Record<string, any>;
    const targetDate = args.targetDate as string;
    const timezone = (args.timezone as string) || getSystemTimezone();
    const title = (args.title as string) || 'Event';

    if (!targetDate) {
      throw new McpError(ErrorCode.InvalidParams, 'Target date is required');
    }

    // Validate timezone
    try {
      const tzTest = DateTime.now().setZone(timezone);
      if (!tzTest.isValid) {
        throw new McpError(ErrorCode.InvalidParams, `Invalid timezone: ${timezone}`);
      }
    } catch (e: any) {
      throw new McpError(ErrorCode.InvalidParams, `Invalid timezone: ${e.message}`);
    }

    // Parse the target date
    let targetDateTime;
    try {
      targetDateTime = parseTime(targetDate, timezone);
    } catch (e: any) {
      throw new McpError(ErrorCode.InvalidParams, `Error parsing target date: ${e.message}`);
    }

    // Get current time in the specified timezone
    const now = DateTime.now().setZone(timezone);

    // Calculate the difference
    const diff = targetDateTime.diff(now, ['years', 'months', 'days', 'hours', 'minutes', 'seconds']);
    const diffObj = diff.toObject();

    // Check if the target date is in the past
    const isPast = targetDateTime < now;

    // Format the countdown
    let countdownText = '';
    if (isPast) {
      countdownText = 'This event has already passed';
    } else {
      const parts = [];
      if (diffObj.years && diffObj.years > 0) parts.push(`${Math.floor(diffObj.years)} year${Math.floor(diffObj.years) !== 1 ? 's' : ''}`);
      if (diffObj.months && diffObj.months > 0) parts.push(`${Math.floor(diffObj.months)} month${Math.floor(diffObj.months) !== 1 ? 's' : ''}`);
      if (diffObj.days && diffObj.days > 0) parts.push(`${Math.floor(diffObj.days)} day${Math.floor(diffObj.days) !== 1 ? 's' : ''}`);
      if (diffObj.hours && diffObj.hours > 0) parts.push(`${Math.floor(diffObj.hours)} hour${Math.floor(diffObj.hours) !== 1 ? 's' : ''}`);
      if (diffObj.minutes && diffObj.minutes > 0) parts.push(`${Math.floor(diffObj.minutes)} minute${Math.floor(diffObj.minutes) !== 1 ? 's' : ''}`);
      if (diffObj.seconds && diffObj.seconds > 0) parts.push(`${Math.floor(diffObj.seconds)} second${Math.floor(diffObj.seconds) !== 1 ? 's' : ''}`);

      countdownText = parts.join(', ');
    }

    // Calculate total seconds, minutes, hours and days remaining
    const totalSeconds = Math.floor(diff.as('seconds'));
    const totalMinutes = Math.floor(diff.as('minutes'));
    const totalHours = Math.floor(diff.as('hours'));
    const totalDays = Math.floor(diff.as('days'));

    const result = {
      title,
      targetDate: targetDateTime.toISO() || '',
      formattedTargetDate: targetDateTime.toLocaleString(DateTime.DATETIME_FULL),
      currentDate: now.toISO() || '',
      timezone,
      isPast,
      countdown: countdownText,
      remaining: {
        years: Math.floor(diffObj.years || 0),
        months: Math.floor(diffObj.months || 0),
        days: Math.floor(diffObj.days || 0),
        hours: Math.floor(diffObj.hours || 0),
        minutes: Math.floor(diffObj.minutes || 0),
        seconds: Math.floor(diffObj.seconds || 0),
        totalDays,
        totalHours,
        totalMinutes,
        totalSeconds
      }
    };

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2)
        }
      ]
    };
  }

  // Calculate business days between two dates
  if (request.params.name === "calculate_business_days") {
    const args = request.params.arguments as Record<string, any>;
    const startDate = args.startDate as string;
    const endDate = args.endDate as string;
    const timezone = (args.timezone as string) || getSystemTimezone();
    const excludeHolidays = args.excludeHolidays as boolean || false;

    if (!startDate) {
      throw new McpError(ErrorCode.InvalidParams, 'Start date is required');
    }
    if (!endDate) {
      throw new McpError(ErrorCode.InvalidParams, 'End date is required');
    }

    // Validate timezone
    try {
      const tzTest = DateTime.now().setZone(timezone);
      if (!tzTest.isValid) {
        throw new McpError(ErrorCode.InvalidParams, `Invalid timezone: ${timezone}`);
      }
    } catch (e: any) {
      throw new McpError(ErrorCode.InvalidParams, `Invalid timezone: ${e.message}`);
    }

    // Parse the dates
    let startDateTime, endDateTime;
    try {
      startDateTime = parseTime(startDate, timezone).startOf('day');
      endDateTime = parseTime(endDate, timezone).startOf('day');
    } catch (e: any) {
      throw new McpError(ErrorCode.InvalidParams, `Error parsing dates: ${e.message}`);
    }

    // Make sure start date is before end date
    if (startDateTime > endDateTime) {
      const temp = startDateTime;
      startDateTime = endDateTime;
      endDateTime = temp;
    }

    // Common US holidays (simplified)
    const usHolidays: string[] = [];
    if (excludeHolidays) {
      // Add some common US holidays for the years in range
      const startYear = startDateTime.year;
      const endYear = endDateTime.year;

      for (let year = startYear; year <= endYear; year++) {
        // New Year's Day
        usHolidays.push(`${year}-01-01`);
        // Martin Luther King Jr. Day (third Monday in January)
        const mlkDay = DateTime.fromObject({ year, month: 1, day: 1 }).setZone(timezone);
        let thirdMonday = mlkDay.plus({ days: (8 - mlkDay.weekday) % 7 + 14 });
        usHolidays.push(thirdMonday.toISODate() || '');
        // Presidents' Day (third Monday in February)
        const presDay = DateTime.fromObject({ year, month: 2, day: 1 }).setZone(timezone);
        thirdMonday = presDay.plus({ days: (8 - presDay.weekday) % 7 + 14 });
        usHolidays.push(thirdMonday.toISODate() || '');
        // Memorial Day (last Monday in May)
        const memDay = DateTime.fromObject({ year, month: 6, day: 1 }).setZone(timezone).minus({ days: 1 });
        const lastMonday = memDay.minus({ days: (memDay.weekday - 1 + 7) % 7 });
        usHolidays.push(lastMonday.toISODate() || '');
        // Independence Day
        usHolidays.push(`${year}-07-04`);
        // Labor Day (first Monday in September)
        const laborDay = DateTime.fromObject({ year, month: 9, day: 1 }).setZone(timezone);
        const firstMonday = laborDay.plus({ days: (8 - laborDay.weekday) % 7 });
        usHolidays.push(firstMonday.toISODate() || '');
        // Thanksgiving (fourth Thursday in November)
        const thanksgiving = DateTime.fromObject({ year, month: 11, day: 1 }).setZone(timezone);
        const fourthThursday = thanksgiving.plus({ days: (11 - thanksgiving.weekday) % 7 + 21 });
        usHolidays.push(fourthThursday.toISODate() || '');
        // Christmas
        usHolidays.push(`${year}-12-25`);
      }
    }

    // Calculate business days
    let businessDays = 0;
    let currentDate = startDateTime;
    const dates = [];

    while (currentDate <= endDateTime) {
      const weekday = currentDate.weekday;
      const dateStr = currentDate.toISODate() || '';

      // Check if it's a weekday (1-5, Monday to Friday) and not a holiday
      if (weekday >= 1 && weekday <= 5 && (!excludeHolidays || !usHolidays.includes(dateStr))) {
        businessDays++;
        dates.push(dateStr);
      }

      currentDate = currentDate.plus({ days: 1 });
    }

    // Calculate calendar days (including weekends and holidays)
    const calendarDays = endDateTime.diff(startDateTime, 'days').days;

    const result = {
      startDate: startDateTime.toISODate() || '',
      endDate: endDateTime.toISODate() || '',
      businessDays,
      calendarDays,
      weekendDays: calendarDays - businessDays - (excludeHolidays ? usHolidays.length : 0),
      holidaysExcluded: excludeHolidays ? usHolidays.length : 0,
      timezone,
      businessDatesIncluded: dates
    };

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2)
        }
      ]
    };
  }

  // Format a date in various styles
  if (request.params.name === "format_date") {
    const args = request.params.arguments as Record<string, any>;
    const date = args.date as string;
    const timezone = (args.timezone as string) || getSystemTimezone();
    const format = (args.format as string) || 'medium';
    const locale = (args.locale as string) || 'en-US';

    if (!date) {
      throw new McpError(ErrorCode.InvalidParams, 'Date is required');
    }

    // Validate timezone
    try {
      const tzTest = DateTime.now().setZone(timezone);
      if (!tzTest.isValid) {
        throw new McpError(ErrorCode.InvalidParams, `Invalid timezone: ${timezone}`);
      }
    } catch (e: any) {
      throw new McpError(ErrorCode.InvalidParams, `Invalid timezone: ${e.message}`);
    }

    // Parse the date
    let dateTime;
    try {
      dateTime = parseTime(date, timezone);
    } catch (e: any) {
      throw new McpError(ErrorCode.InvalidParams, `Error parsing date: ${e.message}`);
    }

    // Format the date according to the requested format
    let formattedDate = '';
    let formattedTime = '';
    let formattedDateTime = '';

    try {
      switch (format) {
        case 'short':
          formattedDate = dateTime.setLocale(locale).toLocaleString(DateTime.DATE_SHORT);
          formattedTime = dateTime.setLocale(locale).toLocaleString(DateTime.TIME_SIMPLE);
          formattedDateTime = dateTime.setLocale(locale).toLocaleString(DateTime.DATETIME_SHORT);
          break;
        case 'medium':
          formattedDate = dateTime.setLocale(locale).toLocaleString(DateTime.DATE_MED);
          formattedTime = dateTime.setLocale(locale).toLocaleString(DateTime.TIME_WITH_SECONDS);
          formattedDateTime = dateTime.setLocale(locale).toLocaleString(DateTime.DATETIME_MED);
          break;
        case 'full':
          formattedDate = dateTime.setLocale(locale).toLocaleString(DateTime.DATE_FULL);
          formattedTime = dateTime.setLocale(locale).toLocaleString(DateTime.TIME_WITH_SECONDS);
          formattedDateTime = dateTime.setLocale(locale).toLocaleString(DateTime.DATETIME_FULL);
          break;
        case 'iso':
          formattedDate = dateTime.toISODate() || '';
          formattedTime = dateTime.toISOTime() || '';
          formattedDateTime = dateTime.toISO() || '';
          break;
        case 'relative':
          const now = DateTime.now().setZone(timezone);
          const diff = dateTime.diff(now, ['years', 'months', 'days', 'hours', 'minutes']);

          if (Math.abs(diff.as('days')) < 1) {
            // Today
            if (Math.abs(diff.as('hours')) < 1) {
              // Within the hour
              const minutes = Math.round(Math.abs(diff.as('minutes')));
              formattedDateTime = diff.as('minutes') >= 0
                ? `In ${minutes} minute${minutes !== 1 ? 's' : ''}`
                : `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
            } else {
              // Hours
              const hours = Math.round(Math.abs(diff.as('hours')));
              formattedDateTime = diff.as('hours') >= 0
                ? `In ${hours} hour${hours !== 1 ? 's' : ''}`
                : `${hours} hour${hours !== 1 ? 's' : ''} ago`;
            }
          } else if (Math.abs(diff.as('days')) < 7) {
            // Within a week
            const days = Math.round(Math.abs(diff.as('days')));
            formattedDateTime = diff.as('days') >= 0
              ? `In ${days} day${days !== 1 ? 's' : ''}`
              : `${days} day${days !== 1 ? 's' : ''} ago`;
          } else if (Math.abs(diff.as('months')) < 1) {
            // Within a month
            const weeks = Math.round(Math.abs(diff.as('weeks')));
            formattedDateTime = diff.as('weeks') >= 0
              ? `In ${weeks} week${weeks !== 1 ? 's' : ''}`
              : `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
          } else if (Math.abs(diff.as('years')) < 1) {
            // Within a year
            const months = Math.round(Math.abs(diff.as('months')));
            formattedDateTime = diff.as('months') >= 0
              ? `In ${months} month${months !== 1 ? 's' : ''}`
              : `${months} month${months !== 1 ? 's' : ''} ago`;
          } else {
            // Years
            const years = Math.round(Math.abs(diff.as('years')));
            formattedDateTime = diff.as('years') >= 0
              ? `In ${years} year${years !== 1 ? 's' : ''}`
              : `${years} year${years !== 1 ? 's' : ''} ago`;
          }

          formattedDate = formattedDateTime;
          formattedTime = formattedDateTime;
          break;
        default:
          formattedDate = dateTime.setLocale(locale).toLocaleString(DateTime.DATE_MED);
          formattedTime = dateTime.setLocale(locale).toLocaleString(DateTime.TIME_WITH_SECONDS);
          formattedDateTime = dateTime.setLocale(locale).toLocaleString(DateTime.DATETIME_MED);
      }
    } catch (e: any) {
      throw new McpError(ErrorCode.InternalError, `Error formatting date: ${e.message}`);
    }

    const result = {
      originalDate: date,
      parsedDate: dateTime.toISO() || '',
      formattedDate,
      formattedTime,
      formattedDateTime,
      dayOfWeek: dateTime.weekdayLong,
      dayOfMonth: dateTime.day,
      month: dateTime.monthLong,
      year: dateTime.year,
      timezone,
      locale,
      format
    };

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2)
        }
      ]
    };
  }

  throw new McpError(ErrorCode.MethodNotFound, "Tool not found");
});

// Start the server with stdio transport for Claude Desktop
const transport = new StdioServerTransport();

// Use an IIFE to handle the async connection
(async () => {
  await server.connect(transport);
})();

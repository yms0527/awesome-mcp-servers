/**
 * Type definitions for the TimezoneToolkit MCP server
 */

// Basic timezone conversion types
export interface TimeConversionRequest {
  time?: string;  // ISO string or natural language time, defaults to current time if not provided
  fromTimezone: string;  // IANA timezone name
  toTimezone: string;  // IANA timezone name
  format?: 'short' | 'medium' | 'full';  // Output format, defaults to 'medium'
}

export interface TimeConversionResponse {
  originalTime: string;  // The input time in ISO format
  convertedTime: string;  // The converted time in requested format
  fromTimezone: string;  // The source timezone
  toTimezone: string;  // The target timezone
  timeDifference: string;  // The time difference in hours and minutes
}

export interface CurrentTimeRequest {
  timezone: string;  // IANA timezone name
  format?: 'short' | 'medium' | 'full';  // Output format, defaults to 'medium'
}

export interface CurrentTimeResponse {
  currentTime: string;  // The current time in the requested timezone and format
  timezone: string;  // The timezone
  utcOffset: string;  // The UTC offset
}

// Sunrise/Sunset calculation types
export interface SunriseSunsetRequest {
  date?: string;  // ISO date string or natural language date, defaults to current date
  latitude: number;  // Latitude of the location
  longitude: number;  // Longitude of the location
  timezone?: string;  // IANA timezone name, defaults to UTC
}

export interface SunriseSunsetResponse {
  date: string;  // The date for which calculations were made
  sunrise: string;  // Sunrise time
  sunset: string;  // Sunset time
  civilTwilight: {
    dawn: string;  // Civil twilight start (dawn)
    dusk: string;  // Civil twilight end (dusk)
  };
  nauticalTwilight: {
    dawn: string;  // Nautical twilight start
    dusk: string;  // Nautical twilight end
  };
  astronomicalTwilight: {
    dawn: string;  // Astronomical twilight start
    dusk: string;  // Astronomical twilight end
  };
  dayLength: string;  // Length of daylight in hours and minutes
  timezone: string;  // The timezone used for the calculations
}

// Meeting scheduler types
export interface Participant {
  name: string;
  timezone: string;  // IANA timezone name
}

export interface MeetingSchedulerRequest {
  participants: Participant[];
  date?: string;  // ISO date string or natural language date, defaults to current date
  duration?: number;  // Meeting duration in minutes, defaults to 60
  startHour?: number;  // Earliest hour to consider (in each participant's local time), defaults to 9
  endHour?: number;  // Latest hour to consider (in each participant's local time), defaults to 17
}

export interface TimeSlot {
  startTime: string;  // ISO string
  endTime: string;  // ISO string
  participantTimes: {
    name: string;
    timezone: string;
    localStartTime: string;
    localEndTime: string;
  }[];
}

export interface MeetingSchedulerResponse {
  date: string;  // The date for which suggestions were made
  suggestedTimeSlots: TimeSlot[];  // Suggested meeting time slots
  optimalTimeSlot?: TimeSlot;  // The most optimal time slot, if available
}

// Working hours overlap types
export interface WorkingHoursRequest {
  teams: {
    name: string;
    timezone: string;  // IANA timezone name
    workingHours: {
      start: string;  // Time in format "HH:MM"
      end: string;  // Time in format "HH:MM"
    };
  }[];
  userTimezone?: string;  // IANA timezone name, defaults to system timezone
}

export interface WorkingHoursResponse {
  teams: {
    name: string;
    timezone: string;
    workingHoursInUserTimezone: {
      start: string;
      end: string;
    };
  }[];
  overlapPeriods: {
    teams: string[];  // Names of teams that overlap
    startTime: string;  // ISO string
    endTime: string;  // ISO string
    durationMinutes: number;
  }[];
  userTimezone: string;
}

// Holiday awareness types
export interface HolidayCheckRequest {
  date: string;  // ISO date string or natural language date
  countries: string[];  // ISO country codes
}

export interface Holiday {
  name: string;
  date: string;  // ISO date string
  country: string;  // ISO country code
  type: string;  // e.g., "public", "bank", "observance"
}

export interface HolidayCheckResponse {
  date: string;  // The date that was checked
  holidays: Holiday[];  // List of holidays on the specified date
}

export interface HolidayRangeRequest {
  startDate: string;  // ISO date string or natural language date
  endDate: string;  // ISO date string or natural language date
  countries: string[];  // ISO country codes
}

export interface HolidayRangeResponse {
  startDate: string;  // The start date of the range
  endDate: string;  // The end date of the range
  holidays: {
    [date: string]: Holiday[];  // Holidays grouped by date
  };
}

export interface CustomHoliday {
  name: string;
  date: string;  // ISO date string
  recurring?: boolean;  // Whether the holiday recurs annually
}

export interface AddCustomHolidayRequest {
  holiday: CustomHoliday;
}

export interface AddCustomHolidayResponse {
  success: boolean;
  message: string;
  holiday: CustomHoliday;
}

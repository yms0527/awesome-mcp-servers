/**
 * Sunrise/Sunset Calculation Service
 *
 * Provides functionality for calculating sunrise, sunset, twilight times,
 * and day length for any location and date.
 */

import { DateTime } from 'luxon';
import SunCalc from 'suncalc';
import { SunriseSunsetRequest, SunriseSunsetResponse } from '../types/index.js';
import { parseTime, formatDuration, isValidTimezone } from '../utils/dateTimeUtils.js';

/**
 * Calculates sunrise, sunset, and twilight times for a specific location and date
 */
export async function calculateSunriseSunset(date: string | undefined, latitude: number, longitude: number, timezone: string = 'UTC'): Promise<string> {
  // Validate latitude and longitude
  if (latitude < -90 || latitude > 90) {
    throw new Error('Latitude must be between -90 and 90 degrees');
  }
  if (longitude < -180 || longitude > 180) {
    throw new Error('Longitude must be between -180 and 180 degrees');
  }

  // Validate timezone
  if (!isValidTimezone(timezone)) {
    throw new Error(`Invalid timezone: ${timezone}`);
  }

  // Parse the input date
  const dateTime = parseTime(date, timezone);

  // Get the date at midnight in the specified timezone
  const dateAtMidnight = dateTime.startOf('day').toJSDate();

  // Calculate sun times using SunCalc
  const sunTimes = SunCalc.getTimes(dateAtMidnight, latitude, longitude);

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
    dayLength: formatDuration(dayLengthMinutes),
    timezone
  };

  return JSON.stringify(result, null, 2);
}

/**
 * Calculates moon phases for a specific date
 */
export async function calculateMoonPhase(date: string | undefined, timezone: string = 'UTC'): Promise<string> {
  // Validate timezone
  if (!isValidTimezone(timezone)) {
    throw new Error(`Invalid timezone: ${timezone}`);
  }

  // Parse the input date
  const dateTime = parseTime(date, timezone);

  // Get the date at midnight in the specified timezone
  const dateAtMidnight = dateTime.startOf('day').toJSDate();

  // Calculate moon illumination using SunCalc
  const moonIllumination = SunCalc.getMoonIllumination(dateAtMidnight);

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

  const result = {
    date: dateTime.toISODate() || '',
    phase: moonIllumination.phase,
    name: phaseName,
    illumination: moonIllumination.fraction,
    timezone
  };

  return JSON.stringify(result, null, 2);
}

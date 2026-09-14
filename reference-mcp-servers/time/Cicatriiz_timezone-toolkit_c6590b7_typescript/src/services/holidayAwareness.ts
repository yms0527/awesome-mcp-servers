/**
 * Holiday Awareness Service
 *
 * Provides functionality for checking holidays in various countries
 * and managing custom holidays.
 */

import { DateTime } from 'luxon';
import Holidays from 'date-holidays';
import {
  HolidayCheckRequest,
  HolidayCheckResponse,
  HolidayRangeRequest,
  HolidayRangeResponse,
  Holiday,
  AddCustomHolidayRequest,
  CustomHoliday
} from '../types/index.js';
import { parseTime } from '../utils/dateTimeUtils.js';

// Store for custom holidays
const customHolidays: CustomHoliday[] = [];

/**
 * Checks if a specific date is a holiday in various countries
 */
export async function checkHoliday(date: string, countries: string[]): Promise<string> {
  // Validate countries
  if (!countries || countries.length === 0) {
    throw new Error('At least one country is required');
  }

  // Parse the input date
  const dateTime = parseTime(date);
  const isoDate = dateTime.toISODate();

  if (!isoDate) {
    throw new Error(`Invalid date: ${date}`);
  }

  // Initialize holidays instance
  const hd = new Holidays();

  // Get holidays for each country
  const holidays: Holiday[] = [];

  for (const country of countries) {
    try {
      // Set the country
      hd.init(country);

      // Get holidays for the specified date
      const countryHolidays = hd.isHoliday(new Date(isoDate));

      if (countryHolidays && countryHolidays.length > 0) {
        for (const holiday of countryHolidays) {
          holidays.push({
            name: holiday.name,
            date: isoDate,
            country,
            type: holiday.type
          });
        }
      }
    } catch (error) {
      console.error(`Error getting holidays for country ${country}:`, error);
    }
  }

  // Check custom holidays
  const matchingCustomHolidays = customHolidays.filter(holiday => {
    const holidayDate = DateTime.fromISO(holiday.date);

    // Check if it's the same date (recurring holidays check only month and day)
    if (holiday.recurring) {
      return holidayDate.month === dateTime.month && holidayDate.day === dateTime.day;
    } else {
      return holidayDate.toISODate() === isoDate;
    }
  });

  // Add custom holidays to the result
  for (const customHoliday of matchingCustomHolidays) {
    holidays.push({
      name: customHoliday.name,
      date: isoDate,
      country: 'CUSTOM',
      type: 'custom'
    });
  }

  const result = {
    date: isoDate,
    holidays
  };

  return JSON.stringify(result, null, 2);
}

/**
 * Gets holidays in a date range for various countries
 */
export async function getHolidaysInRange(startDate: string, endDate: string, countries: string[]): Promise<string> {
  // Validate countries
  if (!countries || countries.length === 0) {
    throw new Error('At least one country is required');
  }

  // Parse the input dates
  const startDateTime = parseTime(startDate);
  const endDateTime = parseTime(endDate);

  const startIsoDate = startDateTime.toISODate();
  const endIsoDate = endDateTime.toISODate();

  if (!startIsoDate || !endIsoDate) {
    throw new Error('Invalid date range');
  }

  // Validate date range
  if (startDateTime > endDateTime) {
    throw new Error('Start date must be before end date');
  }

  // Initialize holidays instance
  const hd = new Holidays();

  // Get holidays for each country
  const holidaysByDate: { [date: string]: Holiday[] } = {};

  for (const country of countries) {
    try {
      // Set the country
      hd.init(country);

      // Get holidays for the specified year(s)
      const startYear = startDateTime.year;
      const endYear = endDateTime.year;

      for (let year = startYear; year <= endYear; year++) {
        const countryHolidays = hd.getHolidays(year);

        for (const holiday of countryHolidays) {
          // Convert the holiday date to a DateTime object
          const holidayDate = typeof holiday.date === 'string'
            ? DateTime.fromISO(holiday.date).toISODate()
            : DateTime.fromJSDate(holiday.date as Date).toISODate();

          if (holidayDate && holidayDate >= startIsoDate && holidayDate <= endIsoDate) {
            if (!holidaysByDate[holidayDate]) {
              holidaysByDate[holidayDate] = [];
            }

            holidaysByDate[holidayDate].push({
              name: holiday.name,
              date: holidayDate,
              country,
              type: holiday.type
            });
          }
        }
      }
    } catch (error) {
      console.error(`Error getting holidays for country ${country}:`, error);
    }
  }

  // Check custom holidays
  for (const customHoliday of customHolidays) {
    const holidayDate = DateTime.fromISO(customHoliday.date);
    const holidayIsoDate = holidayDate.toISODate();

    if (holidayIsoDate && holidayIsoDate >= startIsoDate && holidayIsoDate <= endIsoDate) {
      if (!holidaysByDate[holidayIsoDate]) {
        holidaysByDate[holidayIsoDate] = [];
      }

      holidaysByDate[holidayIsoDate].push({
        name: customHoliday.name,
        date: holidayIsoDate,
        country: 'CUSTOM',
        type: 'custom'
      });
    }

    // For recurring holidays, check if they fall within the date range in any year
    if (customHoliday.recurring) {
      const startYear = startDateTime.year;
      const endYear = endDateTime.year;

      for (let year = startYear; year <= endYear; year++) {
        const recurringDate = DateTime.fromObject({
          year,
          month: holidayDate.month,
          day: holidayDate.day
        });

        const recurringIsoDate = recurringDate.toISODate();

        if (recurringIsoDate && recurringIsoDate >= startIsoDate && recurringIsoDate <= endIsoDate) {
          if (!holidaysByDate[recurringIsoDate]) {
            holidaysByDate[recurringIsoDate] = [];
          }

          holidaysByDate[recurringIsoDate].push({
            name: customHoliday.name,
            date: recurringIsoDate,
            country: 'CUSTOM',
            type: 'custom'
          });
        }
      }
    }
  }

  const result = {
    startDate: startIsoDate,
    endDate: endIsoDate,
    holidays: holidaysByDate
  };

  return JSON.stringify(result, null, 2);
}

/**
 * Gets a list of supported countries
 */
export async function getSupportedCountries(): Promise<string> {
  const hd = new Holidays();
  const countries = hd.getCountries();

  const countryList = Object.entries(countries).map(([code, name]) => ({
    code,
    name: name as string
  }));

  const result = {
    countries: countryList
  };

  return JSON.stringify(result, null, 2);
}

/**
 * Adds a custom holiday
 */
export async function addCustomHoliday(holiday: { name: string, date: string, recurring?: boolean }): Promise<string> {
  // Validate holiday
  if (!holiday.name || !holiday.date) {
    throw new Error('Holiday name and date are required');
  }

  // Parse the date
  const dateTime = parseTime(holiday.date);
  const isoDate = dateTime.toISODate();

  if (!isoDate) {
    throw new Error(`Invalid date: ${holiday.date}`);
  }

  // Create the custom holiday
  const customHoliday: CustomHoliday = {
    name: holiday.name,
    date: isoDate,
    recurring: holiday.recurring || false
  };

  // Add to the custom holidays store
  customHolidays.push(customHoliday);

  const result = {
    success: true,
    message: `Custom holiday "${holiday.name}" added successfully`,
    holiday: customHoliday
  };

  return JSON.stringify(result, null, 2);
}

/**
 * Gets all custom holidays
 */
export async function getCustomHolidays(): Promise<string> {
  const result = {
    holidays: customHolidays
  };

  return JSON.stringify(result, null, 2);
}

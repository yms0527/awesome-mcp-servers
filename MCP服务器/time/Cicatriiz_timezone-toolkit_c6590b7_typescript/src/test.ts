/**
 * Test script for the TimezoneToolkit MCP server
 *
 * This script tests the basic functionality of each service.
 */

import { DateTime } from 'luxon';
import SunCalc from 'suncalc';
import Holidays from 'date-holidays';
import { parseTime, formatDateTime, getTimezoneDifference, formatDuration, getSystemTimezone, isValidTimezone } from './utils/dateTimeUtils.js';

// Test dateTimeUtils
function testDateTimeUtils() {
  console.log('\n=== Testing Date/Time Utilities ===');

  // Test parseTime
  console.log('\nTesting parseTime:');
  const now = parseTime(undefined, 'UTC');
  console.log('Current time (UTC):', now.toISO());

  const isoTime = parseTime('2023-04-15T14:30:00', 'America/New_York');
  console.log('Parsed ISO time:', isoTime.toISO());

  const naturalTime = parseTime('tomorrow', 'Europe/London');
  console.log('Parsed "tomorrow":', naturalTime.toISO());

  // Test formatDateTime
  console.log('\nTesting formatDateTime:');
  const dateTime = DateTime.fromISO('2023-04-15T14:30:00', { zone: 'UTC' });
  console.log('Short format:', formatDateTime(dateTime, 'short'));
  console.log('Medium format:', formatDateTime(dateTime, 'medium'));
  console.log('Full format:', formatDateTime(dateTime, 'full'));

  // Test getTimezoneDifference
  console.log('\nTesting getTimezoneDifference:');
  console.log('NY to Tokyo:', getTimezoneDifference('America/New_York', 'Asia/Tokyo'));
  console.log('London to Sydney:', getTimezoneDifference('Europe/London', 'Australia/Sydney'));

  // Test formatDuration
  console.log('\nTesting formatDuration:');
  console.log('30 minutes:', formatDuration(30));
  console.log('90 minutes:', formatDuration(90));
  console.log('120 minutes:', formatDuration(120));

  // Test getSystemTimezone
  console.log('\nTesting getSystemTimezone:');
  console.log('System timezone:', getSystemTimezone());

  // Test isValidTimezone
  console.log('\nTesting isValidTimezone:');
  console.log('America/New_York:', isValidTimezone('America/New_York'));
  console.log('Invalid/Timezone:', isValidTimezone('Invalid/Timezone'));
}

// Test SunCalc
function testSunCalc() {
  console.log('\n=== Testing SunCalc ===');

  // Test sunrise/sunset calculation
  const date = new Date();
  const latitude = 37.7749; // San Francisco
  const longitude = -122.4194;

  const sunTimes = SunCalc.getTimes(date, latitude, longitude);

  console.log('\nSun times for San Francisco:');
  console.log('Sunrise:', sunTimes.sunrise.toLocaleTimeString());
  console.log('Sunset:', sunTimes.sunset.toLocaleTimeString());
  console.log('Dawn (civil twilight start):', sunTimes.dawn.toLocaleTimeString());
  console.log('Dusk (civil twilight end):', sunTimes.dusk.toLocaleTimeString());

  // Test moon phase calculation
  const moonIllumination = SunCalc.getMoonIllumination(date);

  console.log('\nMoon phase:');
  console.log('Phase:', moonIllumination.phase);
  console.log('Illumination:', moonIllumination.fraction);
}

// Test Holidays
function testHolidays() {
  console.log('\n=== Testing Holidays ===');

  const hd = new Holidays();

  // Test getting holidays for a country
  hd.init('US');
  const usHolidays = hd.getHolidays(new Date().getFullYear());

  console.log('\nUS Holidays this year:');
  for (let i = 0; i < Math.min(5, usHolidays.length); i++) {
    const holidayDate = new Date(usHolidays[i].date);
    console.log(`${holidayDate.toDateString()}: ${usHolidays[i].name}`);
  }

  // Test checking if a date is a holiday
  const christmas = new Date(new Date().getFullYear(), 11, 25); // December 25
  const isChristmasHoliday = hd.isHoliday(christmas);

  console.log('\nIs Christmas a holiday in the US?', isChristmasHoliday ? 'Yes' : 'No');

  // Test getting supported countries
  const countries = hd.getCountries();

  console.log('\nSample of supported countries:');
  const countryCodes = Object.keys(countries);
  for (let i = 0; i < Math.min(5, countryCodes.length); i++) {
    console.log(`${countryCodes[i]}: ${countries[countryCodes[i]]}`);
  }
}

// Run tests
console.log('=== TimezoneToolkit Test Script ===');
testDateTimeUtils();
testSunCalc();
testHolidays();
console.log('\nAll tests completed!');

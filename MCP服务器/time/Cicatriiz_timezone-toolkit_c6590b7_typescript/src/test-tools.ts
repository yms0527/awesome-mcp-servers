/**
 * Test script for the TimezoneToolkit MCP server tools
 * 
 * This script tests each tool with various inputs to ensure they work correctly.
 */

import { DateTime } from 'luxon';
import SunCalc from 'suncalc';
import { parseTime, formatDateTime, getTimezoneDifference, getSystemTimezone, isValidTimezone } from './utils/dateTimeUtils.js';

// Helper function to run a test and log the result
function runTest(name: string, testFn: () => void) {
  console.log(`\n=== Testing ${name} ===`);
  try {
    testFn();
    console.log(`✅ ${name} test passed`);
  } catch (error) {
    console.error(`❌ ${name} test failed:`, error);
  }
}

// Test convert_time tool
function testConvertTime() {
  console.log('\nTesting time conversion:');
  
  // Test case 1: Convert current time from New York to Tokyo
  const fromTimezone = 'America/New_York';
  const toTimezone = 'Asia/Tokyo';
  
  try {
    // Validate timezones
    if (!isValidTimezone(fromTimezone)) {
      throw new Error(`Invalid source timezone: ${fromTimezone}`);
    }
    if (!isValidTimezone(toTimezone)) {
      throw new Error(`Invalid target timezone: ${toTimezone}`);
    }
    
    // Parse the input time (current time)
    const dateTime = parseTime(undefined, fromTimezone);
    
    // Convert to the target timezone
    const convertedDateTime = dateTime.setZone(toTimezone);
    
    // Calculate time difference
    const timeDifference = getTimezoneDifference(fromTimezone, toTimezone);
    
    console.log(`Current time in ${fromTimezone}: ${dateTime.toLocaleString(DateTime.DATETIME_FULL)}`);
    console.log(`Current time in ${toTimezone}: ${convertedDateTime.toLocaleString(DateTime.DATETIME_FULL)}`);
    console.log(`Time difference: ${timeDifference}`);
  } catch (e) {
    console.error('Error:', e);
    throw e;
  }
  
  // Test case 2: Convert specific time with different format
  try {
    const time = '2023-12-25T10:30:00';
    const dateTime = parseTime(time, fromTimezone);
    const convertedDateTime = dateTime.setZone(toTimezone);
    
    console.log(`\nSpecific time (${time}) in ${fromTimezone}: ${dateTime.toLocaleString(DateTime.DATETIME_FULL)}`);
    console.log(`Specific time in ${toTimezone}: ${convertedDateTime.toLocaleString(DateTime.DATETIME_FULL)}`);
  } catch (e) {
    console.error('Error:', e);
    throw e;
  }
}

// Test get_current_time tool
function testGetCurrentTime() {
  console.log('\nTesting current time in different timezones:');
  
  const timezones = ['America/New_York', 'Europe/London', 'Asia/Tokyo', 'Australia/Sydney'];
  
  for (const timezone of timezones) {
    try {
      // Validate timezone
      if (!isValidTimezone(timezone)) {
        throw new Error(`Invalid timezone: ${timezone}`);
      }
      
      // Get current time in the specified timezone
      const now = DateTime.now().setZone(timezone);
      
      // Get UTC offset
      const utcOffset = now.toFormat('ZZ');
      
      console.log(`Current time in ${timezone}: ${now.toLocaleString(DateTime.DATETIME_FULL)} (UTC${utcOffset})`);
    } catch (e) {
      console.error(`Error for ${timezone}:`, e);
      throw e;
    }
  }
}

// Test calculate_sunrise_sunset tool
function testCalculateSunriseSunset() {
  console.log('\nTesting sunrise/sunset calculation:');
  
  // Test locations
  const locations = [
    { name: 'San Francisco', latitude: 37.7749, longitude: -122.4194 },
    { name: 'New York', latitude: 40.7128, longitude: -74.0060 },
    { name: 'London', latitude: 51.5074, longitude: -0.1278 },
    { name: 'Tokyo', latitude: 35.6762, longitude: 139.6503 }
  ];
  
  for (const location of locations) {
    try {
      // Get the date at midnight in the specified timezone
      const dateTime = parseTime(undefined, 'UTC');
      const dateAtMidnight = dateTime.startOf('day').toJSDate();
      
      // Calculate sun times using SunCalc
      const sunTimes = SunCalc.getTimes(dateAtMidnight, location.latitude, location.longitude);
      
      // Format times
      const formatTime = (time: Date) => {
        return DateTime.fromJSDate(time).toLocaleString(DateTime.TIME_WITH_SECONDS);
      };
      
      console.log(`\nSunrise/sunset for ${location.name}:`);
      console.log(`Sunrise: ${formatTime(sunTimes.sunrise)}`);
      console.log(`Sunset: ${formatTime(sunTimes.sunset)}`);
      console.log(`Dawn (civil twilight start): ${formatTime(sunTimes.dawn)}`);
      console.log(`Dusk (civil twilight end): ${formatTime(sunTimes.dusk)}`);
    } catch (e) {
      console.error(`Error for ${location.name}:`, e);
      throw e;
    }
  }
}

// Test calculate_moon_phase tool
function testCalculateMoonPhase() {
  console.log('\nTesting moon phase calculation:');
  
  // Test dates
  const dates = [
    undefined, // Current date
    '2023-01-06', // New Moon
    '2023-01-21', // Full Moon
    '2023-04-20', // First Quarter
    '2023-07-10'  // Last Quarter
  ];
  
  for (const date of dates) {
    try {
      // Parse the input date
      const dateTime = parseTime(date, 'UTC');
      
      // Get the date at midnight
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
      
      console.log(`\nMoon phase for ${date || 'today'} (${dateTime.toISODate()}):`);
      console.log(`Phase: ${phase.toFixed(3)}`);
      console.log(`Phase name: ${phaseName}`);
      console.log(`Illumination: ${(moonIllumination.fraction * 100).toFixed(1)}%`);
    } catch (e) {
      console.error(`Error for date ${date}:`, e);
      throw e;
    }
  }
}

// Test calculate_timezone_difference tool
function testCalculateTimezoneDifference() {
  console.log('\nTesting timezone difference calculation:');
  
  // Test timezone pairs
  const timezonePairs = [
    { from: 'America/New_York', to: 'America/Los_Angeles' },
    { from: 'America/New_York', to: 'Europe/London' },
    { from: 'Europe/London', to: 'Asia/Tokyo' },
    { from: 'Asia/Tokyo', to: 'Australia/Sydney' }
  ];
  
  for (const pair of timezonePairs) {
    try {
      // Calculate time difference
      const timeDifference = getTimezoneDifference(pair.from, pair.to);
      
      // Get current time in both timezones for reference
      const now = DateTime.now();
      const fromTime = now.setZone(pair.from).toLocaleString(DateTime.DATETIME_SHORT);
      const toTime = now.setZone(pair.to).toLocaleString(DateTime.DATETIME_SHORT);
      
      console.log(`\nTime difference from ${pair.from} to ${pair.to}: ${timeDifference}`);
      console.log(`Current time in ${pair.from}: ${fromTime}`);
      console.log(`Current time in ${pair.to}: ${toTime}`);
    } catch (e) {
      console.error(`Error for ${pair.from} to ${pair.to}:`, e);
      throw e;
    }
  }
}

// Test list_timezones tool
function testListTimezones() {
  console.log('\nTesting timezone listing:');
  
  // Common IANA timezones by region
  const regions = ['America', 'Europe', 'Asia', 'Australia', 'Pacific'];
  
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
  
  for (const region of regions) {
    try {
      // Filter timezones by region
      const filteredTimezones = timezones.filter(tz => tz.startsWith(region));
      
      console.log(`\nTimezones in ${region} region (${filteredTimezones.length}):`);
      for (const tz of filteredTimezones) {
        const now = DateTime.now().setZone(tz);
        const offset = now.toFormat('ZZ');
        console.log(`${tz}: ${now.toLocaleString(DateTime.DATETIME_SHORT)} (UTC${offset})`);
      }
    } catch (e) {
      console.error(`Error for region ${region}:`, e);
      throw e;
    }
  }
}

// Test calculate_countdown tool
function testCalculateCountdown() {
  console.log('\nTesting countdown calculation:');
  
  // Test dates
  const dates = [
    { title: 'New Year', date: `${new Date().getFullYear() + 1}-01-01` },
    { title: 'Past Event', date: '2020-01-01' },
    { title: 'Tomorrow', date: DateTime.now().plus({ days: 1 }).toISODate() || '' },
    { title: 'Next Week', date: DateTime.now().plus({ weeks: 1 }).toISODate() || '' },
    { title: 'Next Month', date: DateTime.now().plus({ months: 1 }).toISODate() || '' }
  ];
  
  for (const item of dates) {
    try {
      // Parse the target date
      const targetDateTime = parseTime(item.date, 'UTC');
      
      // Get current time
      const now = DateTime.now().setZone('UTC');
      
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
      
      console.log(`\nCountdown for "${item.title}" (${item.date}):`);
      console.log(`Target date: ${targetDateTime.toLocaleString(DateTime.DATETIME_FULL)}`);
      console.log(`Current date: ${now.toLocaleString(DateTime.DATETIME_FULL)}`);
      console.log(`Is past: ${isPast}`);
      console.log(`Countdown: ${countdownText}`);
    } catch (e) {
      console.error(`Error for ${item.title}:`, e);
      throw e;
    }
  }
}

// Test calculate_business_days tool
function testCalculateBusinessDays() {
  console.log('\nTesting business days calculation:');
  
  // Test date ranges
  const dateRanges = [
    { name: 'One Week', start: '2023-05-01', end: '2023-05-07' }, // Monday to Sunday
    { name: 'Weekend Only', start: '2023-05-06', end: '2023-05-07' }, // Saturday to Sunday
    { name: 'Month with Holidays', start: '2023-12-01', end: '2023-12-31' }, // December with Christmas
    { name: 'Across Years', start: '2023-12-15', end: '2024-01-15' } // Across years with holidays
  ];
  
  for (const range of dateRanges) {
    try {
      // Parse the dates
      const startDateTime = parseTime(range.start, 'UTC').startOf('day');
      const endDateTime = parseTime(range.end, 'UTC').startOf('day');
      
      // Calculate business days (excluding weekends)
      let businessDays = 0;
      let currentDate = startDateTime;
      const dates = [];
      
      while (currentDate <= endDateTime) {
        const weekday = currentDate.weekday;
        const dateStr = currentDate.toISODate() || '';
        
        // Check if it's a weekday (1-5, Monday to Friday)
        if (weekday >= 1 && weekday <= 5) {
          businessDays++;
          dates.push(dateStr);
        }
        
        currentDate = currentDate.plus({ days: 1 });
      }
      
      // Calculate calendar days
      const calendarDays = endDateTime.diff(startDateTime, 'days').days;
      
      console.log(`\nBusiness days for "${range.name}" (${range.start} to ${range.end}):`);
      console.log(`Calendar days: ${calendarDays}`);
      console.log(`Business days: ${businessDays}`);
      console.log(`Weekend days: ${calendarDays - businessDays}`);
      
      // Test with holidays excluded
      console.log(`\nWith US holidays excluded:`);
      // This is a simplified version - the actual implementation has more detailed holiday calculation
      const holidays = ['2023-12-25', '2024-01-01']; // Christmas and New Year's Day
      const businessDaysExcludingHolidays = dates.filter(date => !holidays.includes(date)).length;
      console.log(`Business days: ${businessDaysExcludingHolidays}`);
      console.log(`Holidays excluded: ${businessDays - businessDaysExcludingHolidays}`);
    } catch (e) {
      console.error(`Error for ${range.name}:`, e);
      throw e;
    }
  }
}

// Test format_date tool
function testFormatDate() {
  console.log('\nTesting date formatting:');
  
  // Test dates
  const dates = [
    undefined, // Current date
    '2023-12-25', // Christmas
    '2023-01-01', // New Year's Day
    '2023-07-04', // Independence Day
    DateTime.now().plus({ days: 1 }).toISODate() // Tomorrow
  ];
  
  // Test formats
  const formats = ['short', 'medium', 'full', 'iso', 'relative'];
  
  // Test locales
  const locales = ['en-US', 'fr', 'de', 'ja', 'es'];
  
  for (const date of dates) {
    try {
      // Parse the date
      const dateTime = parseTime(date, 'UTC');
      
      console.log(`\nFormatting date: ${date || 'today'} (${dateTime.toISODate()}):`);
      
      // Test different formats
      console.log('\nDifferent formats:');
      for (const format of formats) {
        let formattedDate = '';
        let formattedTime = '';
        let formattedDateTime = '';
        
        switch (format) {
          case 'short':
            formattedDate = dateTime.toLocaleString(DateTime.DATE_SHORT);
            formattedTime = dateTime.toLocaleString(DateTime.TIME_SIMPLE);
            formattedDateTime = dateTime.toLocaleString(DateTime.DATETIME_SHORT);
            break;
          case 'medium':
            formattedDate = dateTime.toLocaleString(DateTime.DATE_MED);
            formattedTime = dateTime.toLocaleString(DateTime.TIME_WITH_SECONDS);
            formattedDateTime = dateTime.toLocaleString(DateTime.DATETIME_MED);
            break;
          case 'full':
            formattedDate = dateTime.toLocaleString(DateTime.DATE_FULL);
            formattedTime = dateTime.toLocaleString(DateTime.TIME_WITH_SECONDS);
            formattedDateTime = dateTime.toLocaleString(DateTime.DATETIME_FULL);
            break;
          case 'iso':
            formattedDate = dateTime.toISODate() || '';
            formattedTime = dateTime.toISOTime() || '';
            formattedDateTime = dateTime.toISO() || '';
            break;
          case 'relative':
            const now = DateTime.now();
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
        }
        
        console.log(`${format}: ${formattedDateTime}`);
      }
      
      // Test different locales
      console.log('\nDifferent locales:');
      for (const locale of locales) {
        const formatted = dateTime.setLocale(locale).toLocaleString(DateTime.DATETIME_FULL);
        console.log(`${locale}: ${formatted}`);
      }
    } catch (e) {
      console.error(`Error for date ${date}:`, e);
      throw e;
    }
  }
}

// Run all tests
console.log('=== TimezoneToolkit Test Suite ===');

runTest('Convert Time', testConvertTime);
runTest('Get Current Time', testGetCurrentTime);
runTest('Calculate Sunrise/Sunset', testCalculateSunriseSunset);
runTest('Calculate Moon Phase', testCalculateMoonPhase);
runTest('Calculate Timezone Difference', testCalculateTimezoneDifference);
runTest('List Timezones', testListTimezones);
runTest('Calculate Countdown', testCalculateCountdown);
runTest('Calculate Business Days', testCalculateBusinessDays);
runTest('Format Date', testFormatDate);

console.log('\nAll tests completed!');

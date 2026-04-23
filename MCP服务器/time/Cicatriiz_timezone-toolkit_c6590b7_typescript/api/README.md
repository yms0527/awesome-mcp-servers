# TimezoneToolkit API

This API provides RESTful access to the TimezoneToolkit MCP server functionality.

## Base URL

When running locally:
```
http://localhost:3000
```

## Authentication

Currently, the API does not require authentication.

## Endpoints

### Get Available Tools

```
GET /api/tools
```

Returns a list of all available tools in the TimezoneToolkit.

**Response Example:**
```json
{
  "tools": [
    {
      "name": "convert_time",
      "description": "Convert a time from one timezone to another",
      "inputSchema": {
        "type": "object",
        "properties": {
          "time": { "type": "string", "description": "Time to convert (ISO string or natural language). Defaults to current time if not provided." },
          "fromTimezone": { "type": "string", "description": "Source IANA timezone name (e.g., 'America/New_York')" },
          "toTimezone": { "type": "string", "description": "Target IANA timezone name (e.g., 'Europe/London')" },
          "format": { "type": "string", "enum": ["short", "medium", "full"], "description": "Output format. Defaults to 'medium'" }
        },
        "required": ["fromTimezone", "toTimezone"]
      }
    },
    // Other tools...
  ]
}
```

### Convert Time

```
POST /api/convert-time
```

Converts a time from one timezone to another.

**Request Body:**
```json
{
  "time": "2023-12-25T14:30:00",
  "fromTimezone": "America/New_York",
  "toTimezone": "Asia/Tokyo",
  "format": "full"
}
```

**Response Example:**
```json
{
  "originalTime": "2023-12-25T14:30:00.000-05:00",
  "convertedTime": "Tuesday, December 26, 2023, 4:30:00 AM Japan Standard Time",
  "fromTimezone": "America/New_York",
  "toTimezone": "Asia/Tokyo",
  "timeDifference": "+14:00"
}
```

### Get Current Time

```
POST /api/current-time
```

Gets the current time in a specified timezone.

**Request Body:**
```json
{
  "timezone": "Europe/London",
  "format": "full"
}
```

**Response Example:**
```json
{
  "currentTime": "Monday, March 25, 2025, 10:15:30 PM British Summer Time",
  "timezone": "Europe/London",
  "utcOffset": "+01:00"
}
```

### Calculate Sunrise/Sunset

```
POST /api/sunrise-sunset
```

Calculates sunrise, sunset, and twilight times for a specific location and date.

**Request Body:**
```json
{
  "date": "2023-06-21",
  "latitude": 37.7749,
  "longitude": -122.4194,
  "timezone": "America/Los_Angeles"
}
```

**Response Example:**
```json
{
  "date": "2023-06-21",
  "sunrise": "05:48:11 AM",
  "sunset": "08:35:13 PM",
  "civilTwilight": {
    "dawn": "05:17:22 AM",
    "dusk": "09:06:02 PM"
  },
  "nauticalTwilight": {
    "dawn": "04:38:43 AM",
    "dusk": "09:44:41 PM"
  },
  "astronomicalTwilight": {
    "dawn": "03:52:50 AM",
    "dusk": "10:30:34 PM"
  },
  "dayLength": "14 hours 47 minutes",
  "timezone": "America/Los_Angeles"
}
```

### Calculate Moon Phase

```
POST /api/moon-phase
```

Calculates moon phase for a specific date.

**Request Body:**
```json
{
  "date": "2023-01-06",
  "timezone": "UTC"
}
```

**Response Example:**
```json
{
  "date": "2023-01-06",
  "phase": 0.998,
  "phaseName": "Full Moon",
  "illumination": 0.997,
  "timezone": "UTC"
}
```

### Calculate Timezone Difference

```
POST /api/timezone-difference
```

Calculates the time difference between two timezones.

**Request Body:**
```json
{
  "fromTimezone": "America/New_York",
  "toTimezone": "Asia/Tokyo"
}
```

**Response Example:**
```json
{
  "fromTimezone": "America/New_York",
  "toTimezone": "Asia/Tokyo",
  "timeDifference": "+14:00",
  "currentTimeFrom": "3/25/2025, 6:15 PM",
  "currentTimeTo": "3/26/2025, 8:15 AM",
  "hoursDifference": 14,
  "minutesDifference": 0,
  "totalMinutesDifference": 840,
  "direction": "ahead"
}
```

### List Timezones

```
POST /api/list-timezones
```

Lists available IANA timezones, optionally filtered by region.

**Request Body:**
```json
{
  "region": "Europe"
}
```

**Response Example:**
```json
{
  "timezones": [
    {
      "timezone": "Europe/Amsterdam",
      "currentTime": "3/25/2025, 11:15 PM",
      "offset": "+02:00"
    },
    {
      "timezone": "Europe/Berlin",
      "currentTime": "3/25/2025, 11:15 PM",
      "offset": "+02:00"
    },
    // Additional European timezones...
  ],
  "count": 7,
  "region": "Europe"
}
```

### Calculate Countdown

```
POST /api/countdown
```

Calculates time remaining until a specific date/event.

**Request Body:**
```json
{
  "targetDate": "2025-12-31T23:59:59",
  "timezone": "UTC",
  "title": "New Year's Eve"
}
```

**Response Example:**
```json
{
  "title": "New Year's Eve",
  "targetDate": "2025-12-31T23:59:59.000Z",
  "formattedTargetDate": "Wednesday, December 31, 2025, 11:59:59 PM GMT",
  "currentDate": "2025-03-25T18:15:30.000Z",
  "timezone": "UTC",
  "isPast": false,
  "countdown": "9 months, 6 days, 5 hours, 44 minutes, 29 seconds",
  "remaining": {
    "years": 0,
    "months": 9,
    "days": 6,
    "hours": 5,
    "minutes": 44,
    "seconds": 29,
    "totalDays": 281,
    "totalHours": 6749,
    "totalMinutes": 404969,
    "totalSeconds": 24298169
  }
}
```

### Calculate Business Days

```
POST /api/business-days
```

Calculates business days between two dates (excluding weekends).

**Request Body:**
```json
{
  "startDate": "2023-05-01",
  "endDate": "2023-05-31",
  "timezone": "UTC",
  "excludeHolidays": true
}
```

**Response Example:**
```json
{
  "startDate": "2023-05-01",
  "endDate": "2023-05-31",
  "businessDays": 22,
  "calendarDays": 31,
  "weekendDays": 8,
  "holidaysExcluded": 1,
  "timezone": "UTC",
  "businessDatesIncluded": ["2023-05-01", "2023-05-02", "2023-05-03", "2023-05-04", "2023-05-05", "2023-05-08", "2023-05-09", "2023-05-10", "2023-05-11", "2023-05-12", "2023-05-15", "2023-05-16", "2023-05-17", "2023-05-18", "2023-05-19", "2023-05-22", "2023-05-23", "2023-05-24", "2023-05-25", "2023-05-26", "2023-05-30", "2023-05-31"]
}
```

### Format Date

```
POST /api/format-date
```

Formats a date in various styles.

**Request Body:**
```json
{
  "date": "2023-12-25",
  "timezone": "Europe/Paris",
  "format": "full",
  "locale": "fr"
}
```

**Response Example:**
```json
{
  "originalDate": "2023-12-25",
  "parsedDate": "2023-12-25T00:00:00.000+01:00",
  "formattedDate": "lundi 25 décembre 2023",
  "formattedTime": "00:00:00 heure normale d'Europe centrale",
  "formattedDateTime": "lundi 25 décembre 2023 à 00:00:00 heure normale d'Europe centrale",
  "dayOfWeek": "lundi",
  "dayOfMonth": 25,
  "month": "décembre",
  "year": 2023,
  "timezone": "Europe/Paris",
  "locale": "fr",
  "format": "full"
}
```

## Error Handling

All endpoints return a JSON response with an `error` field when an error occurs:

```json
{
  "error": "Error message"
}
```

HTTP status codes:
- 200: Success
- 400: Bad request (invalid parameters)
- 500: Server error

## Rate Limiting

Currently, there is no rate limiting implemented.

#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { ListTimezonesResponse, TimezoneConversionResponse, TimezoneDbGetTimeZoneResponse, WorldTimeResponse } from "../types/types.js";
import { formatUnixTimestamp, fromUtcToIntlRange } from "./utils.js";

const NWS_API_BASE = "https://worldtimeapi.org/api";
const USER_AGENT = "worldtime-app/1.0";
const TIMEZONE_API_BASE = "http://api.timezonedb.com/v2.1";
const TIMEZONE_DB_API_KEY = process.env.TIMEZONE_DB_API_KEY;

const server = new McpServer({
name: "worldtime",
version: "1.0.0",
});

async function getTime<T>(url: string): Promise<T | null> {
  const headers = {
    "User-Agent": USER_AGENT,
    "Accept": "application/json",
  }

  try {
    const response = await fetch(url, { headers });
    console.log(response);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return (await response.json()) as T;
  } catch (error) {
    console.error("🚨 Error making request:", error);
    return null;
  }
}

const listTimezones = async () => {
  const result = await fetch(`${TIMEZONE_API_BASE}/list-time-zone?key=${TIMEZONE_DB_API_KEY}&format=json`);
  const data: ListTimezonesResponse = await result.json();
  return data;
}

const getTimezoneSchema = z.object({
timezone: z.string(),
latitude: z.number().optional(),
longitude: z.number().optional(),
});

const getTimezoneByZone = async (args: z.infer<typeof getTimezoneSchema>) => {
  const { timezone, latitude, longitude } = args;
  let data: TimezoneDbGetTimeZoneResponse | null = null;
  if (latitude && longitude) {
    const result = await fetch(`${TIMEZONE_API_BASE}/get-time-zone?key=${TIMEZONE_DB_API_KEY}&format=json&by=position&lat=${latitude}&lng=${longitude}`);
    data = await result.json();
  } else {
    const result = await fetch(`${TIMEZONE_API_BASE}/get-time-zone?key=${TIMEZONE_DB_API_KEY}&format=json&by=zone&zone=${timezone}`);
    data = await result.json();
  }
  
  if (!data) {
      return {
          content: [{
                  type: "text" as const,
                  text: "🚨 Error fetching time data from TimezoneDB"
              }]
      };
  }
  
  return {
      content: [{
              type: "text",
        text: `The local time in ${data.countryName} ${data.zoneName} ${data.abbreviation} is ${data.formatted} in ${data.zoneName} ${data.abbreviation}.  
        The timezone in ${data.countryName} ${data.zoneName} ${data.abbreviation} is ${data.zoneName} ${data.abbreviation}.`
      }]
  };
};

const getLocalTimeByUtcSchema = z.object({
  area: z.string().describe("The continent for the timezone we want to get the local time for"),
  location: z.string().describe("The location of the timezone to get the local time for"),
});

const getLocalTimeByUtc = async (args: z.infer<typeof getLocalTimeByUtcSchema>) => {
  const { area, location } = args;
  const result = await getTime<WorldTimeResponse>(`${NWS_API_BASE}/${area}/${location}`);
  const { utc_offset, unixtime, timezone } = result as WorldTimeResponse;

  const formattedUtcTime = formatUnixTimestamp(unixtime, { timeStyle: "long", timeZone: timezone });
  if (!result) {
      return {
          content: [{
            type: "text" as const,
            text: "Error fetching time data by your IP address from WorldTimeAPI"
          }]
      }
  }

  return {
      content: [{
        type: "text" as const,
        text: `The local time in ${result.timezone} is ${formattedUtcTime}.
        Unix epoch time is ${unixtime}.
        The UTC time is ${result.utc_datetime} for ${location}.
        UTC offset is ${utc_offset}.`
      }]
  }
}

const getTimezoneSchemaByIp = z.object({
ip: z.string().ip({ message: "Invalid IP address!" }),
});

const getLocalTimeByIp = async (args: z.infer<typeof getTimezoneSchemaByIp>) => {
  const { ip } = args;
  const result = await getTime<WorldTimeResponse>(`${NWS_API_BASE}/ip/${ip}`);
  
  if (!result) {
      return {
          content: [{
            type: "text" as const,
            text: "Error fetching time data by your IP address from WorldTimeAPI"
          }]
      }
  }

  return {
      content: [{
        type: "text" as const,
        text: `The local time in ${result.timezone} is ${result.datetime}. The UTC time is ${result.utc_datetime} for your IP address ${result.client_ip}.`
      }]
  }
}
const timezoneConversiongetTimezoneSchema = z.object({
  dateToConvert: z.union([z.string(), z.number(), z.date()]).describe("The date to convert, in UTC epoch time or a date string "),
timezone1: z.string().describe("The timezone to convert from (e.g. America/New_York or EDT)"),
timezone2: z.string().describe("The timezone to convert to (e.g. America/New_York or EDT)")
});

const convertTimezone = async (args: z.infer<typeof timezoneConversiongetTimezoneSchema>) => {
const { dateToConvert, timezone1, timezone2 } = args;

const originalDate = typeof dateToConvert === "number" ? formatUnixTimestamp(dateToConvert, { timeStyle: "short", timeZone: "UTC" }) : dateToConvert;

const result = await fetch(`${TIMEZONE_API_BASE}/convert-time-zone?key=${TIMEZONE_DB_API_KEY}&from=${timezone1}&to=${timezone2}&time=${dateToConvert}}&format=json`)

const data: TimezoneConversionResponse = await result.json();
const { fromTimestamp, toTimestamp, fromAbbreviation, toAbbreviation, fromZoneName, toZoneName } = data;

  const timezone1Time = formatUnixTimestamp(fromTimestamp, { timeStyle: "short", timeZone: timezone1 });
  const timezone2Time = formatUnixTimestamp(toTimestamp, { timeStyle: "short", timeZone: timezone2 });
  const options = { timezone: timezone1, timeStyle: "long" as const, format: "full" as const };
  const { start: timezone1Start, end: timezone1End } = fromUtcToIntlRange(originalDate, options);
  const { start: timezone2Start, end: timezone2End } = fromUtcToIntlRange(originalDate, options);


  if (!result) {
      return {
          content: [{
              type: "text" as const,
              text: "Error fetching time data from TimezoneDB"
          }]
      }
  }
  return {
    content: [{
      type: "text",
      text: `You tried to find what the ${originalDate} would in ${timezone2} when it ${timezone1Time}. 
      The timezone in ${timezone1} is ${fromZoneName} ${fromAbbreviation} and the timezone in ${timezone2} is ${toZoneName} ${toAbbreviation}.
      It would be ${timezone2Time} ${toAbbreviation} in ${timezone1}.

      At ${originalDate} in ${timezone1} the event starts at ${timezone1Start} and ends at ${timezone1End}.
      At ${originalDate} in ${timezone2} the event starts at ${timezone2Start} and ends at ${timezone2End}.
      `
    }]
}
}

server.tool("list-timezones",
"List out all available time zones supported by TimeZoneDB.",
{},
listTimezones as any)

server.tool("get-time-by-ip",
"Get the current time and timezone for an IP address",
getTimezoneSchemaByIp.shape,
getLocalTimeByIp as any)

server.tool("get-timezone",
  "Get local time, GMT offset, DST of a place by latitude & longitude, timezone name, abbreviation, city name, or IP address.",
  getTimezoneSchema.shape,
  getTimezoneByZone as any)

server.tool("convert-timezone",
  "Given a UTC time, find the time in a different timezone",
  timezoneConversiongetTimezoneSchema.shape,
convertTimezone as any)

async function runServer() {
const transport = new StdioServerTransport();
await server.connect(transport);

console.error("🌎 Success! Worldtime Server running on stdio");
}

runServer().catch((error) => {
console.error("🚨 Fatal error running server:", error);
process.exit(1);
});




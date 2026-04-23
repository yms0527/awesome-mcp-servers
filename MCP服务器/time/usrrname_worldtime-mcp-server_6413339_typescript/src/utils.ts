const isDate = (date: string | Date | number): date is Date => {
    return date instanceof Date ? true : false
}
/** @description Unix epoch is typically a 10 or 13 digit number */
export const unixEpochRegex = /^\d{10,13}$/;
export const isUnixEpoch = (date: string|number): boolean => unixEpochRegex.test(date.toString());
/** @description UTC/ISO 8601 format regex (simplified) */
export const utcRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})?$/;
export const isUtc = (date: unknown): boolean => typeof date === 'string' && utcRegex.test(date);

type IntlDateTimeFormatOptions = Intl.DateTimeFormatOptions;
/**
 * Converts a UTC start and end time to localized start and end time
 * @param utcTime - UTC time as string or Date object
 * @param options - Options for Intl.DateTimeFormat
 * @param start - Unix epoch start time of time range, if not provided, the 00:00:00 will be used
 * @param end - Unix epoch end time of time range, if not provided 23:59:59 will be used
 * @returns {
*  start: Date,
*  end: Date
* }
*/
const fromUtcToIntlRange = (date: string | number| Date, options: {
    timezone: Intl.DateTimeFormatOptions['timeZone'],
    timeStyle: Intl.DateTimeFormatOptions['timeStyle'],
    format: Intl.DateTimeFormatOptions['dateStyle'],
}, start?: number, end?: number) => {

   const targetDate = isDate(date) ? date : new Date(date);
   const utcDateStart = start ?? Date.UTC(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), 0, 0, 0);
   const utcDateEnd = end ?? Date.UTC(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), 23, 59, 59);

    const formatter = new Intl.DateTimeFormat("en-US", {
       timeZone: options.timezone,
       dateStyle: "long",
       timeStyle: "long"
   });

   const localDateStart = formatter.format(utcDateStart);
   const localDateEnd = formatter.format(utcDateEnd);
   return { start: localDateStart, end: localDateEnd };
};

/**
 * Converts a UTC time to local time
 * @param utcTime - UTC time as string or Date object
 * @returns Date object in local time
 */
const utcToLocal = (utcTime: string | Date): Date => {
    const date = isDate(utcTime) ? utcTime : new Date(utcTime);
    return new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
}

  /**
 * Converts a Unix epoch timestamp to a human-readable date string
 * @param epoch - Unix timestamp (seconds or milliseconds)
 * @param options - Optional Intl.DateTimeFormat options
 * @returns Formatted date string in local time or UTC and long format if no options are provided
 */
const formatUnixTimestamp = (
    epoch: number | string,
    options: Intl.DateTimeFormatOptions = {
      dateStyle: 'full',
      timeStyle: 'long',
      timeZone: 'UTC'
    }
): string => {
    if (!unixEpochRegex.test(epoch.toString())) {
        throw new Error("Invalid Unix epoch timestamp");
    }
    // Convert string to number if needed
    const timestamp = typeof epoch === 'string' ? parseInt(epoch, 10) : epoch;
    
    // Check if timestamp is in seconds (10 digits) or milliseconds (13 digits)
    const milliseconds = timestamp.toString().length <= 10 
      ? timestamp * 1000 
      : timestamp;
  
    // Use Intl.DateTimeFormat for localized formatting
    const formatter = new Intl.DateTimeFormat('en-US', options);
    
    return formatter.format(new Date(milliseconds));
};
  
export { formatUnixTimestamp, fromUtcToIntlRange, isDate, utcToLocal };


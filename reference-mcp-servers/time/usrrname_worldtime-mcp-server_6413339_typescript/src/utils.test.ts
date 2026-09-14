import { describe, expect, it } from "vitest";
import { formatUnixTimestamp, fromUtcToIntlRange } from "./utils.js";
const invalidTimestamps = [
    ["doesn't contain a timestamp", "not a timestamp"],
    ['doesn\'t contain 10 or 13 digits', 123456789],
    ['contains 13 letters and letters', "1715136000000letters"],
    ['contains 10 letters and letters', "1715136000letters"],
];
describe("formatUnixTimestamp", () => {
  it("should format a Unix epoch timestamp to a human-readable UTC date string", () => {
    const timestamp = 1715136000;
    const formatted = formatUnixTimestamp(timestamp);
    expect(formatted).toBe("Wednesday, May 8, 2024 at 2:40:00 AM UTC");
  });
    
    it.each(invalidTimestamps)("should throw an error if the timestamp %s is %s", (condition, timestamp) => {
    expect(() => formatUnixTimestamp(timestamp)).toThrowError("Invalid Unix epoch timestamp");
  });
 
});

describe("fromUtcToIntlRange", () => {
  it("should convert a numeric unix epoch timestamp to a localized time", () => {
    const utcTime = 1741561240000;
    const timezone = "America/Toronto";
    const formatted = fromUtcToIntlRange(utcTime, { timezone, timeStyle: "long", format: "full" });
      
      expect(formatted.start).toContain("March 8, 2025 at 7:00:00 PM EST");
      expect(formatted.end).toContain("March 9, 2025 at 7:59:59 PM EDT");
  });
    
    describe("should convert a UTC timestamp to a localized time when given a date and timezone", () => {
        it('for a date region not using daylight saving time', () => {
            const utcTime = "2025-02-01T00:00:00.000Z";
            const timezone = "America/New_York";
            
            const formatted = fromUtcToIntlRange(utcTime, timezone as any);

            expect(formatted.start).toContain("January 30, 2025 at 7:00:00 PM EST");
            expect(formatted.end).toContain("January 31, 2025 at 6:59:59 PM EST");
        })
        it('when the next day is a daylight saving time', () => {
            const utcTime = "2025-03-08T00:00:00.000Z";
            const timezone = "America/New_York";
            
            const formatted = fromUtcToIntlRange(utcTime, timezone as any);

            expect(formatted.start).toContain("March 6, 2025 at 7:00:00 PM EST");
            expect(formatted.end).toContain("March 7, 2025 at 6:59:59 PM EST");
        });

    });
});
import { PterodactylApiError } from "../../../src/client/errors.js";
import { formatToolError } from "../../../src/lib/errors.js";

describe("formatToolError", () => {
  it("should format PterodactylApiError with code, message, and status", () => {
    const error = new PterodactylApiError(401, "UNAUTHORIZED", "Invalid API key.");
    const result = formatToolError(error);

    expect(result.isError).toBe(true);
    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe("text");

    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.error).toBe("UNAUTHORIZED");
    expect(parsed.message).toBe("Invalid API key.");
    expect(parsed.status).toBe(401);
  });

  it("should format PterodactylApiError for 404", () => {
    const error = new PterodactylApiError(404, "NOT_FOUND", "Resource not found.");
    const result = formatToolError(error);

    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.error).toBe("NOT_FOUND");
    expect(parsed.status).toBe(404);
  });

  it("should format generic Error without stack trace", () => {
    const error = new Error("Something went wrong");
    const result = formatToolError(error);

    expect(result.isError).toBe(true);
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.error).toBe("INTERNAL_ERROR");
    expect(parsed.message).toBe("Something went wrong");
    expect(parsed.stack).toBeUndefined();
  });

  it("should handle non-Error values", () => {
    const result = formatToolError("string error");

    expect(result.isError).toBe(true);
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.error).toBe("INTERNAL_ERROR");
    expect(parsed.message).toBe("An unexpected error occurred");
  });

  it("should handle null error", () => {
    const result = formatToolError(null);

    expect(result.isError).toBe(true);
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.error).toBe("INTERNAL_ERROR");
  });

  it("should not leak API key in error response", () => {
    const error = new PterodactylApiError(401, "UNAUTHORIZED", "Invalid API key.");
    const result = formatToolError(error);

    const text = result.content[0].text;
    expect(text).not.toContain("ptla_");
    expect(text).not.toContain("ptlc_");
    expect(text).not.toContain("stack");
  });
});

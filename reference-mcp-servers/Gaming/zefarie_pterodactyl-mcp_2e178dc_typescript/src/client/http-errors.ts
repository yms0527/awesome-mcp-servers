import { PterodactylApiError } from "./errors.js";

export const RETRYABLE_STATUS_CODES = new Set([429, 500, 502, 503, 504]);

/**
 * Parse the Retry-After header from an HTTP response.
 * Returns the delay in milliseconds, or undefined if the header is absent or unparseable.
 * Supports both delta-seconds (e.g. "120") and HTTP-date formats.
 */
export function parseRetryAfter(headerValue: string | null): number | undefined {
  if (headerValue === null) {
    return undefined;
  }

  // Try delta-seconds first (most common for 429 responses)
  const seconds = Number(headerValue);
  if (Number.isFinite(seconds) && seconds >= 0) {
    return seconds * 1000;
  }

  // Try HTTP-date format (RFC 7231)
  const date = new Date(headerValue);
  if (!Number.isNaN(date.getTime())) {
    const delayMs = date.getTime() - Date.now();
    return Math.max(0, delayMs);
  }

  return undefined;
}

export function mapHttpError(status: number): PterodactylApiError {
  switch (status) {
    case 401:
      return new PterodactylApiError(
        401,
        "UNAUTHORIZED",
        "Authentication failed. Verify that PTERODACTYL_APP_KEY (starts with ptla_) or PTERODACTYL_CLIENT_KEY (starts with ptlc_) is correct and has not been revoked in the panel.",
      );
    case 403:
      return new PterodactylApiError(
        403,
        "FORBIDDEN",
        "Permission denied. Your API key does not have access to this resource. For admin tools, use an Application API key. For client tools, ensure you have access to this server.",
      );
    case 404:
      return new PterodactylApiError(
        404,
        "NOT_FOUND",
        "Resource not found. Verify the ID/identifier is correct by calling list_servers first. The server may have been deleted or you may not have access.",
      );
    case 429:
      return new PterodactylApiError(
        429,
        "RATE_LIMITED",
        "Rate limit exceeded. The request will be retried automatically. If this persists, reduce the frequency of API calls.",
      );
    default:
      if (RETRYABLE_STATUS_CODES.has(status)) {
        return new PterodactylApiError(
          status,
          "API_ERROR",
          `The Pterodactyl panel is temporarily unavailable (HTTP ${status}). The request will be retried automatically. Check that the panel is running.`,
        );
      }
      return new PterodactylApiError(
        status,
        "API_ERROR",
        `Panel API returned an unexpected status (HTTP ${status}).`,
      );
  }
}

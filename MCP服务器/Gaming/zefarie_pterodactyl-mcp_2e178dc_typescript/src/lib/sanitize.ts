/**
 * Security sanitization utilities.
 *
 * - Command sanitization for send_command
 * - HTML escaping for worker pages
 * - Sensitive field filtering for API responses
 */

// ─── Command Sanitization ────────────────────────────────────────────────────

const MAX_COMMAND_LENGTH = 1000;

/** Patterns that indicate potentially dangerous commands. */
const DANGEROUS_PATTERNS: readonly { pattern: RegExp; reason: string }[] = [
  { pattern: /\bop\s+/i, reason: "Grants operator (admin) privileges to a player" },
  { pattern: /\bdeop\s+/i, reason: "Removes operator privileges from a player" },
  { pattern: /\bstop\b/i, reason: "Stops the server process" },
  { pattern: /\bend\b/i, reason: "Stops the server process" },
  { pattern: /\bban\s+/i, reason: "Bans a player from the server" },
  { pattern: /\bban-ip\s+/i, reason: "Bans an IP address from the server" },
  { pattern: /\bpardon\s+/i, reason: "Unbans a player from the server" },
  { pattern: /\bwhitelist\s+(off|clear)\b/i, reason: "Disables or clears the server whitelist" },
  { pattern: /\bkick\s+/i, reason: "Kicks a player from the server" },
  { pattern: /\bfill\s+/i, reason: "Fills a region with blocks (can cause lag)" },
  { pattern: /\bclone\s+/i, reason: "Clones a region of blocks (can cause lag)" },
  { pattern: /\bsetblock\s+/i, reason: "Modifies world blocks" },
  { pattern: /\brcon\b/i, reason: "RCON command - may execute arbitrary server commands" },
  { pattern: /\bsave-off\b/i, reason: "Disables world auto-save" },
  {
    pattern: /\bexecute\b.*\brun\b/i,
    reason: "Execute-run chain - runs commands as other entities",
  },
  { pattern: /\bscoreboard\b.*\bplayers\b.*\bset\b/i, reason: "Modifies player scoreboard data" },
  { pattern: /[;&|`$]/, reason: "Contains shell metacharacters" },
  { pattern: /\0/, reason: "Contains null bytes" },
];

/**
 * Sanitize a command string before sending to a game server.
 * Removes null bytes and trims whitespace. Does NOT block commands.
 */
export function sanitizeCommand(command: string): string {
  // biome-ignore lint/suspicious/noControlCharactersInRegex: intentional null-byte removal
  return command.replace(/\x00/g, "").trim().slice(0, MAX_COMMAND_LENGTH);
}

/**
 * Check whether a command matches any known dangerous patterns.
 * Returns a list of warnings, not a block decision.
 */
export function checkCommandSafety(command: string): {
  safe: boolean;
  warnings: string[];
} {
  const warnings: string[] = [];

  for (const { pattern, reason } of DANGEROUS_PATTERNS) {
    if (pattern.test(command)) {
      warnings.push(reason);
    }
  }

  return {
    safe: warnings.length === 0,
    warnings,
  };
}

// ─── HTML Escaping ───────────────────────────────────────────────────────────

const HTML_ESCAPE_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
};

/**
 * Escape a string for safe injection into HTML.
 * Prevents XSS by encoding &, <, >, ", '.
 */
export function escapeHtml(str: string): string {
  return str.replace(/[&<>"']/g, (char) => HTML_ESCAPE_MAP[char] ?? char);
}

// ─── Sensitive Field Filtering ───────────────────────────────────────────────

/** Default field names that should be redacted from API responses. */
const SENSITIVE_FIELD_PATTERNS = ["token", "secret", "password", "key", "daemon_token", "remote"];

const REDACTED = "[REDACTED]";

/**
 * Test if a field name is sensitive (case-insensitive partial match).
 */
function isSensitiveFieldName(fieldName: string): boolean {
  const lower = fieldName.toLowerCase();
  return SENSITIVE_FIELD_PATTERNS.some((pattern) => lower.includes(pattern));
}

/**
 * Recursively filter sensitive fields from an object.
 * Replaces values of keys matching sensitive patterns with "[REDACTED]".
 *
 * @param obj - The object to filter
 * @param additionalFields - Extra field names to redact beyond the defaults
 * @returns A deep copy with sensitive values replaced
 */
export function filterSensitiveFields(
  obj: unknown,
  additionalFields: readonly string[] = [],
): unknown {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj !== "object") {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => filterSensitiveFields(item, additionalFields));
  }

  const result: Record<string, unknown> = {};
  const record = obj as Record<string, unknown>;

  for (const [key, value] of Object.entries(record)) {
    const isAdditionalSensitive = additionalFields.some(
      (f) => key.toLowerCase() === f.toLowerCase(),
    );

    if (isSensitiveFieldName(key) || isAdditionalSensitive) {
      result[key] = REDACTED;
    } else if (typeof value === "object" && value !== null) {
      result[key] = filterSensitiveFields(value, additionalFields);
    } else {
      result[key] = value;
    }
  }

  return result;
}

// ─── Environment Variable Masking ────────────────────────────────────────────

/** Patterns in env var NAMES that suggest the VALUE is a secret. */
const SENSITIVE_ENV_PATTERNS = ["password", "token", "secret", "key", "api", "auth", "credential"];

/**
 * Mask environment variable values that look like secrets.
 * Keeps variable names visible but replaces sensitive values with "[REDACTED]".
 *
 * @param env - Record of environment variable name-value pairs
 * @returns A copy with sensitive values masked
 */
export function maskEnvironmentVariables(env: Record<string, unknown>): Record<string, unknown> {
  const masked: Record<string, unknown> = {};

  for (const [name, value] of Object.entries(env)) {
    const lower = name.toLowerCase();
    const isSensitive = SENSITIVE_ENV_PATTERNS.some((pattern) => lower.includes(pattern));

    if (isSensitive && typeof value === "string") {
      masked[name] = REDACTED;
    } else {
      masked[name] = value;
    }
  }

  return masked;
}

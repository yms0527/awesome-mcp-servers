import { readFileSync, statSync, existsSync } from "node:fs";
import path from "node:path";

// ─── Config ──────────────────────────────────────────────────────────────────

export const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
if (!BOT_TOKEN) {
  console.error("Warning: TELEGRAM_BOT_TOKEN not set. Server will start but API calls will fail.");
}

export const DEFAULT_CHAT_ID = process.env.TELEGRAM_DEFAULT_CHAT_ID
  ? (isNaN(Number(process.env.TELEGRAM_DEFAULT_CHAT_ID))
    ? process.env.TELEGRAM_DEFAULT_CHAT_ID
    : Number(process.env.TELEGRAM_DEFAULT_CHAT_ID))
  : undefined;

export const DEFAULT_THREAD_ID = process.env.TELEGRAM_DEFAULT_THREAD_ID
  ? Number(process.env.TELEGRAM_DEFAULT_THREAD_ID)
  : undefined;

export const API_BASE = `https://api.telegram.org/bot${BOT_TOKEN}`;

// ─── Rate Limiting ────────────────────────────────────────────────────────────

let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 30; // ms between requests (Telegram limit: ~30 msg/sec)

async function rateLimit() {
  const now = Date.now();
  const elapsed = now - lastRequestTime;
  if (elapsed < MIN_REQUEST_INTERVAL) {
    await new Promise(r => setTimeout(r, MIN_REQUEST_INTERVAL - elapsed));
  }
  lastRequestTime = Date.now();
}

// ─── Retry Logic ──────────────────────────────────────────────────────────────

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // base delay in ms

async function withRetry(fn, retries = MAX_RETRIES) {
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (e) {
      lastError = e;
      // Don't retry on client errors (4xx)
      if (e.message.includes('(4') && !e.message.includes('(429)')) {
        throw e;
      }
      // Retry on rate limit (429) or server errors (5xx)
      if (attempt < retries) {
        const delay = RETRY_DELAY * Math.pow(2, attempt); // exponential backoff
        console.error(`[mcp-telegram] Attempt ${attempt + 1} failed, retrying in ${delay}ms...`);
        await new Promise(r => setTimeout(r, delay));
      }
    }
  }
  throw lastError;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function resolveChatId(chat_id) {
  const resolved = chat_id ?? DEFAULT_CHAT_ID;
  if (resolved === undefined) {
    throw new Error("chat_id is required (no TELEGRAM_DEFAULT_CHAT_ID configured)");
  }
  return resolved;
}

export function resolveThreadId(chat_id, message_thread_id) {
  if (message_thread_id !== undefined && message_thread_id !== null) {
    return message_thread_id;
  }
  if (DEFAULT_CHAT_ID === undefined || DEFAULT_THREAD_ID === undefined) {
    return undefined;
  }
  const resolvedChatId = chat_id ?? DEFAULT_CHAT_ID;
  if (resolvedChatId === DEFAULT_CHAT_ID || String(resolvedChatId) === String(DEFAULT_CHAT_ID)) {
    return DEFAULT_THREAD_ID;
  }
  return undefined;
}

// ─── Telegram API ──────────────────────────────────────────────────────────────

export async function tgCall(method, params = {}) {
  return withRetry(async () => {
    await rateLimit();
    const res = await fetch(`${API_BASE}/${method}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    const data = await res.json();
    if (!data.ok) {
      throw new Error(`Telegram API error: ${data.description} (${data.error_code})`);
    }
    return data.result;
  });
}

// Max file size: 50MB for bots
const MAX_FILE_SIZE = 50 * 1024 * 1024;

export async function tgUpload(method, filePath, fieldName, params = {}) {
  return withRetry(async () => {
    await rateLimit();

    // Validate file exists
    if (!existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    // Check file size
    const stats = statSync(filePath);
    if (stats.size > MAX_FILE_SIZE) {
      console.error(`[mcp-telegram] Warning: Large file (${Math.round(stats.size / 1024 / 1024)}MB). Consider using smaller files.`);
    }

    const fileData = readFileSync(filePath);
    const fileName = path.basename(filePath);

    const form = new FormData();
    form.append(fieldName, new Blob([fileData]), fileName);
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null) {
        form.append(k, String(v));
      }
    }

    const res = await fetch(`${API_BASE}/${method}`, {
      method: "POST",
      body: form,
    });
    const data = await res.json();
    if (!data.ok) {
      throw new Error(`Telegram API error: ${data.description} (${data.error_code})`);
    }
    return data.result;
  });
}

// ─── Response Helpers ──────────────────────────────────────────────────────────

export function formatResult(result) {
  return JSON.stringify(result, null, 2);
}

/**
 * Parse JSON string with strict error handling.
 * @throws {Error} If the string is not valid JSON
 */
export function parseJSON(str) {
  if (typeof str !== "string") return str;
  try {
    return JSON.parse(str);
  } catch (e) {
    throw new Error(`Invalid JSON: ${e.message}. Input: ${str.substring(0, 100)}...`);
  }
}

export function ok(text) {
  return { content: [{ type: "text", text }] };
}

export function err(text) {
  return { content: [{ type: "text", text }], isError: true };
}

/**
 * Check if a string is a valid file path.
 * Supports:
 * - Absolute paths (Unix: /path, Windows: C:\path)
 * - UNC paths (\\server\share)
 * - Relative paths starting with ./ or ..\
 */
export function isFilePath(str) {
  if (typeof str !== "string" || !str) return false;

  // Already a valid absolute path
  if (path.isAbsolute(str)) return true;

  // UNC path (Windows network share)
  if (str.startsWith('\\\\')) return true;

  // Relative path with explicit ./ or ..\
  if (str.startsWith('./') || str.startsWith('..\\') || str.startsWith('../')) return true;

  // Windows drive letter at start
  if (/^[A-Za-z]:[\\\/]/.test(str)) return true;

  // Check if it looks like a file path (has extension and no URL scheme)
  if (!str.includes('://') && !str.startsWith('http') && !str.startsWith('ftp')) {
    // Has a file-like structure
    const hasExtension = /\.[a-zA-Z0-9]{1,10}$/.test(str.split(/[?#]/)[0]);
    const hasPathSeparators = str.includes('/') || str.includes('\\');
    if (hasExtension || hasPathSeparators) return true;
  }

  return false;
}

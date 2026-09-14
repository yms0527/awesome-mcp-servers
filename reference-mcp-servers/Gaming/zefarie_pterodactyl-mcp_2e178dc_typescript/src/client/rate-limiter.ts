const DEFAULT_BURST_CAPACITY = 15;
const DEFAULT_REFILL_RATE_PER_SECOND = 1;

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Token bucket rate limiter.
 *
 * - Burst capacity: allows short bursts of requests (default 15).
 * - Refill rate: tokens regenerate at a steady rate (default 1/second = 60/minute).
 * - When the bucket is empty, `acquire()` waits until the next token is available.
 *
 * Compatible with both Node.js and Cloudflare Workers (uses Date.now(), not process.hrtime).
 */
export class RateLimiter {
  private readonly capacity: number;
  private readonly refillRateMs: number;
  private tokens: number;
  private lastRefillTime: number;

  constructor(maxRequestsPerMinute?: number) {
    const refillPerSecond = maxRequestsPerMinute
      ? maxRequestsPerMinute / 60
      : DEFAULT_REFILL_RATE_PER_SECOND;

    this.refillRateMs = 1000 / refillPerSecond;
    this.capacity = Math.min(
      DEFAULT_BURST_CAPACITY,
      maxRequestsPerMinute ?? DEFAULT_BURST_CAPACITY,
    );
    this.tokens = this.capacity;
    this.lastRefillTime = Date.now();
  }

  async acquire(): Promise<void> {
    this.refill();

    if (this.tokens >= 1) {
      this.tokens -= 1;
      return;
    }

    // Bucket is empty: calculate wait time until next token
    const waitMs = this.refillRateMs - (Date.now() - this.lastRefillTime);
    if (waitMs > 0) {
      await sleep(waitMs);
    }

    this.refill();
    this.tokens = Math.max(0, this.tokens - 1);
  }

  private refill(): void {
    const now = Date.now();
    const elapsed = now - this.lastRefillTime;
    const newTokens = elapsed / this.refillRateMs;

    if (newTokens >= 1) {
      this.tokens = Math.min(this.capacity, this.tokens + newTokens);
      this.lastRefillTime = now;
    }
  }
}

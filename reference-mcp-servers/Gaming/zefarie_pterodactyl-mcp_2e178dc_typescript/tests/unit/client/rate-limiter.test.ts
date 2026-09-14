import { RateLimiter } from "../../../src/client/rate-limiter.js";

describe("RateLimiter", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should allow burst of requests up to capacity", async () => {
    const limiter = new RateLimiter(60);
    const capacity = 15;

    for (let i = 0; i < capacity; i++) {
      await limiter.acquire();
    }
    // All 15 should complete without delay
  });

  it("should wait when bucket is empty", async () => {
    const limiter = new RateLimiter(60);

    // Drain the bucket
    for (let i = 0; i < 15; i++) {
      await limiter.acquire();
    }

    // Next acquire should wait
    let resolved = false;
    const promise = limiter.acquire().then(() => {
      resolved = true;
    });

    // Should not be resolved immediately
    expect(resolved).toBe(false);

    // Advance time to refill at least one token (1000ms for 60 req/min = 1 req/sec)
    await vi.advanceTimersByTimeAsync(1100);
    await promise;

    expect(resolved).toBe(true);
  });

  it("should respect custom max requests per minute", async () => {
    // 120 req/min = 2 req/sec, refill every 500ms
    const limiter = new RateLimiter(120);

    // Drain burst capacity (min of 15, 120) = 15
    for (let i = 0; i < 15; i++) {
      await limiter.acquire();
    }

    let resolved = false;
    const promise = limiter.acquire().then(() => {
      resolved = true;
    });

    // At 120 req/min, refill rate is 500ms per token
    await vi.advanceTimersByTimeAsync(600);
    await promise;

    expect(resolved).toBe(true);
  });

  it("should use default rate when no max specified", () => {
    const limiter = new RateLimiter();
    // Should not throw
    expect(limiter).toBeDefined();
  });
});

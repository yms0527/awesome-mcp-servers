const DEFAULT_FAILURE_THRESHOLD = 5;
const DEFAULT_COOLDOWN_MS = 30_000;

type CircuitState = "CLOSED" | "OPEN" | "HALF_OPEN";

/**
 * Circuit breaker for the Pterodactyl API client.
 *
 * States:
 * - CLOSED: normal operation, requests pass through.
 * - OPEN: too many consecutive failures, requests fail immediately.
 * - HALF_OPEN: cooldown elapsed, one probe request is allowed.
 *
 * Compatible with both Node.js and Cloudflare Workers (uses Date.now()).
 */
export class CircuitBreaker {
  private state: CircuitState = "CLOSED";
  private consecutiveFailures = 0;
  private openedAt = 0;
  private readonly failureThreshold: number;
  private readonly cooldownMs: number;

  constructor(failureThreshold?: number, cooldownMs?: number) {
    this.failureThreshold = failureThreshold ?? DEFAULT_FAILURE_THRESHOLD;
    this.cooldownMs = cooldownMs ?? DEFAULT_COOLDOWN_MS;
  }

  /**
   * Check if a request is allowed to proceed.
   * Throws if the circuit is OPEN and cooldown has not elapsed.
   * Transitions to HALF_OPEN if cooldown has elapsed.
   */
  allowRequest(): void {
    if (this.state === "CLOSED") {
      return;
    }

    if (this.state === "OPEN") {
      const elapsed = Date.now() - this.openedAt;
      if (elapsed >= this.cooldownMs) {
        this.state = "HALF_OPEN";
        return;
      }

      const remainingMs = this.cooldownMs - elapsed;
      throw new CircuitOpenError(
        `Circuit breaker is OPEN. ${Math.ceil(remainingMs / 1000)}s until next retry attempt.`,
        remainingMs,
      );
    }

    // HALF_OPEN: allow one probe request
  }

  /**
   * Record a successful request. Resets the circuit to CLOSED.
   */
  recordSuccess(): void {
    this.consecutiveFailures = 0;
    this.state = "CLOSED";
  }

  /**
   * Record a failed request. Opens the circuit if the failure threshold is reached.
   */
  recordFailure(): void {
    this.consecutiveFailures += 1;

    if (this.state === "HALF_OPEN") {
      this.state = "OPEN";
      this.openedAt = Date.now();
      return;
    }

    if (this.consecutiveFailures >= this.failureThreshold) {
      this.state = "OPEN";
      this.openedAt = Date.now();
    }
  }

  get currentState(): CircuitState {
    return this.state;
  }
}

export class CircuitOpenError extends Error {
  constructor(
    message: string,
    public readonly retryAfterMs: number,
  ) {
    super(message);
    this.name = "CircuitOpenError";
  }
}

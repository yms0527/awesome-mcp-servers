import { CircuitBreaker, CircuitOpenError } from "../../../src/client/circuit-breaker.js";

describe("CircuitBreaker", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("CLOSED state", () => {
    it("should start in CLOSED state", () => {
      const cb = new CircuitBreaker();
      expect(cb.currentState).toBe("CLOSED");
    });

    it("should allow requests in CLOSED state", () => {
      const cb = new CircuitBreaker();
      expect(() => cb.allowRequest()).not.toThrow();
    });

    it("should stay CLOSED when failures are below threshold", () => {
      const cb = new CircuitBreaker(5);
      cb.recordFailure();
      cb.recordFailure();
      cb.recordFailure();
      cb.recordFailure();
      expect(cb.currentState).toBe("CLOSED");
    });
  });

  describe("OPEN state", () => {
    it("should transition to OPEN after reaching failure threshold", () => {
      const cb = new CircuitBreaker(3);
      cb.recordFailure();
      cb.recordFailure();
      cb.recordFailure();
      expect(cb.currentState).toBe("OPEN");
    });

    it("should throw CircuitOpenError when OPEN", () => {
      const cb = new CircuitBreaker(2);
      cb.recordFailure();
      cb.recordFailure();

      expect(() => cb.allowRequest()).toThrow(CircuitOpenError);
    });

    it("should include retry info in CircuitOpenError", () => {
      const cb = new CircuitBreaker(2, 10000);
      cb.recordFailure();
      cb.recordFailure();

      try {
        cb.allowRequest();
        expect.unreachable("should have thrown");
      } catch (error) {
        expect(error).toBeInstanceOf(CircuitOpenError);
        expect((error as CircuitOpenError).retryAfterMs).toBeGreaterThan(0);
      }
    });
  });

  describe("HALF_OPEN state", () => {
    it("should transition to HALF_OPEN after cooldown", () => {
      const cb = new CircuitBreaker(2, 5000);
      cb.recordFailure();
      cb.recordFailure();
      expect(cb.currentState).toBe("OPEN");

      // Advance past cooldown
      vi.advanceTimersByTime(6000);
      cb.allowRequest();
      expect(cb.currentState).toBe("HALF_OPEN");
    });

    it("should transition to CLOSED on success in HALF_OPEN", () => {
      const cb = new CircuitBreaker(2, 5000);
      cb.recordFailure();
      cb.recordFailure();

      vi.advanceTimersByTime(6000);
      cb.allowRequest();
      expect(cb.currentState).toBe("HALF_OPEN");

      cb.recordSuccess();
      expect(cb.currentState).toBe("CLOSED");
    });

    it("should transition back to OPEN on failure in HALF_OPEN", () => {
      const cb = new CircuitBreaker(2, 5000);
      cb.recordFailure();
      cb.recordFailure();

      vi.advanceTimersByTime(6000);
      cb.allowRequest();
      expect(cb.currentState).toBe("HALF_OPEN");

      cb.recordFailure();
      expect(cb.currentState).toBe("OPEN");
    });
  });

  describe("reset behavior", () => {
    it("should reset consecutive failures on success", () => {
      const cb = new CircuitBreaker(5);
      cb.recordFailure();
      cb.recordFailure();
      cb.recordFailure();
      cb.recordSuccess();
      // Failure count reset, 4 more failures needed
      cb.recordFailure();
      cb.recordFailure();
      cb.recordFailure();
      cb.recordFailure();
      expect(cb.currentState).toBe("CLOSED");
      cb.recordFailure();
      expect(cb.currentState).toBe("OPEN");
    });

    it("should use default threshold of 5 when not specified", () => {
      const cb = new CircuitBreaker();
      for (let i = 0; i < 4; i++) {
        cb.recordFailure();
      }
      expect(cb.currentState).toBe("CLOSED");
      cb.recordFailure();
      expect(cb.currentState).toBe("OPEN");
    });
  });
});

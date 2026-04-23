import { PterodactylApiError } from "../../../src/client/errors.js";
import { PterodactylClient } from "../../../src/client/pterodactyl.client.js";
import { createPteroList, createPteroObject, createServer } from "../../fixtures/server.fixture.js";

const TEST_CONFIG = {
  baseUrl: "https://panel.example.com",
  appKey: "ptla_test_key",
  timeout: 5000,
  maxRequestsPerMinute: 1000,
};

describe("PterodactylClient", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    globalThis.fetch = fetchMock;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("URL validation", () => {
    it("should accept HTTPS URLs", () => {
      expect(() => new PterodactylClient(TEST_CONFIG)).not.toThrow();
    });

    it("should allow localhost with HTTP", () => {
      expect(
        () =>
          new PterodactylClient({
            ...TEST_CONFIG,
            baseUrl: "http://localhost:8080",
          }),
      ).not.toThrow();
    });

    it("should allow 127.0.0.1 with HTTP", () => {
      expect(
        () =>
          new PterodactylClient({
            ...TEST_CONFIG,
            baseUrl: "http://127.0.0.1:8080",
          }),
      ).not.toThrow();
    });

    it("should reject HTTP for non-localhost URLs", () => {
      expect(
        () =>
          new PterodactylClient({
            ...TEST_CONFIG,
            baseUrl: "http://panel.example.com",
          }),
      ).toThrow(PterodactylApiError);
    });

    it("should reject invalid URLs", () => {
      expect(
        () =>
          new PterodactylClient({
            ...TEST_CONFIG,
            baseUrl: "not-a-url",
          }),
      ).toThrow(PterodactylApiError);
    });

    it("should allow HTTP when allowInsecure is true", () => {
      expect(
        () =>
          new PterodactylClient({
            ...TEST_CONFIG,
            baseUrl: "http://panel.example.com",
            allowInsecure: true,
          }),
      ).not.toThrow();
    });
  });

  describe("listServers", () => {
    it("should GET /api/application/servers", async () => {
      const server = createServer({ id: 1 });
      const pteroList = createPteroList([server]);

      fetchMock.mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve(pteroList),
      });

      const client = new PterodactylClient(TEST_CONFIG);
      const result = await client.listServers();

      expect(fetchMock).toHaveBeenCalledWith(
        "https://panel.example.com/api/application/servers",
        expect.objectContaining({
          method: "GET",
          headers: expect.objectContaining({
            Authorization: "Bearer ptla_test_key",
          }),
        }),
      );
      expect(result.servers).toHaveLength(1);
      expect(result.servers[0].id).toBe(1);
    });

    it("should pass pagination params as query string", async () => {
      const pteroList = createPteroList([]);

      fetchMock.mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve(pteroList),
      });

      const client = new PterodactylClient(TEST_CONFIG);
      await client.listServers({ page: 2, per_page: 10 });

      expect(fetchMock).toHaveBeenCalledWith(
        "https://panel.example.com/api/application/servers?page=2&per_page=10",
        expect.anything(),
      );
    });
  });

  describe("getServer", () => {
    it("should GET /api/application/servers/2", async () => {
      const server = createServer({ id: 2, name: "Creative" });
      const pteroObject = createPteroObject(server);

      fetchMock.mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve(pteroObject),
      });

      const client = new PterodactylClient(TEST_CONFIG);
      const result = await client.getServer(2);

      expect(fetchMock).toHaveBeenCalledWith(
        "https://panel.example.com/api/application/servers/2",
        expect.objectContaining({ method: "GET" }),
      );
      expect(result.id).toBe(2);
      expect(result.name).toBe("Creative");
    });
  });

  describe("suspendServer", () => {
    it("should POST /api/application/servers/2/suspend and handle 204", async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        status: 204,
      });

      const client = new PterodactylClient(TEST_CONFIG);
      const result = await client.suspendServer(2);

      expect(fetchMock).toHaveBeenCalledWith(
        "https://panel.example.com/api/application/servers/2/suspend",
        expect.objectContaining({ method: "POST" }),
      );
      expect(result).toBeUndefined();
    });
  });

  describe("unsuspendServer", () => {
    it("should POST /api/application/servers/2/unsuspend and handle 204", async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        status: 204,
      });

      const client = new PterodactylClient(TEST_CONFIG);
      const result = await client.unsuspendServer(2);

      expect(fetchMock).toHaveBeenCalledWith(
        "https://panel.example.com/api/application/servers/2/unsuspend",
        expect.objectContaining({ method: "POST" }),
      );
      expect(result).toBeUndefined();
    });
  });

  describe("error handling", () => {
    it("should throw UNAUTHORIZED on 401", async () => {
      fetchMock.mockResolvedValue({ ok: false, status: 401 });

      const client = new PterodactylClient(TEST_CONFIG);

      try {
        await client.listServers();
        expect.unreachable("should have thrown");
      } catch (error) {
        expect(error).toBeInstanceOf(PterodactylApiError);
        expect((error as PterodactylApiError).status).toBe(401);
        expect((error as PterodactylApiError).code).toBe("UNAUTHORIZED");
      }
    });

    it("should throw FORBIDDEN on 403", async () => {
      fetchMock.mockResolvedValue({ ok: false, status: 403 });

      const client = new PterodactylClient(TEST_CONFIG);

      try {
        await client.listServers();
        expect.unreachable("should have thrown");
      } catch (error) {
        expect(error).toBeInstanceOf(PterodactylApiError);
        expect((error as PterodactylApiError).status).toBe(403);
        expect((error as PterodactylApiError).code).toBe("FORBIDDEN");
      }
    });

    it("should throw NOT_FOUND on 404", async () => {
      fetchMock.mockResolvedValue({ ok: false, status: 404 });

      const client = new PterodactylClient(TEST_CONFIG);

      try {
        await client.getServer(999);
        expect.unreachable("should have thrown");
      } catch (error) {
        expect(error).toBeInstanceOf(PterodactylApiError);
        expect((error as PterodactylApiError).status).toBe(404);
        expect((error as PterodactylApiError).code).toBe("NOT_FOUND");
      }
    });

    it("should throw RATE_LIMITED on 429", async () => {
      fetchMock.mockResolvedValue({
        ok: false,
        status: 429,
        headers: new Headers(),
      });

      vi.useFakeTimers();

      const client = new PterodactylClient(TEST_CONFIG);

      let caughtError: PterodactylApiError | undefined;
      const promise = client.listServers().catch((error: PterodactylApiError) => {
        caughtError = error;
      });

      // Advance through retry delays
      await vi.advanceTimersByTimeAsync(5000);
      await promise;

      expect(caughtError).toBeInstanceOf(PterodactylApiError);
      expect(caughtError?.status).toBe(429);
      expect(caughtError?.code).toBe("RATE_LIMITED");

      vi.useRealTimers();
    });

    it("should retry on 500 and throw after 3 attempts", async () => {
      fetchMock.mockResolvedValue({ ok: false, status: 500 });

      vi.useFakeTimers();

      const client = new PterodactylClient(TEST_CONFIG);

      let caughtError: PterodactylApiError | undefined;
      const promise = client.listServers().catch((error: PterodactylApiError) => {
        caughtError = error;
      });

      // Advance through retry delays: 1s (first retry), 2s (second retry)
      await vi.advanceTimersByTimeAsync(5000);
      await promise;

      expect(caughtError).toBeInstanceOf(PterodactylApiError);
      expect(caughtError?.status).toBe(500);
      expect(fetchMock).toHaveBeenCalledTimes(3);

      vi.useRealTimers();
    });

    it("should retry on 502 and succeed if second attempt works", async () => {
      const server = createServer({ id: 1 });
      const pteroList = createPteroList([server]);

      fetchMock.mockResolvedValueOnce({ ok: false, status: 502 }).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(pteroList),
      });

      vi.useFakeTimers();

      const client = new PterodactylClient(TEST_CONFIG);
      const promise = client.listServers();

      // Advance through first retry delay (1s)
      await vi.advanceTimersByTimeAsync(5000);

      const result = await promise;
      expect(result.servers).toHaveLength(1);
      expect(fetchMock).toHaveBeenCalledTimes(2);

      vi.useRealTimers();
    });
  });
});

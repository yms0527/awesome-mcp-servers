import type { ServerConfig } from "../types/index.js";
import * as appApi from "./app-api.js";
import { CircuitBreaker, CircuitOpenError } from "./circuit-breaker.js";
import * as clientApi from "./client-api.js";
import { PterodactylApiError } from "./errors.js";
import { mapHttpError, parseRetryAfter, RETRYABLE_STATUS_CODES } from "./http-errors.js";
import { RateLimiter, sleep } from "./rate-limiter.js";
import type {
  ActivityLogEntry,
  BackupAttributes,
  EggVariableAttributes,
  FileAttributes,
  ListParams,
  NestAttributes,
  NodeAttributes,
  PowerAction,
  PteroPagination,
  ServerAttributes,
  ServerResources,
  UserAttributes,
} from "./types.js";

const DEFAULT_TIMEOUT = 10_000;
const MAX_RETRIES = 3;
const RETRY_BASE_DELAY_MS = 1_000;
const MAX_RETRY_DELAY_MS = 30_000;

/** HTTP methods that are safe to retry by default. */
const IDEMPOTENT_METHODS = new Set(["GET", "HEAD", "OPTIONS", "DELETE", "PUT"]);

/** Network error codes that indicate a transient failure worth retrying. */
const RETRYABLE_NETWORK_CODES = new Set(["ECONNREFUSED", "ENOTFOUND", "ETIMEDOUT", "ECONNRESET"]);

interface DoRequestOptions {
  /** Override the default idempotency detection for retry logic. */
  idempotent?: boolean;
}

export class PterodactylClient {
  private readonly baseUrl: string;
  private readonly appKey: string;
  private readonly clientKey: string | undefined;
  private readonly timeout: number;
  private readonly rateLimiter: RateLimiter;
  private readonly circuitBreaker: CircuitBreaker;

  constructor(config: ServerConfig) {
    this.baseUrl = config.baseUrl.replace(/\/+$/, "");
    this.appKey = config.appKey;
    this.clientKey = config.clientKey;
    this.timeout = config.timeout ?? DEFAULT_TIMEOUT;
    this.rateLimiter = new RateLimiter(config.maxRequestsPerMinute);
    this.circuitBreaker = new CircuitBreaker();

    this.validateUrl(config.allowInsecure ?? false);
  }

  get hasClientKey(): boolean {
    return !!this.clientKey;
  }

  // ─── Application API Methods ─────────────────────────────────────────────

  async listServers(params?: ListParams): Promise<appApi.ListServersResult> {
    return appApi.listServers(this.appRequestFn, params);
  }

  async getServer(id: number): Promise<ServerAttributes> {
    return appApi.getServer(this.appRequestFn, id);
  }

  async suspendServer(id: number): Promise<void> {
    return appApi.suspendServer(this.appRequestFn, id);
  }

  async unsuspendServer(id: number): Promise<void> {
    return appApi.unsuspendServer(this.appRequestFn, id);
  }

  async listUsers(params?: ListParams): Promise<appApi.ListUsersResult> {
    return appApi.listUsers(this.appRequestFn, params);
  }

  async listNodes(params?: ListParams): Promise<appApi.ListNodesResult> {
    return appApi.listNodes(this.appRequestFn, params);
  }

  async reinstallServer(id: number): Promise<void> {
    return appApi.reinstallServer(this.appRequestFn, id);
  }

  async createServer(data: Record<string, unknown>): Promise<ServerAttributes> {
    return appApi.createServer(this.appRequestFn, data);
  }

  async deleteServer(id: number): Promise<void> {
    return appApi.deleteServer(this.appRequestFn, id);
  }

  async updateServerDetails(
    id: number,
    data: { name?: string; description?: string; user?: number; external_id?: string },
  ): Promise<ServerAttributes> {
    return appApi.updateServerDetails(this.appRequestFn, id, data);
  }

  async updateServerBuild(
    id: number,
    data: {
      memory?: number;
      swap?: number;
      disk?: number;
      io?: number;
      cpu?: number;
      threads?: string;
      allocation?: number;
      feature_limits?: { databases?: number; allocations?: number; backups?: number };
    },
  ): Promise<ServerAttributes> {
    return appApi.updateServerBuild(this.appRequestFn, id, data);
  }

  async updateServerStartup(
    id: number,
    data: {
      startup?: string;
      image?: string;
      egg?: number;
      environment?: Record<string, string>;
      skip_scripts?: boolean;
    },
  ): Promise<ServerAttributes> {
    return appApi.updateServerStartup(this.appRequestFn, id, data);
  }

  async getUser(id: number): Promise<UserAttributes> {
    return appApi.getUser(this.appRequestFn, id);
  }

  async createUser(data: {
    username: string;
    email: string;
    password: string;
    root_admin?: boolean;
  }): Promise<UserAttributes> {
    return appApi.createUser(this.appRequestFn, data);
  }

  async updateUser(
    id: number,
    data: { username?: string; email?: string; password?: string; root_admin?: boolean },
  ): Promise<UserAttributes> {
    return appApi.updateUser(this.appRequestFn, id, data);
  }

  async deleteUser(id: number): Promise<void> {
    return appApi.deleteUser(this.appRequestFn, id);
  }

  async getNode(id: number): Promise<NodeAttributes> {
    return appApi.getNode(this.appRequestFn, id);
  }

  async getNodeConfiguration(id: number): Promise<Record<string, unknown>> {
    return appApi.getNodeConfiguration(this.appRequestFn, id);
  }

  async listEggs(): Promise<{
    eggs: import("./types.js").EggAttributes[];
    pagination: PteroPagination;
  }> {
    return appApi.listEggs(this.appRequestFn);
  }

  async listNests(): Promise<{
    nests: import("./types.js").NestAttributes[];
    pagination: PteroPagination;
  }> {
    return appApi.listNests(this.appRequestFn);
  }

  async getEgg(nestId: number, eggId: number): Promise<import("./types.js").EggAttributes> {
    return appApi.getEgg(this.appRequestFn, nestId, eggId);
  }

  async importEgg(
    nestId: number,
    eggData: Record<string, unknown>,
  ): Promise<import("./types.js").EggAttributes> {
    return appApi.importEgg(this.appRequestFn, nestId, eggData);
  }

  async updateEgg(
    nestId: number,
    eggId: number,
    eggData: Record<string, unknown>,
  ): Promise<import("./types.js").EggAttributes> {
    return appApi.updateEgg(this.appRequestFn, nestId, eggId, eggData);
  }

  async deleteEgg(nestId: number, eggId: number): Promise<void> {
    return appApi.deleteEgg(this.appRequestFn, nestId, eggId);
  }

  async listRoles(): Promise<{
    roles: import("./types.js").RoleAttributes[];
    pagination: PteroPagination;
  }> {
    return appApi.listRoles(this.appRequestFn);
  }

  async listMounts(): Promise<{
    mounts: import("./types.js").MountAttributes[];
    pagination: PteroPagination;
  }> {
    return appApi.listMounts(this.appRequestFn);
  }

  async listServerDatabases(
    id: number,
  ): Promise<{ databases: Record<string, unknown>[]; pagination: PteroPagination }> {
    return appApi.listServerDatabases(this.appRequestFn, id);
  }

  async listAllocations(
    nodeId: number,
    params?: ListParams,
  ): Promise<appApi.ListAllocationsResult> {
    return appApi.listAllocations(this.appRequestFn, nodeId, params);
  }

  async createAllocation(nodeId: number, ip: string, ports: string[]): Promise<void> {
    return appApi.createAllocation(this.appRequestFn, nodeId, ip, ports);
  }

  async deleteAllocation(nodeId: number, allocationId: number): Promise<void> {
    return appApi.deleteAllocation(this.appRequestFn, nodeId, allocationId);
  }

  async listEggVariables(
    nestId: number,
    eggId: number,
  ): Promise<{ variables: EggVariableAttributes[]; pagination: PteroPagination }> {
    return appApi.listEggVariables(this.appRequestFn, nestId, eggId);
  }

  async createEggVariable(
    nestId: number,
    eggId: number,
    data: {
      name: string;
      description: string;
      env_variable: string;
      default_value: string;
      user_viewable: boolean;
      user_editable: boolean;
      rules: string;
    },
  ): Promise<EggVariableAttributes> {
    return appApi.createEggVariable(this.appRequestFn, nestId, eggId, data);
  }

  async updateEggVariable(
    nestId: number,
    eggId: number,
    variableId: number,
    data: {
      name?: string;
      description?: string;
      env_variable?: string;
      default_value?: string;
      user_viewable?: boolean;
      user_editable?: boolean;
      rules?: string;
    },
  ): Promise<EggVariableAttributes> {
    return appApi.updateEggVariable(this.appRequestFn, nestId, eggId, variableId, data);
  }

  async deleteEggVariable(nestId: number, eggId: number, variableId: number): Promise<void> {
    return appApi.deleteEggVariable(this.appRequestFn, nestId, eggId, variableId);
  }

  async getNest(nestId: number): Promise<NestAttributes> {
    return appApi.getNest(this.appRequestFn, nestId);
  }

  // ─── Client API Methods ──────────────────────────────────────────────────

  async getServerResources(identifier: string): Promise<ServerResources> {
    return clientApi.getServerResources(this.doRequestFn, this.requireClientKey(), identifier);
  }

  async sendPowerAction(identifier: string, action: PowerAction): Promise<void> {
    return clientApi.sendPowerAction(this.doRequestFn, this.requireClientKey(), identifier, action);
  }

  async sendCommand(identifier: string, command: string): Promise<void> {
    return clientApi.sendCommand(this.doRequestFn, this.requireClientKey(), identifier, command);
  }

  async listFiles(identifier: string, directory?: string): Promise<FileAttributes[]> {
    return clientApi.listFiles(this.doRequestFn, this.requireClientKey(), identifier, directory);
  }

  async listBackups(identifier: string): Promise<BackupAttributes[]> {
    return clientApi.listBackups(this.doRequestFn, this.requireClientKey(), identifier);
  }

  async readFile(identifier: string, filePath: string): Promise<string> {
    return clientApi.readFile(this.doRequestFn, this.requireClientKey(), identifier, filePath);
  }

  async writeFile(identifier: string, filePath: string, content: string): Promise<void> {
    return clientApi.writeFile(
      this.doRequestFn,
      this.requireClientKey(),
      identifier,
      filePath,
      content,
    );
  }

  async createFolder(identifier: string, root: string, name: string): Promise<void> {
    return clientApi.createFolder(
      this.doRequestFn,
      this.requireClientKey(),
      identifier,
      root,
      name,
    );
  }

  async deleteFiles(identifier: string, root: string, files: string[]): Promise<void> {
    return clientApi.deleteFiles(
      this.doRequestFn,
      this.requireClientKey(),
      identifier,
      root,
      files,
    );
  }

  async compressFiles(
    identifier: string,
    root: string,
    files: string[],
  ): Promise<Record<string, unknown>> {
    return clientApi.compressFiles(
      this.doRequestFn,
      this.requireClientKey(),
      identifier,
      root,
      files,
    );
  }

  async decompressFile(identifier: string, root: string, file: string): Promise<void> {
    return clientApi.decompressFile(
      this.doRequestFn,
      this.requireClientKey(),
      identifier,
      root,
      file,
    );
  }

  async renameFile(identifier: string, root: string, from: string, to: string): Promise<void> {
    return clientApi.renameFile(
      this.doRequestFn,
      this.requireClientKey(),
      identifier,
      root,
      from,
      to,
    );
  }

  async createBackup(identifier: string, name?: string): Promise<BackupAttributes> {
    return clientApi.createBackup(this.doRequestFn, this.requireClientKey(), identifier, name);
  }

  async listSchedules(identifier: string): Promise<{ schedules: Record<string, unknown>[] }> {
    return clientApi.listSchedules(this.doRequestFn, this.requireClientKey(), identifier);
  }

  async createSchedule(
    identifier: string,
    data: {
      name: string;
      cron_minute: string;
      cron_hour: string;
      cron_day_of_week: string;
      cron_day_of_month: string;
      cron_month: string;
      is_active?: boolean;
    },
  ): Promise<Record<string, unknown>> {
    return clientApi.createSchedule(this.doRequestFn, this.requireClientKey(), identifier, data);
  }

  async listClientDatabases(identifier: string): Promise<{ databases: Record<string, unknown>[] }> {
    return clientApi.listClientDatabases(this.doRequestFn, this.requireClientKey(), identifier);
  }

  async createClientDatabase(
    identifier: string,
    data: { database: string; remote: string },
  ): Promise<Record<string, unknown>> {
    return clientApi.createClientDatabase(
      this.doRequestFn,
      this.requireClientKey(),
      identifier,
      data,
    );
  }

  async listSubusers(identifier: string): Promise<{ users: Record<string, unknown>[] }> {
    return clientApi.listSubusers(this.doRequestFn, this.requireClientKey(), identifier);
  }

  async getStartupVariables(identifier: string): Promise<{
    variables: Record<string, unknown>[];
    startup_command: string;
    docker_images: Record<string, string>;
  }> {
    return clientApi.getStartupVariables(this.doRequestFn, this.requireClientKey(), identifier);
  }

  async getAccount(): Promise<Record<string, unknown>> {
    return clientApi.getAccount(this.doRequestFn, this.requireClientKey());
  }

  async killServer(identifier: string): Promise<void> {
    await this.sendPowerAction(identifier, "kill");
  }

  async getSchedule(identifier: string, scheduleId: number): Promise<Record<string, unknown>> {
    return clientApi.getSchedule(this.doRequestFn, this.requireClientKey(), identifier, scheduleId);
  }

  async updateSchedule(
    identifier: string,
    scheduleId: number,
    data: {
      name: string;
      cron_minute: string;
      cron_hour: string;
      cron_day_of_week: string;
      cron_day_of_month: string;
      cron_month: string;
      is_active?: boolean;
      only_when_online?: boolean;
    },
  ): Promise<Record<string, unknown>> {
    return clientApi.updateSchedule(
      this.doRequestFn,
      this.requireClientKey(),
      identifier,
      scheduleId,
      data,
    );
  }

  async deleteSchedule(identifier: string, scheduleId: number): Promise<void> {
    return clientApi.deleteSchedule(
      this.doRequestFn,
      this.requireClientKey(),
      identifier,
      scheduleId,
    );
  }

  async createScheduleTask(
    identifier: string,
    scheduleId: number,
    data: {
      action: "command" | "power" | "backup";
      payload: string;
      time_offset: number;
      continue_on_failure?: boolean;
    },
  ): Promise<Record<string, unknown>> {
    return clientApi.createScheduleTask(
      this.doRequestFn,
      this.requireClientKey(),
      identifier,
      scheduleId,
      data,
    );
  }

  async deleteScheduleTask(identifier: string, scheduleId: number, taskId: number): Promise<void> {
    return clientApi.deleteScheduleTask(
      this.doRequestFn,
      this.requireClientKey(),
      identifier,
      scheduleId,
      taskId,
    );
  }

  async createSubuser(
    identifier: string,
    data: { email: string; permissions: string[] },
  ): Promise<Record<string, unknown>> {
    return clientApi.createSubuser(this.doRequestFn, this.requireClientKey(), identifier, data);
  }

  async updateSubuser(
    identifier: string,
    userUuid: string,
    data: { permissions: string[] },
  ): Promise<Record<string, unknown>> {
    return clientApi.updateSubuser(
      this.doRequestFn,
      this.requireClientKey(),
      identifier,
      userUuid,
      data,
    );
  }

  async deleteSubuser(identifier: string, userUuid: string): Promise<void> {
    return clientApi.deleteSubuser(this.doRequestFn, this.requireClientKey(), identifier, userUuid);
  }

  async deleteClientDatabase(identifier: string, databaseId: string): Promise<void> {
    return clientApi.deleteClientDatabase(
      this.doRequestFn,
      this.requireClientKey(),
      identifier,
      databaseId,
    );
  }

  async rotateDatabasePassword(
    identifier: string,
    databaseId: string,
  ): Promise<Record<string, unknown>> {
    return clientApi.rotateDatabasePassword(
      this.doRequestFn,
      this.requireClientKey(),
      identifier,
      databaseId,
    );
  }

  async deleteBackup(identifier: string, backupUuid: string): Promise<void> {
    return clientApi.deleteBackup(
      this.doRequestFn,
      this.requireClientKey(),
      identifier,
      backupUuid,
    );
  }

  async downloadBackup(identifier: string, backupUuid: string): Promise<{ url: string }> {
    return clientApi.downloadBackup(
      this.doRequestFn,
      this.requireClientKey(),
      identifier,
      backupUuid,
    );
  }

  async restoreBackup(identifier: string, backupUuid: string, truncate?: boolean): Promise<void> {
    return clientApi.restoreBackup(
      this.doRequestFn,
      this.requireClientKey(),
      identifier,
      backupUuid,
      truncate,
    );
  }

  async downloadFile(identifier: string, filePath: string): Promise<{ url: string }> {
    return clientApi.downloadFile(this.doRequestFn, this.requireClientKey(), identifier, filePath);
  }

  async getServerActivity(
    identifier: string,
    params?: ListParams,
  ): Promise<{ activities: ActivityLogEntry[]; pagination: PteroPagination }> {
    return clientApi.getServerActivity(
      this.doRequestFn,
      this.requireClientKey(),
      identifier,
      params,
    );
  }

  // ─── Private Methods ─────────────────────────────────────────────────────

  private requireClientKey(): string {
    if (!this.clientKey) {
      throw new PterodactylApiError(
        0,
        "CLIENT_KEY_REQUIRED",
        "This action requires a Client API key. Add PTERODACTYL_CLIENT_KEY to your configuration.",
      );
    }
    return this.clientKey;
  }

  /** Bound callback for Application API requests. */
  private appRequestFn: appApi.AppRequestFn = <T>(
    method: string,
    path: string,
    body?: unknown,
    options?: DoRequestOptions,
  ): Promise<T> => {
    return this.doRequest<T>(method, path, this.appKey, body, "application/json", options);
  };

  /** Bound callback for Client API requests. */
  private doRequestFn: clientApi.ClientRequestFn = <T>(
    method: string,
    path: string,
    apiKey: string,
    body?: unknown,
    contentType?: string,
    options?: DoRequestOptions,
  ): Promise<T> => {
    return this.doRequest<T>(method, path, apiKey, body, contentType, options);
  };

  private validateUrl(allowInsecure: boolean): void {
    let parsed: URL;
    try {
      parsed = new URL(this.baseUrl);
    } catch {
      throw new PterodactylApiError(0, "INVALID_URL", "The panel URL is not a valid URL.");
    }

    const isLocalhost = parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1";

    if (parsed.protocol !== "https:" && !allowInsecure && !isLocalhost) {
      throw new PterodactylApiError(
        0,
        "INSECURE_URL",
        "The panel URL must use HTTPS. Set allowInsecure to true for HTTP.",
      );
    }
  }

  private isRetryableNetworkError(error: unknown): boolean {
    if (error instanceof TypeError) {
      return true;
    }
    if (error instanceof Error && "code" in error) {
      const code = (error as Error & { code: string }).code;
      return RETRYABLE_NETWORK_CODES.has(code);
    }
    return false;
  }

  private async doRequest<T>(
    method: string,
    path: string,
    apiKey: string,
    body?: unknown,
    contentType: string = "application/json",
    options?: DoRequestOptions,
  ): Promise<T> {
    try {
      this.circuitBreaker.allowRequest();
    } catch (error: unknown) {
      if (error instanceof CircuitOpenError) {
        throw new PterodactylApiError(
          503,
          "CIRCUIT_OPEN",
          `Panel API is unavailable. ${error.message}`,
        );
      }
      throw error;
    }

    await this.rateLimiter.acquire();

    const url = `${this.baseUrl}${path}`;
    const headers: Record<string, string> = {
      Authorization: `Bearer ${apiKey}`,
      Accept: "application/json",
    };

    const hasBody = body !== undefined;
    if (hasBody) {
      headers["Content-Type"] = contentType;
    }

    const serializedBody = hasBody
      ? contentType === "application/json"
        ? JSON.stringify(body)
        : String(body)
      : undefined;

    const isIdempotent = options?.idempotent ?? IDEMPOTENT_METHODS.has(method.toUpperCase());

    let lastError: PterodactylApiError | undefined;
    let retryAfterMs: number | undefined;

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      if (attempt > 0) {
        if (!isIdempotent) {
          break;
        }

        let delay: number;
        if (retryAfterMs !== undefined) {
          delay = Math.min(retryAfterMs, MAX_RETRY_DELAY_MS);
          retryAfterMs = undefined;
        } else {
          const jitter = Math.random() * 0.5 + 0.75;
          delay = Math.min(RETRY_BASE_DELAY_MS * 2 ** (attempt - 1) * jitter, MAX_RETRY_DELAY_MS);
        }

        await sleep(delay);
      }

      try {
        const response = await fetch(url, {
          method,
          headers,
          body: serializedBody,
          signal: AbortSignal.timeout(this.timeout),
        });

        if (response.ok) {
          this.circuitBreaker.recordSuccess();
          if (response.status === 204) {
            return undefined as T;
          }
          const responseContentType = response.headers?.get?.("Content-Type") ?? "";
          if (!responseContentType || responseContentType.includes("application/json")) {
            return (await response.json()) as T;
          }
          return (await response.text()) as T;
        }

        const apiError = mapHttpError(response.status);

        if (RETRYABLE_STATUS_CODES.has(response.status)) {
          this.circuitBreaker.recordFailure();
          lastError = apiError;

          if (response.status === 429) {
            retryAfterMs = parseRetryAfter(response.headers.get("Retry-After"));
          }

          continue;
        }

        this.circuitBreaker.recordSuccess();
        throw apiError;
      } catch (error: unknown) {
        if (error instanceof PterodactylApiError) {
          throw error;
        }

        if (error instanceof DOMException && error.name === "TimeoutError") {
          this.circuitBreaker.recordFailure();
          lastError = new PterodactylApiError(
            0,
            "TIMEOUT",
            `Request to panel API timed out after ${this.timeout}ms.`,
          );
          continue;
        }

        if (this.isRetryableNetworkError(error)) {
          this.circuitBreaker.recordFailure();
          lastError = new PterodactylApiError(
            0,
            "NETWORK_ERROR",
            "Failed to connect to panel API. Check that the panel URL is correct and reachable.",
          );
          continue;
        }

        throw new PterodactylApiError(
          0,
          "NETWORK_ERROR",
          "Failed to connect to panel API. Check that the panel URL is correct and reachable.",
        );
      }
    }

    throw (
      lastError ?? new PterodactylApiError(0, "API_ERROR", "Request failed after multiple retries.")
    );
  }
}

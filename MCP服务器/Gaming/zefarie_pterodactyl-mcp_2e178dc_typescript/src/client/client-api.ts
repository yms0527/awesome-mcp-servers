import { assertShape, buildListPath, extractPagination } from "./app-api.js";
import type {
  ActivityLogEntry,
  BackupAttributes,
  FileAttributes,
  ListParams,
  PowerAction,
  PteroList,
  PteroObject,
  PteroPagination,
  ServerResources,
  StartupData,
} from "./types.js";

/** Callback type for Client API requests (includes apiKey, contentType). */
export type ClientRequestFn = <T>(
  method: string,
  path: string,
  apiKey: string,
  body?: unknown,
  contentType?: string,
  options?: { idempotent?: boolean },
) => Promise<T>;

// ─── Client API Methods ──────────────────────────────────────────────────────

export async function getServerResources(
  request: ClientRequestFn,
  clientKey: string,
  identifier: string,
): Promise<ServerResources> {
  const response = await request<PteroObject<ServerResources>>(
    "GET",
    `/api/client/servers/${identifier}/resources`,
    clientKey,
  );
  const validated = assertShape<PteroObject<ServerResources>>(response, ["attributes"]);
  return validated.attributes;
}

export async function sendPowerAction(
  request: ClientRequestFn,
  clientKey: string,
  identifier: string,
  action: PowerAction,
): Promise<void> {
  await request<void>(
    "POST",
    `/api/client/servers/${identifier}/power`,
    clientKey,
    { signal: action },
    "application/json",
    { idempotent: true },
  );
}

export async function sendCommand(
  request: ClientRequestFn,
  clientKey: string,
  identifier: string,
  command: string,
): Promise<void> {
  await request<void>("POST", `/api/client/servers/${identifier}/command`, clientKey, {
    command,
  });
}

export async function listFiles(
  request: ClientRequestFn,
  clientKey: string,
  identifier: string,
  directory?: string,
): Promise<FileAttributes[]> {
  const dir = directory ?? "/";
  const encoded = encodeURIComponent(dir);
  const response = await request<PteroList<FileAttributes>>(
    "GET",
    `/api/client/servers/${identifier}/files/list?directory=${encoded}`,
    clientKey,
  );
  return response.data.map((item) => item.attributes);
}

export async function listBackups(
  request: ClientRequestFn,
  clientKey: string,
  identifier: string,
): Promise<BackupAttributes[]> {
  const response = await request<PteroList<BackupAttributes>>(
    "GET",
    `/api/client/servers/${identifier}/backups`,
    clientKey,
  );
  return response.data.map((item) => item.attributes);
}

export async function readFile(
  request: ClientRequestFn,
  clientKey: string,
  identifier: string,
  filePath: string,
): Promise<string> {
  return request<string>(
    "GET",
    `/api/client/servers/${encodeURIComponent(identifier)}/files/contents?file=${encodeURIComponent(filePath)}`,
    clientKey,
  );
}

export async function writeFile(
  request: ClientRequestFn,
  clientKey: string,
  identifier: string,
  filePath: string,
  content: string,
): Promise<void> {
  await request<void>(
    "POST",
    `/api/client/servers/${encodeURIComponent(identifier)}/files/write?file=${encodeURIComponent(filePath)}`,
    clientKey,
    content,
    "text/plain",
  );
}

export async function createFolder(
  request: ClientRequestFn,
  clientKey: string,
  identifier: string,
  root: string,
  name: string,
): Promise<void> {
  await request<void>(
    "POST",
    `/api/client/servers/${encodeURIComponent(identifier)}/files/create-folder`,
    clientKey,
    { root, name },
  );
}

export async function deleteFiles(
  request: ClientRequestFn,
  clientKey: string,
  identifier: string,
  root: string,
  files: string[],
): Promise<void> {
  await request<void>(
    "POST",
    `/api/client/servers/${encodeURIComponent(identifier)}/files/delete`,
    clientKey,
    { root, files },
    "application/json",
    { idempotent: true },
  );
}

export async function compressFiles(
  request: ClientRequestFn,
  clientKey: string,
  identifier: string,
  root: string,
  files: string[],
): Promise<Record<string, unknown>> {
  return request<Record<string, unknown>>(
    "POST",
    `/api/client/servers/${encodeURIComponent(identifier)}/files/compress`,
    clientKey,
    { root, files },
  );
}

export async function decompressFile(
  request: ClientRequestFn,
  clientKey: string,
  identifier: string,
  root: string,
  file: string,
): Promise<void> {
  await request<void>(
    "POST",
    `/api/client/servers/${encodeURIComponent(identifier)}/files/decompress`,
    clientKey,
    { root, file },
  );
}

export async function renameFile(
  request: ClientRequestFn,
  clientKey: string,
  identifier: string,
  root: string,
  from: string,
  to: string,
): Promise<void> {
  await request<void>(
    "PUT",
    `/api/client/servers/${encodeURIComponent(identifier)}/files/rename`,
    clientKey,
    { root, files: [{ from, to }] },
  );
}

export async function createBackup(
  request: ClientRequestFn,
  clientKey: string,
  identifier: string,
  name?: string,
): Promise<BackupAttributes> {
  const body = name !== undefined ? { name } : {};
  const res = await request<PteroObject<BackupAttributes>>(
    "POST",
    `/api/client/servers/${encodeURIComponent(identifier)}/backups`,
    clientKey,
    body,
  );
  return res.attributes;
}

export async function listSchedules(
  request: ClientRequestFn,
  clientKey: string,
  identifier: string,
): Promise<{ schedules: Record<string, unknown>[] }> {
  const res = await request<PteroList<Record<string, unknown>>>(
    "GET",
    `/api/client/servers/${encodeURIComponent(identifier)}/schedules`,
    clientKey,
  );
  return { schedules: res.data.map((i) => i.attributes) };
}

export async function createSchedule(
  request: ClientRequestFn,
  clientKey: string,
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
  // Send both Pelican (minute/hour/...) and Pterodactyl (cron_minute/cron_hour/...) field names.
  // Each API ignores unknown fields so this is safe for both panels.
  const body = {
    ...data,
    minute: data.cron_minute,
    hour: data.cron_hour,
    day_of_week: data.cron_day_of_week,
    day_of_month: data.cron_day_of_month,
    month: data.cron_month,
  };
  const res = await request<PteroObject<Record<string, unknown>>>(
    "POST",
    `/api/client/servers/${encodeURIComponent(identifier)}/schedules`,
    clientKey,
    body,
  );
  return res.attributes;
}

export async function listClientDatabases(
  request: ClientRequestFn,
  clientKey: string,
  identifier: string,
): Promise<{ databases: Record<string, unknown>[] }> {
  const res = await request<PteroList<Record<string, unknown>>>(
    "GET",
    `/api/client/servers/${encodeURIComponent(identifier)}/databases`,
    clientKey,
  );
  return { databases: res.data.map((i) => i.attributes) };
}

export async function createClientDatabase(
  request: ClientRequestFn,
  clientKey: string,
  identifier: string,
  data: { database: string; remote: string },
): Promise<Record<string, unknown>> {
  const res = await request<PteroObject<Record<string, unknown>>>(
    "POST",
    `/api/client/servers/${encodeURIComponent(identifier)}/databases`,
    clientKey,
    data,
  );
  return res.attributes;
}

export async function listSubusers(
  request: ClientRequestFn,
  clientKey: string,
  identifier: string,
): Promise<{ users: Record<string, unknown>[] }> {
  const res = await request<PteroList<Record<string, unknown>>>(
    "GET",
    `/api/client/servers/${encodeURIComponent(identifier)}/users`,
    clientKey,
  );
  return { users: res.data.map((i) => i.attributes) };
}

export async function getStartupVariables(
  request: ClientRequestFn,
  clientKey: string,
  identifier: string,
): Promise<{
  variables: Record<string, unknown>[];
  startup_command: string;
  docker_images: Record<string, string>;
}> {
  const res = await request<StartupData>(
    "GET",
    `/api/client/servers/${encodeURIComponent(identifier)}/startup`,
    clientKey,
  );
  return {
    variables: res.data.map((i) => i.attributes),
    startup_command: res.meta.startup_command,
    docker_images: res.meta.docker_images,
  };
}

export async function getAccount(
  request: ClientRequestFn,
  clientKey: string,
): Promise<Record<string, unknown>> {
  const res = await request<PteroObject<Record<string, unknown>>>(
    "GET",
    "/api/client/account",
    clientKey,
  );
  return res.attributes;
}

// ─── Schedule Methods ───────────────────────────────────────────────────────

export async function getSchedule(
  request: ClientRequestFn,
  clientKey: string,
  identifier: string,
  scheduleId: number,
): Promise<Record<string, unknown>> {
  const res = await request<PteroObject<Record<string, unknown>>>(
    "GET",
    `/api/client/servers/${encodeURIComponent(identifier)}/schedules/${scheduleId}`,
    clientKey,
  );
  return res.attributes;
}

export async function updateSchedule(
  request: ClientRequestFn,
  clientKey: string,
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
  // Send both Pelican (minute/hour/...) and Pterodactyl (cron_minute/cron_hour/...) field names.
  const body = {
    ...data,
    minute: data.cron_minute,
    hour: data.cron_hour,
    day_of_week: data.cron_day_of_week,
    day_of_month: data.cron_day_of_month,
    month: data.cron_month,
  };
  const res = await request<PteroObject<Record<string, unknown>>>(
    "POST",
    `/api/client/servers/${encodeURIComponent(identifier)}/schedules/${scheduleId}`,
    clientKey,
    body,
  );
  return res.attributes;
}

export async function deleteSchedule(
  request: ClientRequestFn,
  clientKey: string,
  identifier: string,
  scheduleId: number,
): Promise<void> {
  await request<void>(
    "DELETE",
    `/api/client/servers/${encodeURIComponent(identifier)}/schedules/${scheduleId}`,
    clientKey,
  );
}

// ─── Schedule Task Methods ──────────────────────────────────────────────────

export async function createScheduleTask(
  request: ClientRequestFn,
  clientKey: string,
  identifier: string,
  scheduleId: number,
  data: {
    action: "command" | "power" | "backup";
    payload: string;
    time_offset: number;
    continue_on_failure?: boolean;
  },
): Promise<Record<string, unknown>> {
  const res = await request<PteroObject<Record<string, unknown>>>(
    "POST",
    `/api/client/servers/${encodeURIComponent(identifier)}/schedules/${scheduleId}/tasks`,
    clientKey,
    data,
  );
  return res.attributes;
}

export async function deleteScheduleTask(
  request: ClientRequestFn,
  clientKey: string,
  identifier: string,
  scheduleId: number,
  taskId: number,
): Promise<void> {
  await request<void>(
    "DELETE",
    `/api/client/servers/${encodeURIComponent(identifier)}/schedules/${scheduleId}/tasks/${taskId}`,
    clientKey,
  );
}

// ─── Sub-user Methods ───────────────────────────────────────────────────────

export async function createSubuser(
  request: ClientRequestFn,
  clientKey: string,
  identifier: string,
  data: { email: string; permissions: string[] },
): Promise<Record<string, unknown>> {
  const res = await request<PteroObject<Record<string, unknown>>>(
    "POST",
    `/api/client/servers/${encodeURIComponent(identifier)}/users`,
    clientKey,
    data,
  );
  return res.attributes;
}

export async function updateSubuser(
  request: ClientRequestFn,
  clientKey: string,
  identifier: string,
  userUuid: string,
  data: { permissions: string[] },
): Promise<Record<string, unknown>> {
  const res = await request<PteroObject<Record<string, unknown>>>(
    "POST",
    `/api/client/servers/${encodeURIComponent(identifier)}/users/${encodeURIComponent(userUuid)}`,
    clientKey,
    data,
  );
  return res.attributes;
}

export async function deleteSubuser(
  request: ClientRequestFn,
  clientKey: string,
  identifier: string,
  userUuid: string,
): Promise<void> {
  await request<void>(
    "DELETE",
    `/api/client/servers/${encodeURIComponent(identifier)}/users/${encodeURIComponent(userUuid)}`,
    clientKey,
  );
}

// ─── Database Methods ───────────────────────────────────────────────────────

export async function deleteClientDatabase(
  request: ClientRequestFn,
  clientKey: string,
  identifier: string,
  databaseId: string,
): Promise<void> {
  await request<void>(
    "DELETE",
    `/api/client/servers/${encodeURIComponent(identifier)}/databases/${encodeURIComponent(databaseId)}`,
    clientKey,
  );
}

export async function rotateDatabasePassword(
  request: ClientRequestFn,
  clientKey: string,
  identifier: string,
  databaseId: string,
): Promise<Record<string, unknown>> {
  const res = await request<PteroObject<Record<string, unknown>>>(
    "POST",
    `/api/client/servers/${encodeURIComponent(identifier)}/databases/${encodeURIComponent(databaseId)}/rotate-password`,
    clientKey,
  );
  return res.attributes;
}

// ─── Backup Methods ─────────────────────────────────────────────────────────

export async function deleteBackup(
  request: ClientRequestFn,
  clientKey: string,
  identifier: string,
  backupUuid: string,
): Promise<void> {
  await request<void>(
    "DELETE",
    `/api/client/servers/${encodeURIComponent(identifier)}/backups/${encodeURIComponent(backupUuid)}`,
    clientKey,
  );
}

export async function downloadBackup(
  request: ClientRequestFn,
  clientKey: string,
  identifier: string,
  backupUuid: string,
): Promise<{ url: string }> {
  const res = await request<{ attributes: { url: string } }>(
    "GET",
    `/api/client/servers/${encodeURIComponent(identifier)}/backups/${encodeURIComponent(backupUuid)}/download`,
    clientKey,
  );
  return { url: res.attributes.url };
}

export async function restoreBackup(
  request: ClientRequestFn,
  clientKey: string,
  identifier: string,
  backupUuid: string,
  truncate?: boolean,
): Promise<void> {
  await request<void>(
    "POST",
    `/api/client/servers/${encodeURIComponent(identifier)}/backups/${encodeURIComponent(backupUuid)}/restore`,
    clientKey,
    { truncate: truncate ?? false },
  );
}

// ─── File Download Method ───────────────────────────────────────────────────

export async function downloadFile(
  request: ClientRequestFn,
  clientKey: string,
  identifier: string,
  filePath: string,
): Promise<{ url: string }> {
  const res = await request<{ attributes: { url: string } }>(
    "GET",
    `/api/client/servers/${encodeURIComponent(identifier)}/files/download?file=${encodeURIComponent(filePath)}`,
    clientKey,
  );
  return { url: res.attributes.url };
}

// ─── Activity Log Methods ──────────────────────────────────────────────────

export async function getServerActivity(
  request: ClientRequestFn,
  clientKey: string,
  identifier: string,
  params?: ListParams,
): Promise<{ activities: ActivityLogEntry[]; pagination: PteroPagination }> {
  const path = buildListPath(
    `/api/client/servers/${encodeURIComponent(identifier)}/activity`,
    params,
  );
  const res = await request<PteroList<ActivityLogEntry>>("GET", path, clientKey);
  return {
    activities: res.data.map((i) => i.attributes),
    pagination: extractPagination(res),
  };
}

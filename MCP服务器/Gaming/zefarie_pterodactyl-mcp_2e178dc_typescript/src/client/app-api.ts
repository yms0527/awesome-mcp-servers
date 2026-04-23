import { PterodactylApiError } from "./errors.js";
import type {
  AllocationAttributes,
  EggAttributes,
  EggVariableAttributes,
  ListParams,
  MountAttributes,
  NestAttributes,
  NodeAttributes,
  PteroList,
  PteroObject,
  PteroPagination,
  RoleAttributes,
  ServerAttributes,
  UserAttributes,
} from "./types.js";

export interface ListServersResult {
  servers: ServerAttributes[];
  pagination: PteroPagination;
}

export interface ListUsersResult {
  users: UserAttributes[];
  pagination: PteroPagination;
}

export interface ListNodesResult {
  nodes: NodeAttributes[];
  pagination: PteroPagination;
}

export interface ListNestsResult {
  nests: NestAttributes[];
  pagination: PteroPagination;
}

/** Callback type for Application API requests. */
export type AppRequestFn = <T>(
  method: string,
  path: string,
  body?: unknown,
  options?: { idempotent?: boolean },
) => Promise<T>;

/**
 * Build a URL path with optional pagination query parameters.
 */
export function buildListPath(basePath: string, params?: ListParams): string {
  const searchParams = new URLSearchParams();
  if (params?.page) {
    searchParams.set("page", String(params.page));
  }
  if (params?.per_page) {
    searchParams.set("per_page", String(params.per_page));
  }

  const query = searchParams.toString();
  return query ? `${basePath}?${query}` : basePath;
}

/**
 * Assert that an unknown value has the expected shape by checking for required top-level fields.
 * Throws PterodactylApiError if any field is missing.
 */
export function assertShape<T>(data: unknown, requiredFields: string[]): T {
  if (data === null || data === undefined || typeof data !== "object") {
    throw new PterodactylApiError(
      0,
      "INVALID_RESPONSE",
      `Expected an object from the API but received ${typeof data}.`,
    );
  }

  const record = data as Record<string, unknown>;
  const missing = requiredFields.filter((field) => !(field in record));
  if (missing.length > 0) {
    throw new PterodactylApiError(
      0,
      "INVALID_RESPONSE",
      `API response is missing required fields: ${missing.join(", ")}.`,
    );
  }

  return data as T;
}

/**
 * Extract pagination from a Pelican/Pterodactyl list response.
 * Pelican may omit `meta` or `meta.pagination` entirely - this builds a synthetic fallback.
 */
export function extractPagination<T>(res: PteroList<T>): PteroPagination {
  if (res.meta?.pagination) {
    return res.meta.pagination;
  }
  const count = res.data.length;
  return {
    total: count,
    count,
    per_page: count,
    current_page: 1,
    total_pages: 1,
    links: {},
  };
}

// ─── Application API Methods ─────────────────────────────────────────────────

export async function listServers(
  request: AppRequestFn,
  params?: ListParams,
): Promise<ListServersResult> {
  const path = buildListPath("/api/application/servers", params);
  const response = await request<PteroList<ServerAttributes>>("GET", path);
  const validated = assertShape<PteroList<ServerAttributes>>(response, ["data"]);

  return {
    servers: validated.data.map((item) => item.attributes),
    pagination: extractPagination(validated),
  };
}

export async function getServer(request: AppRequestFn, id: number): Promise<ServerAttributes> {
  const response = await request<PteroObject<ServerAttributes>>(
    "GET",
    `/api/application/servers/${id}`,
  );
  const validated = assertShape<PteroObject<ServerAttributes>>(response, ["attributes"]);
  return validated.attributes;
}

export async function suspendServer(request: AppRequestFn, id: number): Promise<void> {
  await request<void>("POST", `/api/application/servers/${id}/suspend`, undefined, {
    idempotent: true,
  });
}

export async function unsuspendServer(request: AppRequestFn, id: number): Promise<void> {
  await request<void>("POST", `/api/application/servers/${id}/unsuspend`, undefined, {
    idempotent: true,
  });
}

export async function listUsers(
  request: AppRequestFn,
  params?: ListParams,
): Promise<ListUsersResult> {
  const path = buildListPath("/api/application/users", params);
  const response = await request<PteroList<UserAttributes>>("GET", path);
  const validated = assertShape<PteroList<UserAttributes>>(response, ["data"]);

  return {
    users: validated.data.map((item) => item.attributes),
    pagination: extractPagination(validated),
  };
}

export async function listNodes(
  request: AppRequestFn,
  params?: ListParams,
): Promise<ListNodesResult> {
  const path = buildListPath("/api/application/nodes", params);
  const response = await request<PteroList<NodeAttributes>>("GET", path);
  const validated = assertShape<PteroList<NodeAttributes>>(response, ["data"]);

  return {
    nodes: validated.data.map((item) => item.attributes),
    pagination: extractPagination(validated),
  };
}

export async function reinstallServer(request: AppRequestFn, id: number): Promise<void> {
  await request<void>("POST", `/api/application/servers/${id}/reinstall`);
}

export async function createServer(
  request: AppRequestFn,
  data: Record<string, unknown>,
): Promise<ServerAttributes> {
  const res = await request<PteroObject<ServerAttributes>>(
    "POST",
    "/api/application/servers",
    data,
  );
  return res.attributes;
}

export async function deleteServer(request: AppRequestFn, id: number): Promise<void> {
  await request<void>("DELETE", `/api/application/servers/${id}`);
}

export async function updateServerDetails(
  request: AppRequestFn,
  id: number,
  data: {
    name?: string;
    description?: string;
    user?: number;
    external_id?: string;
  },
): Promise<ServerAttributes> {
  const res = await request<PteroObject<ServerAttributes>>(
    "PATCH",
    `/api/application/servers/${id}/details`,
    data,
  );
  return res.attributes;
}

export async function updateServerBuild(
  request: AppRequestFn,
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
  const res = await request<PteroObject<ServerAttributes>>(
    "PATCH",
    `/api/application/servers/${id}/build`,
    data,
  );
  return res.attributes;
}

export async function updateServerStartup(
  request: AppRequestFn,
  id: number,
  data: {
    startup?: string;
    image?: string;
    egg?: number;
    environment?: Record<string, string>;
    skip_scripts?: boolean;
  },
): Promise<ServerAttributes> {
  // Pelican requires `skip_scripts` - default to false if not provided
  const body = { skip_scripts: false, ...data };
  const res = await request<PteroObject<ServerAttributes>>(
    "PATCH",
    `/api/application/servers/${id}/startup`,
    body,
  );
  return res.attributes;
}

export async function getUser(request: AppRequestFn, id: number): Promise<UserAttributes> {
  const res = await request<PteroObject<UserAttributes>>("GET", `/api/application/users/${id}`);
  return res.attributes;
}

export async function createUser(
  request: AppRequestFn,
  data: {
    username: string;
    email: string;
    password: string;
    root_admin?: boolean;
  },
): Promise<UserAttributes> {
  const res = await request<PteroObject<UserAttributes>>("POST", "/api/application/users", data);
  return res.attributes;
}

export async function updateUser(
  request: AppRequestFn,
  id: number,
  data: {
    username?: string;
    email?: string;
    password?: string;
    root_admin?: boolean;
  },
): Promise<UserAttributes> {
  const res = await request<PteroObject<UserAttributes>>(
    "PATCH",
    `/api/application/users/${id}`,
    data,
  );
  return res.attributes;
}

export async function deleteUser(request: AppRequestFn, id: number): Promise<void> {
  await request<void>("DELETE", `/api/application/users/${id}`);
}

export async function getNode(request: AppRequestFn, id: number): Promise<NodeAttributes> {
  const res = await request<PteroObject<NodeAttributes>>("GET", `/api/application/nodes/${id}`);
  return res.attributes;
}

export async function getNodeConfiguration(
  request: AppRequestFn,
  id: number,
): Promise<Record<string, unknown>> {
  return request<Record<string, unknown>>("GET", `/api/application/nodes/${id}/configuration`);
}

export async function listEggs(
  request: AppRequestFn,
): Promise<{ eggs: EggAttributes[]; pagination: PteroPagination }> {
  const res = await request<PteroList<EggAttributes>>("GET", "/api/application/eggs");
  return { eggs: res.data.map((i) => i.attributes), pagination: extractPagination(res) };
}

export async function listRoles(
  request: AppRequestFn,
): Promise<{ roles: RoleAttributes[]; pagination: PteroPagination }> {
  const res = await request<PteroList<RoleAttributes>>("GET", "/api/application/roles");
  return { roles: res.data.map((i) => i.attributes), pagination: extractPagination(res) };
}

export async function listMounts(
  request: AppRequestFn,
): Promise<{ mounts: MountAttributes[]; pagination: PteroPagination }> {
  const res = await request<PteroList<MountAttributes>>("GET", "/api/application/mounts");
  return { mounts: res.data.map((i) => i.attributes), pagination: extractPagination(res) };
}

export async function listServerDatabases(
  request: AppRequestFn,
  id: number,
): Promise<{ databases: Record<string, unknown>[]; pagination: PteroPagination }> {
  const res = await request<PteroList<Record<string, unknown>>>(
    "GET",
    `/api/application/servers/${id}/databases`,
  );
  return { databases: res.data.map((i) => i.attributes), pagination: extractPagination(res) };
}

export async function listNests(request: AppRequestFn): Promise<ListNestsResult> {
  try {
    const res = await request<PteroList<NestAttributes>>("GET", "/api/application/nests");
    const validated = assertShape<PteroList<NestAttributes>>(res, ["data"]);
    return {
      nests: validated.data.map((item) => item.attributes),
      pagination: extractPagination(validated),
    };
  } catch {
    // Pelican doesn't have nests - return a synthetic nest from /api/application/eggs
    return {
      nests: [
        {
          id: 0,
          uuid: "",
          author: "",
          name: "Default",
          description:
            "Pelican panel - nests are not used. Use list_eggs with nest_id=0 to list all eggs.",
          created_at: "",
          updated_at: "",
        },
      ],
      pagination: { total: 1, count: 1, per_page: 50, current_page: 1, total_pages: 1, links: {} },
    };
  }
}

/**
 * Builds the egg endpoint path. Tries Pelican-style `/eggs/{id}` first,
 * falls back to Pterodactyl-style `/nests/{nestId}/eggs/{eggId}`.
 */
function eggPath(nestId: number, eggId?: number): string {
  if (nestId === 0) {
    // Pelican mode - eggs are top-level
    return eggId !== undefined ? `/api/application/eggs/${eggId}` : "/api/application/eggs";
  }
  return eggId !== undefined
    ? `/api/application/nests/${nestId}/eggs/${eggId}`
    : `/api/application/nests/${nestId}/eggs`;
}

export async function getEgg(
  request: AppRequestFn,
  nestId: number,
  eggId: number,
): Promise<EggAttributes> {
  // Try Pelican-style first (no nest), fallback to Pterodactyl
  try {
    const res = await request<PteroObject<EggAttributes>>(
      "GET",
      `/api/application/eggs/${eggId}?include=variables`,
    );
    const validated = assertShape<PteroObject<EggAttributes>>(res, ["attributes"]);
    return validated.attributes;
  } catch {
    const res = await request<PteroObject<EggAttributes>>(
      "GET",
      `/api/application/nests/${nestId}/eggs/${eggId}?include=variables`,
    );
    const validated = assertShape<PteroObject<EggAttributes>>(res, ["attributes"]);
    return validated.attributes;
  }
}

export async function importEgg(
  request: AppRequestFn,
  nestId: number,
  eggData: Record<string, unknown>,
): Promise<EggAttributes> {
  // Try Pelican-style first: POST /api/application/eggs/import with full egg export format
  try {
    const pelicanBody = buildPelicanEggImportBody(eggData);
    const res = await request<PteroObject<EggAttributes>>(
      "POST",
      "/api/application/eggs/import",
      pelicanBody,
    );
    return res.attributes;
  } catch {
    // Fallback to Pterodactyl-style: POST /api/application/nests/{nestId}/eggs
    const res = await request<PteroObject<EggAttributes>>("POST", eggPath(nestId), eggData);
    return res.attributes;
  }
}

/**
 * Converts tool-style egg data into the Pelican egg import format.
 * If the data already has `meta` and `config` (i.e. it is already in export format),
 * it is returned as-is. Otherwise the flat tool fields are mapped into the export shape.
 */
function buildPelicanEggImportBody(data: Record<string, unknown>): Record<string, unknown> {
  // If the caller already passed export-format data, return it directly
  if (data.meta !== undefined && data.config !== undefined) {
    return data;
  }

  return {
    meta: { version: "PTDL_v2", update_url: null },
    name: data.name ?? "Imported Egg",
    author: data.author ?? "unknown@example.com",
    description: data.description ?? null,
    features: data.features ?? [],
    docker_images:
      data.docker_images ??
      (data.docker_image ? { default: data.docker_image as string } : { default: "alpine:latest" }),
    file_denylist: data.file_denylist ?? [],
    startup: data.startup ?? "",
    config: {
      files: data.config_files ?? {},
      startup: data.config_startup ?? { done: "started" },
      stop: data.config_stop ?? "stop",
      logs: data.config_logs ?? [],
    },
    scripts: {
      installation: {
        script: data.script_install ?? "#!/bin/bash\necho installed",
        container: data.script_container ?? "alpine:3.4",
        entrypoint: data.script_entry ?? "bash",
      },
    },
    variables: data.variables ?? [],
  };
}

export async function updateEgg(
  request: AppRequestFn,
  nestId: number,
  eggId: number,
  eggData: Record<string, unknown>,
): Promise<EggAttributes> {
  try {
    const res = await request<PteroObject<EggAttributes>>(
      "PATCH",
      `/api/application/eggs/${eggId}`,
      eggData,
    );
    return res.attributes;
  } catch {
    const res = await request<PteroObject<EggAttributes>>(
      "PATCH",
      `/api/application/nests/${nestId}/eggs/${eggId}`,
      eggData,
    );
    return res.attributes;
  }
}

export async function deleteEgg(
  request: AppRequestFn,
  nestId: number,
  eggId: number,
): Promise<void> {
  try {
    await request<void>("DELETE", `/api/application/eggs/${eggId}`);
  } catch {
    await request<void>("DELETE", `/api/application/nests/${nestId}/eggs/${eggId}`);
  }
}

// ─── Allocation Methods ───────────────────────────────────────────────────────

export interface ListAllocationsResult {
  allocations: AllocationAttributes[];
  pagination: PteroPagination;
}

export async function listAllocations(
  request: AppRequestFn,
  nodeId: number,
  params?: ListParams,
): Promise<ListAllocationsResult> {
  const path = buildListPath(`/api/application/nodes/${nodeId}/allocations`, params);
  const response = await request<PteroList<AllocationAttributes>>("GET", path);
  const validated = assertShape<PteroList<AllocationAttributes>>(response, ["data"]);
  return {
    allocations: validated.data.map((item) => item.attributes),
    pagination: extractPagination(validated),
  };
}

export async function createAllocation(
  request: AppRequestFn,
  nodeId: number,
  ip: string,
  ports: string[],
): Promise<void> {
  await request<void>("POST", `/api/application/nodes/${nodeId}/allocations`, { ip, ports });
}

export async function deleteAllocation(
  request: AppRequestFn,
  nodeId: number,
  allocationId: number,
): Promise<void> {
  await request<void>("DELETE", `/api/application/nodes/${nodeId}/allocations/${allocationId}`);
}

// ─── Egg Variable Methods ─────────────────────────────────────────────────────

export async function listEggVariables(
  request: AppRequestFn,
  nestId: number,
  eggId: number,
): Promise<{ variables: EggVariableAttributes[]; pagination: PteroPagination }> {
  try {
    const res = await request<PteroList<EggVariableAttributes>>(
      "GET",
      `/api/application/eggs/${eggId}/variables`,
    );
    const validated = assertShape<PteroList<EggVariableAttributes>>(res, ["data"]);
    return {
      variables: validated.data.map((item) => item.attributes),
      pagination: extractPagination(validated),
    };
  } catch {
    const res = await request<PteroList<EggVariableAttributes>>(
      "GET",
      `/api/application/nests/${nestId}/eggs/${eggId}/variables`,
    );
    const validated = assertShape<PteroList<EggVariableAttributes>>(res, ["data"]);
    return {
      variables: validated.data.map((item) => item.attributes),
      pagination: extractPagination(validated),
    };
  }
}

export async function createEggVariable(
  request: AppRequestFn,
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
  try {
    const res = await request<PteroObject<EggVariableAttributes>>(
      "POST",
      `/api/application/eggs/${eggId}/variables`,
      data,
    );
    return res.attributes;
  } catch {
    const res = await request<PteroObject<EggVariableAttributes>>(
      "POST",
      `/api/application/nests/${nestId}/eggs/${eggId}/variables`,
      data,
    );
    return res.attributes;
  }
}

export async function updateEggVariable(
  request: AppRequestFn,
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
  try {
    const res = await request<PteroObject<EggVariableAttributes>>(
      "PATCH",
      `/api/application/eggs/${eggId}/variables/${variableId}`,
      data,
    );
    return res.attributes;
  } catch {
    const res = await request<PteroObject<EggVariableAttributes>>(
      "PATCH",
      `/api/application/nests/${nestId}/eggs/${eggId}/variables/${variableId}`,
      data,
    );
    return res.attributes;
  }
}

export async function deleteEggVariable(
  request: AppRequestFn,
  nestId: number,
  eggId: number,
  variableId: number,
): Promise<void> {
  try {
    await request<void>("DELETE", `/api/application/eggs/${eggId}/variables/${variableId}`);
  } catch {
    await request<void>(
      "DELETE",
      `/api/application/nests/${nestId}/eggs/${eggId}/variables/${variableId}`,
    );
  }
}

// ─── Nest Methods ─────────────────────────────────────────────────────────────

export async function getNest(request: AppRequestFn, nestId: number): Promise<NestAttributes> {
  const res = await request<PteroObject<NestAttributes>>("GET", `/api/application/nests/${nestId}`);
  const validated = assertShape<PteroObject<NestAttributes>>(res, ["attributes"]);
  return validated.attributes;
}

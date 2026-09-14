// Pterodactyl & Pelican Application API
// Wraps everything in { object: "type", attributes: {...} }
// Lists: { object: "list", data: [...], meta: { pagination: {...} } }

export interface PteroObject<T> {
  object: string;
  attributes: T;
}

export interface PteroList<T> {
  object: "list";
  data: PteroObject<T>[];
  meta?: {
    pagination?: PteroPagination;
  };
}

export interface PteroPagination {
  total: number;
  count: number;
  per_page: number;
  current_page: number;
  total_pages: number;
  links: Record<string, string>;
}

export interface ServerAttributes {
  id: number;
  external_id: string | null;
  uuid: string;
  identifier: string;
  name: string;
  description: string;
  status: string | null;
  suspended: boolean;
  limits: ServerLimits;
  feature_limits: FeatureLimits;
  user: number;
  node: number;
  allocation: number;
  egg: number;
  container: ServerContainer;
  updated_at: string;
  created_at: string;
}

export interface ServerContainer {
  startup_command: string;
  image: string;
  installed: number;
  environment: Record<string, string>;
}

export interface ServerLimits {
  memory: number;
  swap: number;
  disk: number;
  io: number;
  cpu: number;
  threads: string | null;
  oom_disabled?: boolean;
  oom_killer?: boolean;
}

export interface FeatureLimits {
  databases: number;
  allocations: number;
  backups: number;
}

export interface ServerResources {
  current_state: "running" | "starting" | "stopping" | "offline";
  is_suspended: boolean;
  resources: {
    memory_bytes: number;
    cpu_absolute: number;
    disk_bytes: number;
    network_rx_bytes: number;
    network_tx_bytes: number;
    uptime: number;
  };
}

export type PowerAction = "start" | "stop" | "restart" | "kill";

export interface ListParams {
  page?: number;
  per_page?: number;
}

// ─── Client API Types ──────────────────────────────────────────────────────

export interface FileAttributes {
  name: string;
  mode: string;
  mode_bits: string;
  size: number;
  is_file: boolean;
  is_symlink: boolean;
  mimetype: string;
  created_at: string;
  modified_at: string;
}

export interface BackupAttributes {
  uuid: string;
  is_successful: boolean;
  is_locked: boolean;
  name: string;
  bytes: number;
  created_at: string;
  completed_at: string | null;
}

export interface UserAttributes {
  id: number;
  uuid: string;
  username: string;
  email: string;
  language: string;
  root_admin: boolean;
}

export interface NodeAttributes {
  id: number;
  uuid: string;
  name: string;
  description: string | null;
  fqdn: string;
  scheme: string;
  memory: number;
  disk: number;
  cpu: number;
  maintenance_mode: boolean;
  allocated_resources: {
    memory: number;
    disk: number;
    cpu: number;
  };
}

export interface EggVariable {
  name: string;
  description: string;
  env_variable: string;
  default_value: string;
  user_viewable: boolean;
  user_editable: boolean;
  rules: string;
}

export interface EggAttributes {
  id: number;
  uuid: string;
  name: string;
  description: string | null;
  author: string;
  docker_image: string;
  docker_images: Record<string, string>;
  startup: string;
  nest: number;
  config_from: number | null;
  config_stop: string | null;
  config_logs: string | null;
  config_files: string | null;
  config_startup: string | null;
  script_container: string | null;
  script_entry: string | null;
  script_install: string | null;
  variables: EggVariable[];
  created_at: string;
  updated_at: string;
}

export interface NestAttributes {
  id: number;
  uuid: string;
  name: string;
  author: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface RoleAttributes {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface MountAttributes {
  id: number;
  name: string;
  description: string | null;
  source: string;
  target: string;
  read_only: boolean;
}

export interface StartupData {
  data: PteroObject<Record<string, unknown>>[];
  meta: {
    startup_command: string;
    docker_images: Record<string, string>;
  };
}

export interface AllocationAttributes {
  id: number;
  ip: string;
  alias: string | null;
  port: number;
  notes: string | null;
  assigned: boolean;
  server_id: number | null;
}

export interface EggVariableAttributes {
  id: number;
  egg_id: number;
  name: string;
  description: string;
  env_variable: string;
  default_value: string;
  user_viewable: boolean;
  user_editable: boolean;
  rules: string;
  created_at: string;
  updated_at: string;
}

export interface ActivityLogEntry {
  id: string;
  batch: string | null;
  event: string;
  is_api: boolean;
  ip: string | null;
  description: string | null;
  properties: Record<string, unknown>;
  has_additional_metadata: boolean;
  timestamp: string;
}

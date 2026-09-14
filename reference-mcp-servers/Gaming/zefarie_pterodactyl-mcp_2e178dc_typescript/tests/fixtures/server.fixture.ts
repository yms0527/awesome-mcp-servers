import type {
  BackupAttributes,
  EggAttributes,
  FileAttributes,
  MountAttributes,
  NodeAttributes,
  PteroList,
  PteroObject,
  PteroPagination,
  RoleAttributes,
  ServerAttributes,
  ServerResources,
  UserAttributes,
} from "../../src/client/types.js";

// ─── Server Fixtures ──────────────────────────────────────────────────────────

const DEFAULT_SERVER: ServerAttributes = {
  id: 1,
  external_id: null,
  uuid: "550e8400-e29b-41d4-a716-446655440000",
  identifier: "abc123",
  name: "Survival SMP",
  description: "A Minecraft survival server",
  status: null,
  suspended: false,
  limits: {
    memory: 4096,
    swap: 0,
    disk: 20480,
    io: 500,
    cpu: 200,
    threads: null,
    oom_disabled: false,
  },
  feature_limits: { databases: 5, allocations: 5, backups: 2 },
  user: 1,
  node: 1,
  allocation: 1,
  egg: 1,
  container: {
    startup_command: "java -Xms128M -Xmx4096M -jar server.jar",
    image: "ghcr.io/pterodactyl/yolks:java_17",
    installed: 1,
    environment: {},
  },
  updated_at: "2026-01-01T00:00:00+00:00",
  created_at: "2026-01-01T00:00:00+00:00",
};

const DEFAULT_PAGINATION: PteroPagination = {
  total: 1,
  count: 1,
  per_page: 50,
  current_page: 1,
  total_pages: 1,
  links: {},
};

export function createServer(overrides?: Partial<ServerAttributes>): ServerAttributes {
  return { ...DEFAULT_SERVER, ...overrides };
}

export function createPagination(overrides?: Partial<PteroPagination>): PteroPagination {
  return { ...DEFAULT_PAGINATION, ...overrides };
}

export function createPteroObject(attributes: ServerAttributes): PteroObject<ServerAttributes> {
  return { object: "server", attributes };
}

export function createPteroList(
  servers: ServerAttributes[],
  paginationOverrides?: Partial<PteroPagination>,
): PteroList<ServerAttributes> {
  return {
    object: "list",
    data: servers.map((attrs) => createPteroObject(attrs)),
    meta: {
      pagination: createPagination({
        total: servers.length,
        count: servers.length,
        ...paginationOverrides,
      }),
    },
  };
}

// ─── User Fixtures ────────────────────────────────────────────────────────────

const DEFAULT_USER: UserAttributes = {
  id: 1,
  uuid: "660e8400-e29b-41d4-a716-446655440001",
  username: "testuser",
  email: "test@example.com",
  language: "en",
  root_admin: false,
};

export function createUser(overrides?: Partial<UserAttributes>): UserAttributes {
  return { ...DEFAULT_USER, ...overrides };
}

// ─── Node Fixtures ────────────────────────────────────────────────────────────

const DEFAULT_NODE: NodeAttributes = {
  id: 1,
  uuid: "770e8400-e29b-41d4-a716-446655440002",
  name: "Node-01",
  description: "Primary game node",
  fqdn: "node1.example.com",
  scheme: "https",
  memory: 32768,
  disk: 500000,
  cpu: 400,
  maintenance_mode: false,
  allocated_resources: {
    memory: 8192,
    disk: 100000,
    cpu: 200,
  },
};

export function createNode(overrides?: Partial<NodeAttributes>): NodeAttributes {
  return { ...DEFAULT_NODE, ...overrides };
}

// ─── File Fixtures ────────────────────────────────────────────────────────────

const DEFAULT_FILE: FileAttributes = {
  name: "server.properties",
  mode: "0644",
  mode_bits: "644",
  size: 1024,
  is_file: true,
  is_symlink: false,
  mimetype: "text/plain",
  created_at: "2026-01-01T00:00:00+00:00",
  modified_at: "2026-01-15T12:00:00+00:00",
};

export function createFile(overrides?: Partial<FileAttributes>): FileAttributes {
  return { ...DEFAULT_FILE, ...overrides };
}

export function createDirectory(overrides?: Partial<FileAttributes>): FileAttributes {
  return {
    ...DEFAULT_FILE,
    name: "plugins",
    is_file: false,
    mimetype: "inode/directory",
    size: 4096,
    ...overrides,
  };
}

// ─── Backup Fixtures ──────────────────────────────────────────────────────────

const DEFAULT_BACKUP: BackupAttributes = {
  uuid: "880e8400-e29b-41d4-a716-446655440003",
  is_successful: true,
  is_locked: false,
  name: "Daily Backup",
  bytes: 104857600,
  created_at: "2026-01-15T00:00:00+00:00",
  completed_at: "2026-01-15T00:05:00+00:00",
};

export function createBackup(overrides?: Partial<BackupAttributes>): BackupAttributes {
  return { ...DEFAULT_BACKUP, ...overrides };
}

// ─── Server Resources Fixtures ────────────────────────────────────────────────

const DEFAULT_RESOURCES: ServerResources = {
  current_state: "running",
  is_suspended: false,
  resources: {
    memory_bytes: 2147483648,
    cpu_absolute: 45.5,
    disk_bytes: 5368709120,
    network_rx_bytes: 1073741824,
    network_tx_bytes: 536870912,
    uptime: 86400,
  },
};

export function createServerResources(overrides?: Partial<ServerResources>): ServerResources {
  return {
    ...DEFAULT_RESOURCES,
    ...overrides,
    resources: {
      ...DEFAULT_RESOURCES.resources,
      ...(overrides?.resources ?? {}),
    },
  };
}

// ─── Egg Fixtures ─────────────────────────────────────────────────────────────

const DEFAULT_EGG: EggAttributes = {
  id: 1,
  uuid: "990e8400-e29b-41d4-a716-446655440004",
  name: "Minecraft Java",
  description: "Minecraft Java Edition server",
  author: "support@pterodactyl.io",
  docker_image: "ghcr.io/pterodactyl/yolks:java_17",
  docker_images: {
    "Java 17": "ghcr.io/pterodactyl/yolks:java_17",
    "Java 21": "ghcr.io/pterodactyl/yolks:java_21",
  },
  startup: "java -Xms128M -Xmx{{SERVER_MEMORY}}M -jar {{SERVER_JARFILE}}",
};

export function createEgg(overrides?: Partial<EggAttributes>): EggAttributes {
  return { ...DEFAULT_EGG, ...overrides };
}

// ─── Role Fixtures ────────────────────────────────────────────────────────────

const DEFAULT_ROLE: RoleAttributes = {
  id: 1,
  name: "Admin",
  created_at: "2026-01-01T00:00:00+00:00",
  updated_at: "2026-01-01T00:00:00+00:00",
};

export function createRole(overrides?: Partial<RoleAttributes>): RoleAttributes {
  return { ...DEFAULT_ROLE, ...overrides };
}

// ─── Mount Fixtures ───────────────────────────────────────────────────────────

const DEFAULT_MOUNT: MountAttributes = {
  id: 1,
  name: "shared-data",
  description: "Shared data mount",
  source: "/mnt/data/shared",
  target: "/mnt/server/shared",
  read_only: false,
};

export function createMount(overrides?: Partial<MountAttributes>): MountAttributes {
  return { ...DEFAULT_MOUNT, ...overrides };
}

# Tools Reference

Detailed documentation for every MCP tool exposed by `pterodactyl-mcp`.

## Important: Server ID vs Identifier

Many tools require a server reference. Pterodactyl uses two different types:

- **`server_id`** (number) --- Numeric ID used by Application API (admin) tools. Get from `list_servers` field `id`.
- **`server_identifier`** (string) --- Short alphanumeric string used by Client API tools. Get from `list_servers` field `identifier` (e.g., `"a1b2c3d4"`).

Always call `list_servers` first to discover both values.

---

## Server Management (Application API)

These tools use the Application API key (`PTERODACTYL_APP_KEY`) and take a numeric `server_id`.

### list_servers

List all game servers on the Pterodactyl panel. Call this first to discover server IDs and identifiers.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `page` | `integer` | No | Page number (default: 1) |
| `per_page` | `integer` | No | Items per page, 1-100 (default: 50) |

**Annotations:** `readOnlyHint: true`

### get_server

Get detailed static configuration for a server including limits, container config, allocations, and timestamps.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `server_id` | `integer` | Yes | Numeric server ID from `list_servers` field `id` |

**Annotations:** `readOnlyHint: true`

### create_server

Create a new game server on the panel.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | `string` | Yes | Server name |
| `user` | `integer` | Yes | Owner user ID (from `list_users`) |
| `egg` | `integer` | Yes | Egg/template ID (from `list_eggs`) |
| `docker_image` | `string` | Yes | Docker image to use |
| `startup` | `string` | Yes | Startup command |
| `memory` | `integer` | Yes | Memory limit in MB |
| `disk` | `integer` | Yes | Disk limit in MB |
| `cpu` | `integer` | Yes | CPU limit in % (100 = 1 core) |
| `swap` | `integer` | No | Swap limit in MB (default: 0) |
| `io` | `integer` | No | IO weight (default: 500) |
| `databases_limit` | `integer` | No | Max databases (default: 0) |
| `allocations_limit` | `integer` | No | Max allocations (default: 0) |
| `backups_limit` | `integer` | No | Max backups (default: 0) |
| `allocation_id` | `integer` | Yes | Default allocation ID |
| `environment` | `object` | No | Environment variables for the egg |

**Annotations:** `destructiveHint: true`

### delete_server

Permanently delete a server and ALL its data. Cannot be undone.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `server_id` | `integer` | Yes | Numeric server ID from `list_servers` field `id` |

**Annotations:** `destructiveHint: true`

### update_server_details

Update a server's name, description, owner, or external ID.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `server_id` | `integer` | Yes | Numeric server ID from `list_servers` field `id` |
| `name` | `string` | No | New server name |
| `description` | `string` | No | New description |
| `user` | `integer` | No | New owner user ID |
| `external_id` | `string` | No | New external ID |

**Annotations:** `destructiveHint: true`

### update_server_build

Update a server's resource limits and feature limits.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `server_id` | `integer` | Yes | Numeric server ID from `list_servers` field `id` |
| `memory` | `integer` | No | Memory limit in MB |
| `swap` | `integer` | No | Swap limit in MB |
| `disk` | `integer` | No | Disk limit in MB |
| `io` | `integer` | No | IO weight (10-1000) |
| `cpu` | `integer` | No | CPU limit in % (100 = 1 core) |
| `threads` | `string` | No | CPU threads to pin (e.g., `"0-1,3"`) |
| `allocation` | `integer` | No | Default allocation ID |
| `databases_limit` | `integer` | No | Max databases |
| `allocations_limit` | `integer` | No | Max allocations |
| `backups_limit` | `integer` | No | Max backups |

**Annotations:** `destructiveHint: true`

### update_server_startup

Update a server's startup command, Docker image, or egg.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `server_id` | `integer` | Yes | Numeric server ID from `list_servers` field `id` |
| `startup` | `string` | No | New startup command |
| `image` | `string` | No | New Docker image |
| `egg` | `integer` | No | New egg ID |

**Annotations:** `destructiveHint: true`

### suspend_server

Suspend a server. Users cannot start suspended servers.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `server_id` | `integer` | Yes | Numeric server ID from `list_servers` field `id` |

**Annotations:** `destructiveHint: true`, `idempotentHint: true`

### unsuspend_server

Unsuspend a previously suspended server.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `server_id` | `integer` | Yes | Numeric server ID from `list_servers` field `id` |

**Annotations:** `destructiveHint: true`, `idempotentHint: true`

### reinstall_server

Reinstall a server's egg. WARNING: Wipes all server files.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `server_id` | `integer` | Yes | Numeric server ID from `list_servers` field `id` |

**Annotations:** `destructiveHint: true`

### list_server_databases

List databases attached to a server (admin view).

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `server_id` | `integer` | Yes | Numeric server ID from `list_servers` field `id` |

**Annotations:** `readOnlyHint: true`

---

## Power Control (Client API)

These tools use the Client API key (`PTERODACTYL_CLIENT_KEY`) and take a string `server_identifier`.

### start_server

Start a stopped server.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `server_identifier` | `string` | Yes | Short identifier from `list_servers` field `identifier` |

**Annotations:** `destructiveHint: true`

### stop_server

Stop a running server gracefully.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `server_identifier` | `string` | Yes | Short identifier from `list_servers` field `identifier` |

**Annotations:** `destructiveHint: true`

### restart_server

Restart a server. Works on both running and stopped servers.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `server_identifier` | `string` | Yes | Short identifier from `list_servers` field `identifier` |

**Annotations:** `destructiveHint: true`, `idempotentHint: true`

### kill_server

Forcefully kill a server process. Data may be lost.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `server_identifier` | `string` | Yes | Short identifier from `list_servers` field `identifier` |

**Annotations:** `destructiveHint: true`

### get_server_resources

Get real-time CPU, memory, disk, network usage and power state.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `server_identifier` | `string` | Yes | Short identifier from `list_servers` field `identifier` |

**Annotations:** `readOnlyHint: true`

---

## Console (Client API)

### send_command

Send a console command to a running server. The server must be running.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `server_identifier` | `string` | Yes | Short identifier from `list_servers` field `identifier` |
| `command` | `string` | Yes | Console command (e.g., `"say Hello"`, `"whitelist add Player"`) |

**Annotations:** `destructiveHint: true`

---

## File Management (Client API)

### list_files

List files and directories in a server's filesystem.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `server_identifier` | `string` | Yes | Short identifier from `list_servers` field `identifier` |
| `directory` | `string` | No | Directory path to list (default: `/`) |

**Annotations:** `readOnlyHint: true`

### read_file

Read the contents of a text file on a server.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `server_identifier` | `string` | Yes | Short identifier from `list_servers` field `identifier` |
| `file_path` | `string` | Yes | Absolute path (e.g., `/server.properties`) |

**Annotations:** `readOnlyHint: true`

### write_file

Write content to a file. Creates or overwrites.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `server_identifier` | `string` | Yes | Short identifier from `list_servers` field `identifier` |
| `file_path` | `string` | Yes | Absolute path (e.g., `/server.properties`) |
| `content` | `string` | Yes | File content to write |

**Annotations:** `destructiveHint: true`

### create_folder

Create a new directory on a server.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `server_identifier` | `string` | Yes | Short identifier from `list_servers` field `identifier` |
| `directory` | `string` | Yes | Parent directory (e.g., `/`) |
| `name` | `string` | Yes | Folder name to create |

**Annotations:** `destructiveHint: true`

### delete_files

Delete one or more files or folders. Cannot be undone.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `server_identifier` | `string` | Yes | Short identifier from `list_servers` field `identifier` |
| `directory` | `string` | Yes | Parent directory containing the files |
| `files` | `string[]` | Yes | File/folder names to delete |

**Annotations:** `destructiveHint: true`

### rename_file

Rename or move a file/folder.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `server_identifier` | `string` | Yes | Short identifier from `list_servers` field `identifier` |
| `directory` | `string` | Yes | Directory containing the file |
| `from` | `string` | Yes | Current name |
| `to` | `string` | Yes | New name |

**Annotations:** `destructiveHint: true`

### compress_files

Compress files into a .tar.gz archive.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `server_identifier` | `string` | Yes | Short identifier from `list_servers` field `identifier` |
| `directory` | `string` | Yes | Directory containing the files |
| `files` | `string[]` | Yes | File/folder names to compress |

**Annotations:** `destructiveHint: true`

### decompress_file

Extract an archive file (.tar.gz, .zip).

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `server_identifier` | `string` | Yes | Short identifier from `list_servers` field `identifier` |
| `directory` | `string` | Yes | Directory containing the archive |
| `file` | `string` | Yes | Archive filename |

**Annotations:** `destructiveHint: true`

---

## Backups (Client API)

### list_backups

List all backups for a server.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `server_identifier` | `string` | Yes | Short identifier from `list_servers` field `identifier` |

**Annotations:** `readOnlyHint: true`

### create_backup

Create a new server backup.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `server_identifier` | `string` | Yes | Short identifier from `list_servers` field `identifier` |
| `name` | `string` | No | Backup name (auto-generated if omitted) |

**Annotations:** `destructiveHint: true`

---

## Startup & Config (Client API)

### get_startup_variables

Get startup command, environment variables, and available Docker images.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `server_identifier` | `string` | Yes | Short identifier from `list_servers` field `identifier` |

**Annotations:** `readOnlyHint: true`

---

## Schedules (Client API)

### list_schedules

List all scheduled tasks (cron jobs) for a server.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `server_identifier` | `string` | Yes | Short identifier from `list_servers` field `identifier` |

**Annotations:** `readOnlyHint: true`

---

## Databases (Client API)

### list_client_databases

List databases for a server (client view).

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `server_identifier` | `string` | Yes | Short identifier from `list_servers` field `identifier` |

**Annotations:** `readOnlyHint: true`

---

## Sub-users (Client API)

### list_subusers

List sub-users with their permissions for a server.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `server_identifier` | `string` | Yes | Short identifier from `list_servers` field `identifier` |

**Annotations:** `readOnlyHint: true`

---

## Account (Client API)

### get_account

Get the current authenticated user's account information.

No parameters required.

**Annotations:** `readOnlyHint: true`

---

## Users (Application API)

### list_users

List all user accounts on the panel.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `page` | `integer` | No | Page number (default: 1) |
| `per_page` | `integer` | No | Items per page, 1-100 (default: 50) |

**Annotations:** `readOnlyHint: true`

### get_user

Get detailed info for a specific user.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `user_id` | `integer` | Yes | User numeric ID (from `list_users`) |

**Annotations:** `readOnlyHint: true`

### create_user

Create a new user account.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `username` | `string` | Yes | Username |
| `email` | `string` | Yes | Email address |
| `password` | `string` | Yes | Password (min 8 characters) |
| `root_admin` | `boolean` | No | Admin status (default: false) |

**Annotations:** `destructiveHint: true`

### update_user

Update an existing user's details.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `user_id` | `integer` | Yes | User numeric ID |
| `username` | `string` | No | New username |
| `email` | `string` | No | New email |
| `password` | `string` | No | New password |
| `root_admin` | `boolean` | No | Admin status |

**Annotations:** `destructiveHint: true`

---

## Nodes (Application API)

### list_nodes

List all infrastructure nodes.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `page` | `integer` | No | Page number (default: 1) |
| `per_page` | `integer` | No | Items per page, 1-100 (default: 50) |

**Annotations:** `readOnlyHint: true`

### get_node

Get detailed info for a specific node.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `node_id` | `integer` | Yes | Node numeric ID (from `list_nodes`) |

**Annotations:** `readOnlyHint: true`

### get_node_config

Get the Wings daemon configuration for a node.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `node_id` | `integer` | Yes | Node numeric ID (from `list_nodes`) |

**Annotations:** `readOnlyHint: true`

---

## Panel Config (Application API)

### list_eggs

List all available server templates (eggs).

No parameters required.

**Annotations:** `readOnlyHint: true`

### list_mounts

List all mount points configured on the panel.

No parameters required.

**Annotations:** `readOnlyHint: true`

### list_roles

List all admin roles defined on the panel.

No parameters required.

**Annotations:** `readOnlyHint: true`

---

## Error Responses

All tools return structured error objects when something goes wrong.

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Invalid or missing API key |
| `FORBIDDEN` | 403 | API key lacks permission for this resource |
| `NOT_FOUND` | 404 | Resource not found (check ID/identifier) |
| `RATE_LIMITED` | 429 | Too many requests (auto-retried) |
| `API_ERROR` | 5xx | Panel temporarily unavailable (auto-retried) |
| `CLIENT_KEY_REQUIRED` | --- | Client API key needed but not configured |
| `NETWORK_ERROR` | --- | Cannot connect to the panel |
| `TIMEOUT` | --- | Request timed out |

### Example Error Response

```json
{
  "error": "NOT_FOUND",
  "message": "Resource not found. Verify the ID/identifier is correct by calling list_servers first.",
  "status": 404
}
```

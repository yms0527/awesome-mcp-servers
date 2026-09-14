/**
 * Maps the Application API `status` field to a human-readable string.
 *
 * In the Pterodactyl Application API, `status` is a nullable string:
 *   - `null`          → server is in normal state (no anomaly)
 *   - `"installing"`  → server egg is being installed
 *   - `"install_failed"` → egg installation failed
 *   - `"reinstall_failed"` → egg reinstallation failed
 *   - `"suspended"`   → server has been suspended by admin
 *
 * This is NOT the live power state (running/stopped). For live state,
 * use `get_server_resources` which returns `current_state`.
 */
export function mapServerStatus(status: string | null): string {
  if (status === null) {
    return "normal";
  }
  return status;
}

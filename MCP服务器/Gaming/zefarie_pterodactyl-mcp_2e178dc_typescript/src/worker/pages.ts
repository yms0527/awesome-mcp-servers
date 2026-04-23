// src/worker/pages.ts - Brutalist HTML page renderers for the Pterodactyl MCP worker

import { escapeHtml } from "../lib/sanitize.js";
import { ICONS, renderLayout } from "./layout.js";

/**
 * Renders the setup / home page with the configuration form.
 */
export function renderSetupPage(error?: string): string {
  const errorBlock = error
    ? `<div class="alert-error">
        <span class="alert-error-icon">${ICONS.alertCircle}</span>
        <span>${escapeHtml(error)}</span>
      </div>`
    : "";

  return renderLayout({
    title: "Pterodactyl MCP",
    body: `
      <div class="hero">
        <h1>PTERODACTYL MCP</h1>
        <p class="hero-subtitle">// manage your game servers through AI</p>
      </div>

      ${errorBlock}

      <div class="section">
        <div class="section-header">
          <span class="section-icon">${ICONS.key}</span>
          PANEL CONFIG
        </div>
        <form method="POST" action="/setup" autocomplete="off">
          <div class="field">
            <label for="panel_url">panel url<span class="required-star">*</span></label>
            <input
              type="url"
              id="panel_url"
              name="panel_url"
              placeholder="https://panel.example.com"
              required
              spellcheck="false"
            >
            <p class="input-hint">your pterodactyl or pelican panel address</p>
          </div>

          <div class="field">
            <div class="label-row">
              <label for="app_key">application key<span class="required-star">*</span></label>
            </div>
            <input type="checkbox" id="toggle_app" class="toggle-vis">
            <div class="input-wrapper">
              <input
                type="password"
                id="app_key"
                name="app_key"
                placeholder="ptla_xxxxxxxxxxxxx"
                required
                spellcheck="false"
                autocomplete="off"
              >
              <label for="toggle_app" class="toggle-vis-label" title="Toggle visibility">
                <span class="show-text">show</span>
                <span class="hide-text">hide</span>
              </label>
            </div>
            <p class="input-hint">starts with ptla_</p>
          </div>

          <div class="field">
            <div class="label-row">
              <label for="client_key">client key</label>
              <span class="optional-tag">optional</span>
            </div>
            <input type="checkbox" id="toggle_client" class="toggle-vis">
            <div class="input-wrapper">
              <input
                type="password"
                id="client_key"
                name="client_key"
                placeholder="ptlc_xxxxxxxxxxxxx"
                spellcheck="false"
                autocomplete="off"
              >
              <label for="toggle_client" class="toggle-vis-label" title="Toggle visibility">
                <span class="show-text">show</span>
                <span class="hide-text">hide</span>
              </label>
            </div>
            <p class="input-hint">starts with ptlc_</p>
          </div>

          <button type="submit" class="btn btn-primary">&gt; CONNECT</button>

          <div class="security-note">
            <span class="security-note-icon">${ICONS.shield}</span>
            <p>keys are encrypted at rest. never exposed in responses.</p>
          </div>
        </form>
      </div>

      <div class="section">
        <div class="section-header">
          <span class="section-icon">${ICONS.terminal}</span>
          AVAILABLE TOOLS
        </div>

        <p class="tools-section-label">-- server management (application key) --</p>
        <div class="tools-list">
          ${toolRow("list_servers", "read")}
          ${toolRow("get_server", "read")}
          ${toolRow("create_server", "write")}
          ${toolRow("delete_server", "write")}
          ${toolRow("update_server_details", "write")}
          ${toolRow("update_server_build", "write")}
          ${toolRow("update_server_startup", "write")}
          ${toolRow("suspend_server", "write")}
          ${toolRow("unsuspend_server", "write")}
          ${toolRow("reinstall_server", "write")}
        </div>

        <p class="tools-section-label">-- users & nodes (application key) --</p>
        <div class="tools-list">
          ${toolRow("list_users", "read")}
          ${toolRow("get_user", "read")}
          ${toolRow("create_user", "write")}
          ${toolRow("update_user", "write")}
          ${toolRow("list_nodes", "read")}
          ${toolRow("get_node", "read")}
          ${toolRow("get_node_config", "read")}
        </div>

        <p class="tools-section-label">-- eggs & nests (application key) --</p>
        <div class="tools-list">
          ${toolRow("list_nests", "read")}
          ${toolRow("get_nest", "read")}
          ${toolRow("list_eggs", "read")}
          ${toolRow("get_egg", "read")}
          ${toolRow("import_egg", "write")}
          ${toolRow("export_egg", "read")}
          ${toolRow("delete_egg", "write")}
          ${toolRow("list_egg_variables", "read")}
          ${toolRow("create_egg_variable", "write")}
          ${toolRow("update_egg_variable", "write")}
          ${toolRow("delete_egg_variable", "write")}
        </div>

        <p class="tools-section-label">-- allocations (application key) --</p>
        <div class="tools-list">
          ${toolRow("list_allocations", "read")}
          ${toolRow("create_allocation", "write")}
          ${toolRow("delete_allocation", "write")}
        </div>

        <p class="tools-section-label">-- panel config (application key) --</p>
        <div class="tools-list">
          ${toolRow("list_roles", "read")}
          ${toolRow("list_mounts", "read")}
        </div>

        <p class="tools-section-label">-- power & console (client key) --</p>
        <div class="tools-list">
          ${toolRow("start_server", "write")}
          ${toolRow("stop_server", "write")}
          ${toolRow("restart_server", "write")}
          ${toolRow("kill_server", "write")}
          ${toolRow("send_command", "write")}
          ${toolRow("get_server_resources", "read")}
          ${toolRow("get_startup_variables", "read")}
          ${toolRow("get_account", "read")}
        </div>

        <p class="tools-section-label">-- logs & activity (client key) --</p>
        <div class="tools-list">
          ${toolRow("get_recent_logs", "read")}
          ${toolRow("get_server_activity", "read")}
        </div>

        <p class="tools-section-label">-- files (client key) --</p>
        <div class="tools-list">
          ${toolRow("list_files", "read")}
          ${toolRow("read_file", "read")}
          ${toolRow("write_file", "write")}
          ${toolRow("download_file", "read")}
          ${toolRow("create_folder", "write")}
          ${toolRow("delete_files", "write")}
          ${toolRow("rename_file", "write")}
          ${toolRow("compress_files", "write")}
          ${toolRow("decompress_file", "write")}
        </div>

        <p class="tools-section-label">-- backups (client key) --</p>
        <div class="tools-list">
          ${toolRow("list_backups", "read")}
          ${toolRow("create_backup", "write")}
          ${toolRow("delete_backup", "write")}
          ${toolRow("download_backup", "read")}
          ${toolRow("restore_backup", "write")}
        </div>

        <p class="tools-section-label">-- schedules (client key) --</p>
        <div class="tools-list">
          ${toolRow("list_schedules", "read")}
          ${toolRow("get_schedule", "read")}
          ${toolRow("create_schedule", "write")}
          ${toolRow("update_schedule", "write")}
          ${toolRow("delete_schedule", "write")}
          ${toolRow("create_schedule_task", "write")}
          ${toolRow("delete_schedule_task", "write")}
        </div>

        <p class="tools-section-label">-- sub-users (client key) --</p>
        <div class="tools-list">
          ${toolRow("list_subusers", "read")}
          ${toolRow("create_subuser", "write")}
          ${toolRow("update_subuser", "write")}
          ${toolRow("delete_subuser", "write")}
        </div>

        <p class="tools-section-label">-- databases (client key) --</p>
        <div class="tools-list">
          ${toolRow("list_client_databases", "read")}
          ${toolRow("list_server_databases", "read")}
          ${toolRow("create_database", "write")}
          ${toolRow("delete_database", "write")}
          ${toolRow("rotate_database_password", "write")}
        </div>
      </div>
    `,
  });
}

/**
 * Renders the success page after a configuration is created.
 */
export function renderSuccessPage(mcpUrl: string, token: string): string {
  const configJson = JSON.stringify({ mcpServers: { pterodactyl: { url: mcpUrl } } }, null, 2);

  return renderLayout({
    title: "Connected - Pterodactyl MCP",
    body: `
      <div class="hero">
        <h1 class="success-heading">[✓] CONNECTION ESTABLISHED</h1>
      </div>

      <div class="section">
        <div class="section-header">
          <span class="section-icon">${ICONS.link}</span>
          YOUR MCP ENDPOINT
        </div>
        <p>your mcp endpoint:</p>
        <div class="url-block" id="mcp-url" onclick="copyUrl(this, '${escapeAttr(mcpUrl)}')">
          ${escapeHtml(mcpUrl)}
          <span class="url-block-label" id="copy-label">copy</span>
        </div>
      </div>

      <div class="section">
        <div class="section-header">
          <span class="section-icon">${ICONS.zap}</span>
          CLAUDE.AI SETUP
        </div>
        <ol class="steps">
          <li><span class="step-num">1.</span> go to <strong>claude.ai</strong> &rarr; settings &rarr; integrations</li>
          <li><span class="step-num">2.</span> click <strong>"add integration"</strong> &rarr; mcp</li>
          <li><span class="step-num">3.</span> paste the endpoint url above</li>
          <li><span class="step-num">4.</span> try: <em>"list all my game servers"</em></li>
        </ol>
      </div>

      <div class="section">
        <div class="section-header">
          <span class="section-icon">${ICONS.terminal}</span>
          CLAUDE DESKTOP / CURSOR
        </div>
        <p>click to copy config:</p>
        <div class="config-block" onclick="copyUrl(this, \`${escapeAttr(configJson)}\`)">${escapeHtml(configJson)}</div>
      </div>

      <div class="section danger-zone">
        <div class="section-header">
          <span class="section-icon" style="color:#ff3333">${ICONS.xCircle}</span>
          DANGER ZONE
        </div>
        <p>token: <span style="color:#666666">${escapeHtml(token)}</span></p>
        <div style="margin-top:1rem">
          <form method="POST" action="/delete">
            <input type="hidden" name="token" value="${escapeAttr(token)}">
            <button
              type="submit"
              class="btn btn-danger"
              onclick="return confirm('Delete your configuration? This action is permanent.')"
            >[×] DELETE CONFIGURATION</button>
          </form>
        </div>
      </div>
    `,
    scripts: `
      <script>
        function copyUrl(el, text) {
          navigator.clipboard.writeText(text).then(function() {
            el.classList.add('copied');
            var label = el.querySelector('.url-block-label');
            if (label) label.textContent = 'copied!';
            setTimeout(function() {
              el.classList.remove('copied');
              if (label) label.textContent = 'copy';
            }, 2000);
          });
        }
      </script>
    `,
  });
}

/**
 * Renders the page shown after a configuration is deleted.
 */
export function renderDeletePage(): string {
  return renderLayout({
    title: "Deleted - Pterodactyl MCP",
    body: `
      <div class="hero">
        <h1 class="success-heading" style="color:#ffffff">[×] CONFIGURATION DELETED</h1>
        <p class="hero-subtitle">your keys have been wiped. the endpoint is dead.</p>
      </div>

      <div class="section">
        <p class="back-link"><a href="/">&lt;- create new configuration</a></p>
      </div>
    `,
  });
}

/**
 * Renders a generic error page.
 */
export function renderErrorPage(status: number, message: string): string {
  return renderLayout({
    title: `${status} - Pterodactyl MCP`,
    body: `
      <div class="hero">
        <h1 class="success-heading" style="color:#ff3333">[×] ${status}</h1>
        <p class="hero-subtitle">${escapeHtml(message)}</p>
      </div>

      <div class="section">
        <p class="back-link"><a href="/">&lt;- back</a></p>
      </div>
    `,
  });
}

// ─── Private helpers ─────────────────────────────────────────────────────────

function toolRow(name: string, type: "read" | "write"): string {
  const badgeClass = type === "read" ? "badge-read" : "badge-write";
  return `<div class="tool-row">
    <span class="tool-name">${name}</span>
    <span class="tool-dots"></span>
    <span class="badge ${badgeClass}">${type}</span>
  </div>`;
}

function escapeAttr(str: string): string {
  return str
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "\\'")
    .replace(/"/g, "&quot;")
    .replace(/`/g, "\\`");
}

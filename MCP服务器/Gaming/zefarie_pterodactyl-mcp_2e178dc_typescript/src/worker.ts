import { createMcpHandler } from "agents/mcp";
import { PterodactylClient } from "./client/pterodactyl.client.js";
import { decrypt, encrypt } from "./lib/crypto.js";
import { createServer } from "./server.js";
import {
  renderDeletePage,
  renderErrorPage,
  renderSetupPage,
  renderSuccessPage,
} from "./worker/pages.js";

interface Env {
  PTERODACTYL_CONFIGS: KVNamespace;
  ENCRYPTION_KEY: string;
}

interface UserConfig {
  panelUrl: string;
  appKey: string;
  clientKey?: string;
  createdAt: string;
}

// ─── CSRF Protection ─────────────────────────────────────────────────────────

/**
 * Verifies that the Origin (or Referer) header of a request matches the
 * worker's own origin. This is the OWASP-recommended CSRF mitigation for
 * stateless APIs that do not use session cookies.
 *
 * Returns `true` when the origin is valid or absent (non-browser clients
 * typically omit it). Returns `false` when the header is present but does
 * not match.
 */
function verifyCsrfOrigin(request: Request): boolean {
  const workerOrigin = new URL(request.url).origin;
  const origin = request.headers.get("Origin");
  if (origin) {
    return origin === workerOrigin;
  }
  const referer = request.headers.get("Referer");
  if (referer) {
    try {
      return new URL(referer).origin === workerOrigin;
    } catch {
      return false;
    }
  }
  // No Origin or Referer header - likely a non-browser client, allow.
  return true;
}

// ─── Routing ────────────────────────────────────────────────────────────────

export default {
  fetch: async (request: Request, env: Env, ctx: ExecutionContext) => {
    const url = new URL(request.url);
    const path = url.pathname;

    if (path === "/" && request.method === "GET") {
      return servePage(renderSetupPage());
    }

    if (path === "/setup" && request.method === "POST") {
      if (!verifyCsrfOrigin(request)) {
        return servePage(renderErrorPage(403, "Forbidden: origin mismatch"));
      }
      return handleSetup(request, env);
    }

    if (path === "/success" && request.method === "GET") {
      const token = url.searchParams.get("token");
      if (!token) return Response.redirect(url.origin, 302);
      const mcpUrl = `${url.origin}/mcp/${token}`;
      return servePage(renderSuccessPage(mcpUrl, token));
    }

    if (path === "/delete" && request.method === "POST") {
      if (!verifyCsrfOrigin(request)) {
        return servePage(renderErrorPage(403, "Forbidden: origin mismatch"));
      }
      return handleDelete(request, env);
    }

    const mcpMatch = path.match(/^\/mcp\/([a-f0-9-]+)$/);
    if (mcpMatch) {
      const token = mcpMatch[1] ?? "";
      return handleMcp(request, env, ctx, token);
    }

    return servePage(renderErrorPage(404, "Page Not Found"));
  },
} satisfies ExportedHandler<Env>;

// ─── MCP Handler ────────────────────────────────────────────────────────────

async function handleMcp(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
  token: string,
): Promise<Response> {
  const encrypted = await env.PTERODACTYL_CONFIGS.get(token, "text");
  if (!encrypted) {
    return new Response(
      JSON.stringify({
        jsonrpc: "2.0",
        error: { code: -32000, message: "Invalid or expired token. Register at the homepage." },
        id: null,
      }),
      { status: 401, headers: { "Content-Type": "application/json" } },
    );
  }

  let config: UserConfig;
  try {
    const raw = await decrypt(encrypted, env.ENCRYPTION_KEY);
    config = JSON.parse(raw) as UserConfig;
  } catch {
    return new Response(
      JSON.stringify({
        jsonrpc: "2.0",
        error: { code: -32000, message: "Failed to decrypt configuration. It may be corrupted." },
        id: null,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
  const client = new PterodactylClient({
    baseUrl: config.panelUrl,
    appKey: config.appKey,
    clientKey: config.clientKey,
  });

  const rewrittenUrl = new URL(request.url);
  rewrittenUrl.pathname = "/mcp";
  const rewrittenRequest = new Request(rewrittenUrl.toString(), request);

  const server = createServer(client);
  return createMcpHandler(server)(rewrittenRequest, env, ctx);
}

// ─── Setup Handler ──────────────────────────────────────────────────────────

async function handleSetup(request: Request, env: Env): Promise<Response> {
  const form = await request.formData();
  const panelUrl = (form.get("panel_url") as string)?.trim();
  const appKey = (form.get("app_key") as string)?.trim();
  const clientKey = (form.get("client_key") as string)?.trim();

  if (!panelUrl || !appKey) {
    return servePage(renderSetupPage("Panel URL and Application API Key are required."));
  }

  try {
    const parsed = new URL(panelUrl);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      throw new Error("Invalid protocol");
    }
  } catch {
    return servePage(renderSetupPage("Invalid panel URL. Must start with https://"));
  }

  const token = crypto.randomUUID();
  const config: UserConfig = {
    panelUrl: panelUrl.replace(/\/+$/, ""),
    appKey,
    clientKey: clientKey || undefined,
    createdAt: new Date().toISOString(),
  };

  const encryptedConfig = await encrypt(JSON.stringify(config), env.ENCRYPTION_KEY);
  await env.PTERODACTYL_CONFIGS.put(token, encryptedConfig);

  return Response.redirect(`${new URL(request.url).origin}/success?token=${token}`, 303);
}

// ─── Delete Handler ─────────────────────────────────────────────────────────

async function handleDelete(request: Request, env: Env): Promise<Response> {
  const form = await request.formData();
  const token = (form.get("token") as string)?.trim();

  if (token) {
    const existing = await env.PTERODACTYL_CONFIGS.get(token, "text");
    if (existing) {
      await env.PTERODACTYL_CONFIGS.delete(token);
    }
  }

  return servePage(renderDeletePage());
}

// ─── Response Helper ────────────────────────────────────────────────────────

function servePage(html: string): Response {
  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

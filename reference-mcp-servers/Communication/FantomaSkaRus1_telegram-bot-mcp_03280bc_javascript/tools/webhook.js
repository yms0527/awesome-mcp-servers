import { z } from "zod";
import { tgCall, tgUpload, formatResult, parseJSON, ok, err } from "../utils/api.js";

export function registerWebhookTools(server) {
  // set_webhook
  server.tool(
    "set_webhook",
    "Set a webhook URL to receive updates via HTTP POST requests.",
    {
      url: z.string().describe("HTTPS URL for the webhook"),
      certificate: z.string().optional().describe("Absolute local file path to public key certificate"),
      ip_address: z.string().optional().describe("Fixed IP address to send webhook requests to instead of DNS-resolved IP"),
      max_connections: z.number().min(1).max(100).optional().describe("Max simultaneous connections (1-100)"),
      allowed_updates: z.string().optional().describe("JSON array of update types to receive"),
      secret_token: z.string().optional().describe("Secret token for X-Telegram-Bot-Api-Secret-Token header (1-256 chars, A-Za-z0-9_-)"),
      drop_pending_updates: z.boolean().optional().describe("Drop all pending updates"),
    },
    async ({ url, certificate, ip_address, max_connections, allowed_updates, secret_token, drop_pending_updates }) => {
      try {
        const params = { url };
        if (ip_address) params.ip_address = ip_address;
        if (max_connections !== undefined) params.max_connections = max_connections;
        if (allowed_updates) params.allowed_updates = parseJSON(allowed_updates);
        if (secret_token) params.secret_token = secret_token;
        if (drop_pending_updates !== undefined) params.drop_pending_updates = drop_pending_updates;

        const result = certificate
          ? await tgUpload("setWebhook", certificate, "certificate", params)
          : await tgCall("setWebhook", params);

        return ok(`Webhook set to: ${url}\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // delete_webhook
  server.tool(
    "delete_webhook",
    "Remove the current webhook.",
    {
      drop_pending_updates: z.boolean().optional().describe("Drop all pending updates"),
    },
    async ({ drop_pending_updates }) => {
      try {
        const params = {};
        if (drop_pending_updates !== undefined) params.drop_pending_updates = drop_pending_updates;
        await tgCall("deleteWebhook", params);
        return ok(`Webhook deleted.`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // get_webhook_info
  server.tool(
    "get_webhook_info",
    "Get current webhook status and information.",
    {},
    async () => {
      try {
        const result = await tgCall("getWebhookInfo");
        let info = `Webhook URL: ${result.url || "(not set)"}\n`;
        info += `Pending updates: ${result.pending_update_count}`;
        if (result.last_error_date) {
          info += `\nLast error: ${result.last_error_message}`;
          info += ` (at ${new Date(result.last_error_date * 1000).toLocaleString()})`;
        }
        return ok(`${info}\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );
}

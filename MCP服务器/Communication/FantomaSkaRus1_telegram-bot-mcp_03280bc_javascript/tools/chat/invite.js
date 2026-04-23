import { z } from "zod";
import { tgCall, resolveChatId, formatResult, ok, err } from "../../utils/api.js";

// ─── Chat Invite Links ─────────────────────────────────────────────────────────

export function registerChatInviteTools(server) {
  // export_chat_invite_link
  server.tool(
    "export_chat_invite_link",
    "Export the primary invite link for a chat. If chat_id is omitted, targets the default log group.",
    {
      chat_id: z.union([z.string(), z.number()]).optional()
        .describe("Chat ID or @channel_username. Optional — defaults to log group"),
    },
    async ({ chat_id }) => {
      try {
        const result = await tgCall("exportChatInviteLink", { chat_id: resolveChatId(chat_id) });
        return ok(`Invite link: ${result}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // create_chat_invite_link
  server.tool(
    "create_chat_invite_link",
    "Create a new invite link for a chat. If chat_id is omitted, targets the default log group.",
    {
      chat_id: z.union([z.string(), z.number()]).optional()
        .describe("Chat ID or @channel_username. Optional — defaults to log group"),
      name: z.string().optional().describe("Invite link name (up to 32 chars)"),
      expire_date: z.number().optional().describe("Unix timestamp when the link expires"),
      member_limit: z.number().optional().describe("Max users who can join (1-99999)"),
      creates_join_request: z.boolean().optional().describe("Require join request approval"),
    },
    async ({ chat_id, name, expire_date, member_limit, creates_join_request }) => {
      try {
        const params = { chat_id: resolveChatId(chat_id) };
        if (name) params.name = name;
        if (expire_date !== undefined) params.expire_date = expire_date;
        if (member_limit !== undefined) params.member_limit = member_limit;
        if (creates_join_request !== undefined) params.creates_join_request = creates_join_request;
        const result = await tgCall("createChatInviteLink", params);
        return ok(`Invite link created: ${result.invite_link}\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // edit_chat_invite_link
  server.tool(
    "edit_chat_invite_link",
    "Edit an existing invite link for a chat. If chat_id is omitted, targets the default log group.",
    {
      chat_id: z.union([z.string(), z.number()]).optional()
        .describe("Chat ID or @channel_username. Optional — defaults to log group"),
      invite_link: z.string().describe("The invite link to edit"),
      name: z.string().optional().describe("New invite link name"),
      expire_date: z.number().optional().describe("Unix timestamp when the link expires"),
      member_limit: z.number().optional().describe("Max users who can join (1-99999)"),
      creates_join_request: z.boolean().optional().describe("Require join request approval"),
    },
    async ({ chat_id, invite_link, name, expire_date, member_limit, creates_join_request }) => {
      try {
        const params = { chat_id: resolveChatId(chat_id), invite_link };
        if (name) params.name = name;
        if (expire_date !== undefined) params.expire_date = expire_date;
        if (member_limit !== undefined) params.member_limit = member_limit;
        if (creates_join_request !== undefined) params.creates_join_request = creates_join_request;
        const result = await tgCall("editChatInviteLink", params);
        return ok(`Invite link updated: ${result.invite_link}\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // revoke_chat_invite_link
  server.tool(
    "revoke_chat_invite_link",
    "Revoke an invite link for a chat. If chat_id is omitted, targets the default log group.",
    {
      chat_id: z.union([z.string(), z.number()]).optional()
        .describe("Chat ID or @channel_username. Optional — defaults to log group"),
      invite_link: z.string().describe("The invite link to revoke"),
    },
    async ({ chat_id, invite_link }) => {
      try {
        const result = await tgCall("revokeChatInviteLink", { chat_id: resolveChatId(chat_id), invite_link });
        return ok(`Invite link revoked: ${result.invite_link}\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // create_chat_subscription_invite_link
  server.tool(
    "create_chat_subscription_invite_link",
    "Create a subscription invite link for a channel chat.",
    {
      chat_id: z.union([z.string(), z.number()]).optional()
        .describe("Chat ID or @channel_username. Optional — defaults to log group"),
      name: z.string().optional().describe("Invite link name (up to 32 chars)"),
      subscription_period: z.number().describe("Subscription period in seconds"),
      subscription_price: z.number().describe("Subscription price in Telegram Stars"),
    },
    async ({ chat_id, name, subscription_period, subscription_price }) => {
      try {
        const params = { chat_id: resolveChatId(chat_id), subscription_period, subscription_price };
        if (name) params.name = name;
        const result = await tgCall("createChatSubscriptionInviteLink", params);
        return ok(`Subscription invite link created: ${result.invite_link}\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // edit_chat_subscription_invite_link
  server.tool(
    "edit_chat_subscription_invite_link",
    "Edit a subscription invite link.",
    {
      chat_id: z.union([z.string(), z.number()]).optional()
        .describe("Chat ID or @channel_username. Optional — defaults to log group"),
      invite_link: z.string().describe("The invite link to edit"),
      name: z.string().optional().describe("New invite link name (up to 32 chars)"),
    },
    async ({ chat_id, invite_link, name }) => {
      try {
        const params = { chat_id: resolveChatId(chat_id), invite_link };
        if (name) params.name = name;
        const result = await tgCall("editChatSubscriptionInviteLink", params);
        return ok(`Subscription invite link updated.\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );
}

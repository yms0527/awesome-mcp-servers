import { z } from "zod";
import { tgCall, resolveChatId, formatResult, ok, err } from "../../utils/api.js";

// ─── Chat Info Methods ─────────────────────────────────────────────────────────

export function registerChatInfoTools(server) {
  // get_chat_info
  server.tool(
    "get_chat_info",
    "Get info about a chat (title, type, members count, description, etc). If chat_id is omitted, returns info about the default log group.",
    {
      chat_id: z.union([z.string(), z.number()]).optional()
        .describe("Chat ID or @channel_username. Optional — defaults to log group"),
    },
    async ({ chat_id }) => {
      try {
        const result = await tgCall("getChat", { chat_id: resolveChatId(chat_id) });
        return ok(formatResult(result));
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // get_chat_member
  server.tool(
    "get_chat_member",
    "Get information about a member of a chat. If chat_id is omitted, targets the default log group.",
    {
      chat_id: z.union([z.string(), z.number()]).optional()
        .describe("Chat ID or @channel_username. Optional — defaults to log group"),
      user_id: z.number().describe("User ID to get info about"),
    },
    async ({ chat_id, user_id }) => {
      try {
        const result = await tgCall("getChatMember", { chat_id: resolveChatId(chat_id), user_id });
        const user = result.user;
        const userName = user.username
          ? `@${user.username}`
          : `${user.first_name || ""}${user.last_name ? " " + user.last_name : ""}`;
        return ok(`Chat Member Info:\n  User: ${userName} (ID: ${user.id})\n  Status: ${result.status}\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // get_chat_member_count
  server.tool(
    "get_chat_member_count",
    "Get the number of members in a chat. If chat_id is omitted, targets the default log group.",
    {
      chat_id: z.union([z.string(), z.number()]).optional()
        .describe("Chat ID or @channel_username. Optional — defaults to log group"),
    },
    async ({ chat_id }) => {
      try {
        const result = await tgCall("getChatMemberCount", { chat_id: resolveChatId(chat_id) });
        return ok(`Chat member count: ${result}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // get_chat_administrators
  server.tool(
    "get_chat_administrators",
    "Get a list of administrators in a chat. If chat_id is omitted, targets the default log group.",
    {
      chat_id: z.union([z.string(), z.number()]).optional()
        .describe("Chat ID or @channel_username. Optional — defaults to log group"),
    },
    async ({ chat_id }) => {
      try {
        const result = await tgCall("getChatAdministrators", { chat_id: resolveChatId(chat_id) });
        const lines = result.map((admin) => {
          const user = admin.user;
          const name = user.username
            ? `@${user.username}`
            : `${user.first_name || ""}${user.last_name ? " " + user.last_name : ""}`;
          return `  ${name} (ID: ${user.id}) — ${admin.status}${admin.custom_title ? ` [${admin.custom_title}]` : ""}`;
        });
        return ok(`Chat Administrators (${result.length}):\n${lines.join("\n")}\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // leave_chat
  server.tool(
    "leave_chat",
    "Leave a chat. The bot will no longer receive updates from this chat.",
    {
      chat_id: z.union([z.string(), z.number()])
        .describe("Chat ID or @channel_username to leave (required)"),
    },
    async ({ chat_id }) => {
      try {
        await tgCall("leaveChat", { chat_id });
        return ok(`Left chat ${chat_id}.`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );
}

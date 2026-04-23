import { z } from "zod";
import {
  tgCall, tgUpload, resolveChatId, formatResult, parseJSON, ok, err
} from "../../utils/api.js";

// ─── Chat Settings Methods ─────────────────────────────────────────────────────

export function registerChatSettingsTools(server) {
  // set_chat_title
  server.tool(
    "set_chat_title",
    "Set a new title for a chat. If chat_id is omitted, targets the default log group.",
    {
      chat_id: z.union([z.string(), z.number()]).optional()
        .describe("Chat ID or @channel_username. Optional — defaults to log group"),
      title: z.string().min(1).max(128).describe("New chat title (1-128 characters)"),
    },
    async ({ chat_id, title }) => {
      try {
        await tgCall("setChatTitle", { chat_id: resolveChatId(chat_id), title });
        return ok(`Chat title updated to "${title}".`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // set_chat_description
  server.tool(
    "set_chat_description",
    "Set a new description for a chat. If chat_id is omitted, targets the default log group.",
    {
      chat_id: z.union([z.string(), z.number()]).optional()
        .describe("Chat ID or @channel_username. Optional — defaults to log group"),
      description: z.string().max(255).describe("New chat description (0-255 characters)"),
    },
    async ({ chat_id, description }) => {
      try {
        await tgCall("setChatDescription", { chat_id: resolveChatId(chat_id), description });
        return ok(`Chat description updated.`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // set_chat_photo
  server.tool(
    "set_chat_photo",
    "Set a new profile photo for a chat. If chat_id is omitted, targets the default log group.",
    {
      chat_id: z.union([z.string(), z.number()]).optional()
        .describe("Chat ID or @channel_username. Optional — defaults to log group"),
      photo: z.string().describe("Absolute local file path to the new chat photo"),
    },
    async ({ chat_id, photo }) => {
      try {
        const result = await tgUpload("setChatPhoto", photo, "photo", { chat_id: resolveChatId(chat_id) });
        return ok(`Chat photo updated!\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // delete_chat_photo
  server.tool(
    "delete_chat_photo",
    "Delete the chat profile photo. If chat_id is omitted, targets the default log group.",
    {
      chat_id: z.union([z.string(), z.number()]).optional()
        .describe("Chat ID or @channel_username. Optional — defaults to log group"),
    },
    async ({ chat_id }) => {
      try {
        await tgCall("deleteChatPhoto", { chat_id: resolveChatId(chat_id) });
        return ok(`Chat photo deleted.`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // set_chat_permissions
  server.tool(
    "set_chat_permissions",
    "Set default chat permissions for all members. If chat_id is omitted, targets the default log group.",
    {
      chat_id: z.union([z.string(), z.number()]).optional()
        .describe("Chat ID or @channel_username. Optional — defaults to log group"),
      permissions: z.string().describe("JSON string with ChatPermissions object"),
      use_independent_chat_permissions: z.boolean().optional()
        .describe("Use independent permissions for each privilege instead of implicit grouping"),
    },
    async ({ chat_id, permissions, use_independent_chat_permissions }) => {
      try {
        const params = { chat_id: resolveChatId(chat_id), permissions: parseJSON(permissions) };
        if (use_independent_chat_permissions !== undefined) params.use_independent_chat_permissions = use_independent_chat_permissions;
        await tgCall("setChatPermissions", params);
        return ok(`Chat permissions updated.`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // set_chat_menu_button
  server.tool(
    "set_chat_menu_button",
    "Set the menu button for a private chat or all chats.",
    {
      chat_id: z.number().optional()
        .describe("User ID for private chat. Optional — if omitted, changes default menu button"),
      menu_button: z.string().describe("JSON object describing the menu button"),
    },
    async ({ chat_id, menu_button }) => {
      try {
        const params = { menu_button: parseJSON(menu_button) };
        if (chat_id !== undefined) params.chat_id = chat_id;
        await tgCall("setChatMenuButton", params);
        return ok(`Menu button updated.\n\n${formatResult({ success: true })}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // get_chat_menu_button
  server.tool(
    "get_chat_menu_button",
    "Get the current menu button for a private chat or default.",
    {
      chat_id: z.number().optional().describe("User ID for private chat (optional - if omitted, returns default)"),
    },
    async ({ chat_id }) => {
      try {
        const params = {};
        if (chat_id !== undefined) params.chat_id = chat_id;
        const result = await tgCall("getChatMenuButton", params);
        return ok(`Chat menu button:\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );
}

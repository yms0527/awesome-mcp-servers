import { z } from "zod";
import {
  tgCall, resolveChatId, formatResult, parseJSON, ok, err, BOT_TOKEN
} from "../../utils/api.js";

// ─── Delete, Pin, Reaction, File, Poll Methods ────────────────────────────────

export function registerMessageManageTools(server) {
  // delete_message
  server.tool(
    "delete_message",
    "Delete a message from a chat. Bot must have delete permissions. If chat_id is omitted, targets the default log group.",
    {
      chat_id: z.union([z.string(), z.number()]).optional()
        .describe("Chat ID or @channel_username. Optional — defaults to log group"),
      message_id: z.number().describe("ID of the message to delete"),
    },
    async ({ chat_id, message_id }) => {
      try {
        await tgCall("deleteMessage", { chat_id: resolveChatId(chat_id), message_id });
        return ok(`Message ${message_id} deleted.`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // delete_messages
  server.tool(
    "delete_messages",
    "Delete multiple messages in a chat (up to 100 at once).",
    {
      chat_id: z.union([z.string(), z.number()]).optional()
        .describe("Chat ID or @channel_username. Optional — defaults to log group"),
      message_ids: z.string().describe("JSON array of message IDs to delete (up to 100)"),
    },
    async ({ chat_id, message_ids }) => {
      try {
        let ids;
        try {
          ids = JSON.parse(message_ids);
          if (!Array.isArray(ids) || !ids.every(id => typeof id === "number")) {
            throw new Error("Invalid format");
          }
        } catch {
          return err("message_ids must be a valid JSON array of numbers, e.g. [1, 2, 3]");
        }
        const result = await tgCall("deleteMessages", {
          chat_id: resolveChatId(chat_id),
          message_ids: ids,
        });
        return ok(`${ids.length} message(s) deleted!\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // pin_message
  server.tool(
    "pin_message",
    "Pin a message in a chat. Bot must have pin permissions. If chat_id is omitted, targets the default log group.",
    {
      chat_id: z.union([z.string(), z.number()]).optional()
        .describe("Chat ID or @channel_username. Optional — defaults to log group"),
      message_id: z.number().describe("ID of the message to pin"),
      disable_notification: z.boolean().optional()
        .describe("Pin silently without notification"),
    },
    async ({ chat_id, message_id, disable_notification }) => {
      try {
        const params = { chat_id: resolveChatId(chat_id), message_id };
        if (disable_notification) params.disable_notification = true;
        await tgCall("pinChatMessage", params);
        return ok(`Message ${message_id} pinned.`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // unpin_message
  server.tool(
    "unpin_message",
    "Unpin a message in a chat. If message_id is not specified, unpin the last pinned message. If chat_id is omitted, targets the default log group.",
    {
      chat_id: z.union([z.string(), z.number()]).optional()
        .describe("Chat ID or @channel_username. Optional — defaults to log group"),
      message_id: z.number().optional()
        .describe("ID of the message to unpin. Optional — if omitted, unpin the last pinned message."),
    },
    async ({ chat_id, message_id }) => {
      try {
        const params = { chat_id: resolveChatId(chat_id) };
        if (message_id !== undefined) params.message_id = message_id;
        await tgCall("unpinChatMessage", params);
        return ok(`Message ${message_id ? message_id : "(last pinned)"} unpinned.`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // unpin_all_chat_messages
  server.tool(
    "unpin_all_chat_messages",
    "Unpin all messages in a chat. If chat_id is omitted, targets the default log group.",
    {
      chat_id: z.union([z.string(), z.number()]).optional()
        .describe("Chat ID or @channel_username. Optional — defaults to log group"),
    },
    async ({ chat_id }) => {
      try {
        await tgCall("unpinAllChatMessages", { chat_id: resolveChatId(chat_id) });
        return ok(`All messages unpinned.`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // set_message_reaction
  server.tool(
    "set_message_reaction",
    "Set a reaction on a message.",
    {
      chat_id: z.union([z.string(), z.number()]).optional().describe("Chat ID (defaults to log group)"),
      message_id: z.number().describe("Message ID"),
      reaction: z.string().optional().describe("JSON array of ReactionType objects"),
      is_big: z.boolean().optional().describe("Show reaction as big animation"),
    },
    async ({ chat_id, message_id, reaction, is_big }) => {
      try {
        const params = { chat_id: resolveChatId(chat_id), message_id };
        if (reaction) params.reaction = parseJSON(reaction);
        if (is_big !== undefined) params.is_big = is_big;
        const result = await tgCall("setMessageReaction", params);
        return ok(`Reaction set.\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // get_file
  server.tool(
    "get_file",
    "Get information about a file stored on Telegram servers. Returns file path for downloading.",
    {
      file_id: z.string().describe("File ID received from Telegram (e.g., from a photo, document, etc.)"),
    },
    async ({ file_id }) => {
      try {
        const result = await tgCall("getFile", { file_id });
        const downloadUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${result.file_path}`;
        return ok(`File info retrieved!\n\nFile path: ${result.file_path}\nFile size: ${result.file_size} bytes\n\nDownload URL:\n${downloadUrl}\n\n---\nRaw:\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // stop_poll
  server.tool(
    "stop_poll",
    "Stop a poll and mark it as closed. If chat_id is omitted, targets the default log group.",
    {
      chat_id: z.union([z.string(), z.number()]).optional()
        .describe("Chat ID or @channel_username. Optional — defaults to log group"),
      message_id: z.number().describe("ID of the poll message to stop"),
      reply_markup: z.string().optional().describe("JSON string with inline keyboard markup"),
    },
    async ({ chat_id, message_id, reply_markup }) => {
      try {
        const params = { chat_id: resolveChatId(chat_id), message_id };
        if (reply_markup) params.reply_markup = parseJSON(reply_markup);
        const result = await tgCall("stopPoll", params);
        return ok(`Poll stopped!\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );
}

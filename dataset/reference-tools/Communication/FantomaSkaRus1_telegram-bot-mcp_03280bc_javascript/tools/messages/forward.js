import { z } from "zod";
import {
  tgCall, resolveChatId, resolveThreadId,
  formatResult, parseJSON, ok, err
} from "../../utils/api.js";

// ─── Forward & Copy Methods ────────────────────────────────────────────────────

export function registerMessageForwardTools(server) {
  // forward_message
  server.tool(
    "forward_message",
    "Forward a message from one chat to another. If chat_id is omitted, forwards to the default log group.",
    {
      chat_id: z.union([z.string(), z.number()]).optional()
        .describe("Target chat ID. Optional — defaults to log group"),
      from_chat_id: z.union([z.string(), z.number()]).describe("Source chat ID"),
      message_id: z.number().describe("Message ID to forward"),
      message_thread_id: z.number().optional()
        .describe("Topic/thread ID for supergroups with topics enabled"),
      disable_notification: z.boolean().optional().describe("Send silently without notification"),
      protect_content: z.boolean().optional().describe("Protect message from forwarding/saving"),
    },
    async ({ chat_id, from_chat_id, message_id, message_thread_id, disable_notification, protect_content }) => {
      try {
        const resolvedThreadId = resolveThreadId(chat_id, message_thread_id);
        const params = { chat_id: resolveChatId(chat_id), from_chat_id, message_id };
        if (resolvedThreadId) params.message_thread_id = resolvedThreadId;
        if (disable_notification) params.disable_notification = true;
        if (protect_content) params.protect_content = true;
        const result = await tgCall("forwardMessage", params);
        return ok(`Message forwarded! New ID: ${result.message_id}\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // forward_messages
  server.tool(
    "forward_messages",
    "Forward multiple messages from one chat to another.",
    {
      chat_id: z.union([z.string(), z.number()]).optional()
        .describe("Target chat ID. Optional — defaults to log group"),
      from_chat_id: z.union([z.string(), z.number()]).describe("Source chat ID"),
      message_ids: z.string().describe("JSON array of message IDs to forward"),
      message_thread_id: z.number().optional()
        .describe("Topic/thread ID for supergroups with topics enabled"),
      disable_notification: z.boolean().optional().describe("Send silently"),
      protect_content: z.boolean().optional().describe("Protect from forwarding"),
    },
    async ({ chat_id, from_chat_id, message_ids, message_thread_id, disable_notification, protect_content }) => {
      try {
        const resolvedThreadId = resolveThreadId(chat_id, message_thread_id);
        const params = {
          chat_id: resolveChatId(chat_id),
          from_chat_id,
          message_ids: parseJSON(message_ids),
        };
        if (resolvedThreadId) params.message_thread_id = resolvedThreadId;
        if (disable_notification) params.disable_notification = true;
        if (protect_content) params.protect_content = true;
        const result = await tgCall("forwardMessages", params);
        return ok(`Messages forwarded.\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // copy_message
  server.tool(
    "copy_message",
    "Copy a message from one chat to another. Can copy any message type. If chat_id is omitted, copies to the default log group.",
    {
      chat_id: z.union([z.string(), z.number()]).optional()
        .describe("Target chat ID. Optional — defaults to log group"),
      from_chat_id: z.union([z.string(), z.number()]).describe("Source chat ID"),
      message_id: z.number().describe("Message ID to copy"),
      caption: z.string().optional().describe("New caption for the copied message (up to 1024 chars)"),
      parse_mode: z.enum(["Markdown", "MarkdownV2", "HTML"]).optional()
        .describe("Caption formatting mode"),
      caption_entities: z.string().optional().describe("JSON array of MessageEntity objects for caption (alternative to parse_mode)"),
      show_caption_above_media: z.boolean().optional().describe("Show caption above media"),
      message_thread_id: z.number().optional()
        .describe("Topic/thread ID for supergroups with topics enabled"),
      disable_notification: z.boolean().optional().describe("Send silently without notification"),
      protect_content: z.boolean().optional().describe("Protect message from forwarding/saving"),
      reply_parameters: z.string().optional().describe("JSON object with ReplyParameters (e.g. {\"message_id\": 123})"),
      reply_markup: z.string().optional().describe("JSON string with reply markup (inline keyboard, custom keyboard, etc.)"),
    },
    async ({ chat_id, from_chat_id, message_id, caption, parse_mode, caption_entities, show_caption_above_media, message_thread_id, disable_notification, protect_content, reply_parameters, reply_markup }) => {
      try {
        const resolvedThreadId = resolveThreadId(chat_id, message_thread_id);
        const params = { chat_id: resolveChatId(chat_id), from_chat_id, message_id };
        if (caption !== undefined) params.caption = caption;
        if (parse_mode) params.parse_mode = parse_mode;
        if (caption_entities) params.caption_entities = parseJSON(caption_entities);
        if (show_caption_above_media !== undefined) params.show_caption_above_media = show_caption_above_media;
        if (resolvedThreadId) params.message_thread_id = resolvedThreadId;
        if (disable_notification) params.disable_notification = true;
        if (protect_content) params.protect_content = true;
        if (reply_parameters) params.reply_parameters = parseJSON(reply_parameters);
        if (reply_markup) params.reply_markup = parseJSON(reply_markup);
        const result = await tgCall("copyMessage", params);
        return ok(`Message copied! New ID: ${result.message_id}\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // copy_messages
  server.tool(
    "copy_messages",
    "Copy multiple messages from one chat to another.",
    {
      chat_id: z.union([z.string(), z.number()]).optional()
        .describe("Target chat ID or @channel_username. Optional — defaults to log group"),
      from_chat_id: z.union([z.string(), z.number()])
        .describe("Source chat ID or @channel_username"),
      message_ids: z.string().describe("JSON array of message IDs to copy"),
      message_thread_id: z.number().optional()
        .describe("Topic/thread ID for supergroups with topics enabled"),
      disable_notification: z.boolean().optional().describe("Send silently without notification"),
      protect_content: z.boolean().optional().describe("Protect messages from forwarding/saving"),
      remove_caption: z.boolean().optional().describe("Remove captions from copied messages"),
    },
    async ({ chat_id, from_chat_id, message_ids, message_thread_id, disable_notification, protect_content, remove_caption }) => {
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

        const resolvedThreadId = resolveThreadId(chat_id, message_thread_id);
        const params = {
          chat_id: resolveChatId(chat_id),
          from_chat_id,
          message_ids: ids,
        };
        if (resolvedThreadId) params.message_thread_id = resolvedThreadId;
        if (disable_notification) params.disable_notification = true;
        if (protect_content) params.protect_content = true;
        if (remove_caption !== undefined) params.remove_caption = remove_caption;
        const result = await tgCall("copyMessages", params);
        return ok(`${ids.length} message(s) copied!\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );
}

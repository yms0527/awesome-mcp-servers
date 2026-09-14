import { z } from "zod";
import {
  tgCall, resolveChatId, formatResult, parseJSON, ok, err
} from "../../utils/api.js";

// ─── Edit Methods ──────────────────────────────────────────────────────────────

export function registerMessageEditTools(server) {
  // edit_message
  server.tool(
    "edit_message",
    "Edit a previously sent text message. If chat_id is omitted, targets the default log group.",
    {
      chat_id: z.union([z.string(), z.number()]).optional()
        .describe("Chat ID or @channel_username. Optional — defaults to log group"),
      message_id: z.number().optional().describe("ID of the message to edit (required if inline_message_id not provided)"),
      inline_message_id: z.string().optional().describe("Inline message ID (required if chat_id/message_id not provided)"),
      text: z.string().describe("New message text"),
      parse_mode: z.enum(["Markdown", "MarkdownV2", "HTML"]).optional()
        .describe("Text formatting mode"),
      entities: z.string().optional().describe("JSON array of MessageEntity objects (alternative to parse_mode)"),
      link_preview_options: z.string().optional().describe("JSON object with link preview options (e.g. {\"is_disabled\": true})"),
      reply_markup: z.string().optional().describe("JSON string with inline keyboard markup"),
    },
    async ({ chat_id, message_id, inline_message_id, text, parse_mode, entities, link_preview_options, reply_markup }) => {
      try {
        const params = { text };
        if (!inline_message_id) {
          params.chat_id = resolveChatId(chat_id);
          if (message_id) params.message_id = message_id;
        } else {
          params.inline_message_id = inline_message_id;
        }
        if (parse_mode) params.parse_mode = parse_mode;
        if (entities) params.entities = parseJSON(entities);
        if (link_preview_options) params.link_preview_options = parseJSON(link_preview_options);
        if (reply_markup) params.reply_markup = parseJSON(reply_markup);
        const result = await tgCall("editMessageText", params);
        return ok(`Message edited!\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // edit_message_caption
  server.tool(
    "edit_message_caption",
    "Edit caption of a previously sent message with media. If chat_id is omitted, targets the default log group.",
    {
      chat_id: z.union([z.string(), z.number()]).optional()
        .describe("Chat ID or @channel_username. Optional — defaults to log group"),
      message_id: z.number().optional().describe("ID of the message to edit (required if inline_message_id not provided)"),
      inline_message_id: z.string().optional().describe("Inline message ID (required if chat_id/message_id not provided)"),
      caption: z.string().optional().describe("New caption text (up to 1024 characters)"),
      parse_mode: z.enum(["Markdown", "MarkdownV2", "HTML"]).optional()
        .describe("Caption formatting mode"),
      caption_entities: z.string().optional().describe("JSON array of MessageEntity objects (alternative to parse_mode)"),
      reply_markup: z.string().optional().describe("JSON string with inline keyboard markup"),
    },
    async ({ chat_id, message_id, inline_message_id, caption, parse_mode, caption_entities, reply_markup }) => {
      try {
        const params = {};
        if (!inline_message_id) {
          params.chat_id = resolveChatId(chat_id);
          if (message_id) params.message_id = message_id;
        } else {
          params.inline_message_id = inline_message_id;
        }
        if (caption !== undefined) params.caption = caption;
        if (parse_mode) params.parse_mode = parse_mode;
        if (caption_entities) params.caption_entities = parseJSON(caption_entities);
        if (reply_markup) params.reply_markup = parseJSON(reply_markup);
        const result = await tgCall("editMessageCaption", params);
        return ok(`Message caption edited!\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // edit_message_media
  server.tool(
    "edit_message_media",
    "Edit media content of a previously sent message. Pass a JSON string as media parameter with InputMedia object.",
    {
      chat_id: z.union([z.string(), z.number()]).optional()
        .describe("Chat ID or @channel_username. Optional — defaults to log group"),
      message_id: z.number().optional().describe("ID of the message to edit (required if inline_message_id not provided)"),
      inline_message_id: z.string().optional().describe("Inline message ID (required if chat_id/message_id not provided)"),
      media: z.string().describe("JSON string with InputMedia object (type, media, caption, etc.)"),
      reply_markup: z.string().optional().describe("JSON string with inline keyboard markup"),
    },
    async ({ chat_id, message_id, inline_message_id, media, reply_markup }) => {
      try {
        const params = { media: parseJSON(media) };
        if (!inline_message_id) {
          params.chat_id = resolveChatId(chat_id);
          if (message_id) params.message_id = message_id;
        } else {
          params.inline_message_id = inline_message_id;
        }
        if (reply_markup) params.reply_markup = parseJSON(reply_markup);
        const result = await tgCall("editMessageMedia", params);
        return ok(`Message media edited!\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // edit_message_reply_markup
  server.tool(
    "edit_message_reply_markup",
    "Edit only the reply markup (inline keyboard) of a previously sent message. If chat_id is omitted, targets the default log group.",
    {
      chat_id: z.union([z.string(), z.number()]).optional()
        .describe("Chat ID or @channel_username. Optional — defaults to log group"),
      message_id: z.number().optional().describe("ID of the message to edit (required if inline_message_id not provided)"),
      inline_message_id: z.string().optional().describe("Inline message ID (required if chat_id/message_id not provided)"),
      reply_markup: z.string().optional().describe("JSON string with inline keyboard markup"),
    },
    async ({ chat_id, message_id, inline_message_id, reply_markup }) => {
      try {
        const params = {};
        if (!inline_message_id) {
          params.chat_id = resolveChatId(chat_id);
          if (message_id) params.message_id = message_id;
        } else {
          params.inline_message_id = inline_message_id;
        }
        if (reply_markup) params.reply_markup = parseJSON(reply_markup);
        const result = await tgCall("editMessageReplyMarkup", params);
        return ok(`Message reply markup edited!\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // edit_message_live_location
  server.tool(
    "edit_message_live_location",
    "Edit a live location message. The location must be live (sent with live_period). If chat_id is omitted, targets the default log group.",
    {
      chat_id: z.union([z.string(), z.number()]).optional()
        .describe("Chat ID or @channel_username. Optional — defaults to log group"),
      message_id: z.number().optional().describe("ID of the message to edit (required if inline_message_id not provided)"),
      inline_message_id: z.string().optional().describe("Inline message ID (required if chat_id/message_id not provided)"),
      latitude: z.number().describe("New latitude"),
      longitude: z.number().describe("New longitude"),
      horizontal_accuracy: z.number().optional().describe("Radius of uncertainty in meters (0-1500)"),
      heading: z.number().optional().describe("Direction in which the user is moving (0-360)"),
      proximity_alert_radius: z.number().optional().describe("Maximum distance for proximity alerts in meters"),
      reply_markup: z.string().optional().describe("JSON string with inline keyboard markup"),
    },
    async ({ chat_id, message_id, inline_message_id, latitude, longitude, horizontal_accuracy, heading, proximity_alert_radius, reply_markup }) => {
      try {
        const params = { latitude, longitude };
        if (!inline_message_id) {
          params.chat_id = resolveChatId(chat_id);
          if (message_id) params.message_id = message_id;
        } else {
          params.inline_message_id = inline_message_id;
        }
        if (horizontal_accuracy !== undefined) params.horizontal_accuracy = horizontal_accuracy;
        if (heading !== undefined) params.heading = heading;
        if (proximity_alert_radius !== undefined) params.proximity_alert_radius = proximity_alert_radius;
        if (reply_markup) params.reply_markup = parseJSON(reply_markup);
        const result = await tgCall("editMessageLiveLocation", params);
        return ok(`Live location updated!\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // stop_message_live_location
  server.tool(
    "stop_message_live_location",
    "Stop updating a live location message. If chat_id is omitted, targets the default log group.",
    {
      chat_id: z.union([z.string(), z.number()]).optional()
        .describe("Chat ID or @channel_username. Optional — defaults to log group"),
      message_id: z.number().optional().describe("ID of the message to edit (required if inline_message_id not provided)"),
      inline_message_id: z.string().optional().describe("Inline message ID (required if chat_id/message_id not provided)"),
      reply_markup: z.string().optional().describe("JSON string with inline keyboard markup"),
    },
    async ({ chat_id, message_id, inline_message_id, reply_markup }) => {
      try {
        const params = {};
        if (!inline_message_id) {
          params.chat_id = resolveChatId(chat_id);
          if (message_id) params.message_id = message_id;
        } else {
          params.inline_message_id = inline_message_id;
        }
        if (reply_markup) params.reply_markup = parseJSON(reply_markup);
        const result = await tgCall("stopMessageLiveLocation", params);
        return ok(`Live location stopped!\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // edit_message_checklist
  server.tool(
    "edit_message_checklist",
    "Edit a checklist message.",
    {
      chat_id: z.union([z.string(), z.number()]).optional()
        .describe("Chat ID. Optional — defaults to log group"),
      message_id: z.number().optional().describe("Message ID to edit (required if inline_message_id not provided)"),
      inline_message_id: z.string().optional().describe("Inline message ID (required if chat_id/message_id not provided)"),
      checklist: z.string().describe("JSON InputChecklist object"),
      reply_markup: z.string().optional().describe("JSON string with inline keyboard markup"),
    },
    async ({ chat_id, message_id, inline_message_id, checklist, reply_markup }) => {
      try {
        const params = { checklist: parseJSON(checklist) };
        if (!inline_message_id) {
          params.chat_id = resolveChatId(chat_id);
          if (message_id) params.message_id = message_id;
        } else {
          params.inline_message_id = inline_message_id;
        }
        if (reply_markup) params.reply_markup = parseJSON(reply_markup);
        const result = await tgCall("editMessageChecklist", params);
        return ok(`Checklist updated.\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // edit_business_message_text
  server.tool(
    "edit_business_message_text",
    "Edit a text message sent on behalf of a business account.",
    {
      business_connection_id: z.string().describe("Business connection ID"),
      chat_id: z.union([z.string(), z.number()]).describe("Chat ID of the message"),
      message_id: z.number().describe("ID of the message to edit"),
      text: z.string().describe("New message text"),
      parse_mode: z.enum(["Markdown", "MarkdownV2", "HTML"]).optional()
        .describe("Text formatting mode"),
      reply_markup: z.string().optional().describe("JSON string with inline keyboard markup"),
    },
    async ({ business_connection_id, chat_id, message_id, text, parse_mode, reply_markup }) => {
      try {
        const params = { business_connection_id, chat_id, message_id, text };
        if (parse_mode) params.parse_mode = parse_mode;
        if (reply_markup) params.reply_markup = parseJSON(reply_markup);
        const result = await tgCall("editMessageText", params);
        return ok(`Business message edited!\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // edit_business_message_caption
  server.tool(
    "edit_business_message_caption",
    "Edit caption of a media message sent on behalf of a business account.",
    {
      business_connection_id: z.string().describe("Business connection ID"),
      chat_id: z.union([z.string(), z.number()]).describe("Chat ID of the message"),
      message_id: z.number().describe("ID of the message to edit"),
      caption: z.string().describe("New caption text (up to 1024 characters)"),
      parse_mode: z.enum(["Markdown", "MarkdownV2", "HTML"]).optional()
        .describe("Caption formatting mode"),
      reply_markup: z.string().optional().describe("JSON string with inline keyboard markup"),
    },
    async ({ business_connection_id, chat_id, message_id, caption, parse_mode, reply_markup }) => {
      try {
        const params = { business_connection_id, chat_id, message_id, caption };
        if (parse_mode) params.parse_mode = parse_mode;
        if (reply_markup) params.reply_markup = parseJSON(reply_markup);
        const result = await tgCall("editMessageCaption", params);
        return ok(`Business message caption edited!\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // edit_business_message_media
  server.tool(
    "edit_business_message_media",
    "Edit media content of a message sent on behalf of a business account.",
    {
      business_connection_id: z.string().describe("Business connection ID"),
      chat_id: z.union([z.string(), z.number()]).describe("Chat ID of the message"),
      message_id: z.number().describe("ID of the message to edit"),
      media: z.string().describe("JSON string with InputMedia object (type, media, caption, etc.)"),
      reply_markup: z.string().optional().describe("JSON string with inline keyboard markup"),
    },
    async ({ business_connection_id, chat_id, message_id, media, reply_markup }) => {
      try {
        const params = { business_connection_id, chat_id, message_id, media: parseJSON(media) };
        if (reply_markup) params.reply_markup = parseJSON(reply_markup);
        const result = await tgCall("editMessageMedia", params);
        return ok(`Business message media edited!\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );
}

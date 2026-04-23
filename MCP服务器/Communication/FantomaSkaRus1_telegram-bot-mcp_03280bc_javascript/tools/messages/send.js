import { z } from "zod";
import {
  tgCall, tgUpload, resolveChatId, resolveThreadId,
  formatResult, parseJSON, ok, err, isFilePath
} from "../../utils/api.js";

// ─── Send Methods ──────────────────────────────────────────────────────────────

export function registerMessageSendTools(server) {
  // send_message
  server.tool(
    "send_message",
    "Send a text message to a Telegram chat. Supports Markdown and HTML formatting. If chat_id is omitted, sends to the default log group.",
    {
      chat_id: z.union([z.string(), z.number()]).optional()
        .describe("Chat ID or @channel_username. Optional — defaults to log group"),
      text: z.string().describe("Message text (up to 4096 characters)"),
      parse_mode: z.enum(["Markdown", "MarkdownV2", "HTML"]).optional()
        .describe("Text formatting mode. Default: none"),
      entities: z.string().optional().describe("JSON array of MessageEntity objects (alternative to parse_mode)"),
      link_preview_options: z.string().optional().describe("JSON object with link preview options (e.g. {\"is_disabled\": true})"),
      disable_notification: z.boolean().optional()
        .describe("Send silently without notification"),
      protect_content: z.boolean().optional().describe("Protect message from forwarding/saving"),
      message_thread_id: z.number().optional()
        .describe("Topic/thread ID for supergroups with topics enabled"),
      reply_parameters: z.string().optional().describe("JSON object with ReplyParameters (e.g. {\"message_id\": 123})"),
      reply_markup: z.string().optional().describe("JSON string with reply markup (inline keyboard, custom keyboard, etc.)"),
      message_effect_id: z.string().optional().describe("Unique identifier of the message effect to apply"),
    },
    async ({ chat_id, text, parse_mode, entities, link_preview_options, disable_notification, protect_content, message_thread_id, reply_parameters, reply_markup, message_effect_id }) => {
      try {
        const resolvedThreadId = resolveThreadId(chat_id, message_thread_id);
        const params = { chat_id: resolveChatId(chat_id), text };
        if (parse_mode) params.parse_mode = parse_mode;
        if (entities) params.entities = parseJSON(entities);
        if (link_preview_options) params.link_preview_options = parseJSON(link_preview_options);
        if (disable_notification) params.disable_notification = true;
        if (protect_content) params.protect_content = true;
        if (resolvedThreadId) params.message_thread_id = resolvedThreadId;
        if (reply_parameters) params.reply_parameters = parseJSON(reply_parameters);
        if (reply_markup) params.reply_markup = parseJSON(reply_markup);
        if (message_effect_id) params.message_effect_id = message_effect_id;
        const result = await tgCall("sendMessage", params);
        return ok(`Message sent! ID: ${result.message_id}\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // send_photo
  server.tool(
    "send_photo",
    "Send a photo to a Telegram chat. Can send from URL or local file path. If chat_id is omitted, sends to the default log group.",
    {
      chat_id: z.union([z.string(), z.number()]).optional()
        .describe("Chat ID or @channel_username. Optional — defaults to log group"),
      photo: z.string().describe("Photo URL, file_id or absolute local file path"),
      caption: z.string().optional().describe("Photo caption (up to 1024 chars)"),
      parse_mode: z.enum(["Markdown", "MarkdownV2", "HTML"]).optional()
        .describe("Caption formatting mode"),
      caption_entities: z.string().optional().describe("JSON array of MessageEntity objects (alternative to parse_mode)"),
      show_caption_above_media: z.boolean().optional().describe("Show caption above media"),
      has_spoiler: z.boolean().optional().describe("Cover photo with spoiler animation"),
      message_thread_id: z.number().optional()
        .describe("Topic/thread ID for supergroups with topics enabled"),
      disable_notification: z.boolean().optional().describe("Send silently without notification"),
      protect_content: z.boolean().optional().describe("Protect message from forwarding/saving"),
      reply_parameters: z.string().optional().describe("JSON object with ReplyParameters (e.g. {\"message_id\": 123})"),
      reply_markup: z.string().optional().describe("JSON string with reply markup"),
      message_effect_id: z.string().optional().describe("Unique identifier of the message effect to apply"),
    },
    async ({ chat_id, photo, caption, parse_mode, caption_entities, show_caption_above_media, has_spoiler, message_thread_id, disable_notification, protect_content, reply_parameters, reply_markup, message_effect_id }) => {
      try {
        const resolved = resolveChatId(chat_id);
        const resolvedThreadId = resolveThreadId(chat_id, message_thread_id);
        const isFile = isFilePath(photo);

        const params = { chat_id: resolved };
        if (!isFile) params.photo = photo;
        if (caption) params.caption = caption;
        if (parse_mode) params.parse_mode = parse_mode;
        if (caption_entities) params.caption_entities = parseJSON(caption_entities);
        if (show_caption_above_media !== undefined) params.show_caption_above_media = show_caption_above_media;
        if (has_spoiler !== undefined) params.has_spoiler = has_spoiler;
        if (resolvedThreadId) params.message_thread_id = resolvedThreadId;
        if (disable_notification) params.disable_notification = true;
        if (protect_content) params.protect_content = true;
        if (reply_parameters) params.reply_parameters = parseJSON(reply_parameters);
        if (reply_markup) params.reply_markup = parseJSON(reply_markup);

        if (message_effect_id) params.message_effect_id = message_effect_id;
        const result = isFile
          ? await tgUpload("sendPhoto", photo, "photo", params)
          : await tgCall("sendPhoto", params);

        return ok(`Photo sent! ID: ${result.message_id}\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // send_document
  server.tool(
    "send_document",
    "Send a file/document to a Telegram chat. Can send from URL, file_id or local file path. If chat_id is omitted, sends to the default log group.",
    {
      chat_id: z.union([z.string(), z.number()]).optional()
        .describe("Chat ID or @channel_username. Optional — defaults to log group"),
      document: z.string().describe("Document URL, file_id or absolute local file path"),
      caption: z.string().optional().describe("Document caption (up to 1024 chars)"),
      parse_mode: z.enum(["Markdown", "MarkdownV2", "HTML"]).optional()
        .describe("Caption formatting mode"),
      caption_entities: z.string().optional().describe("JSON array of MessageEntity objects (alternative to parse_mode)"),
      disable_content_type_detection: z.boolean().optional().describe("Disable automatic content type detection for uploaded files"),
      message_thread_id: z.number().optional()
        .describe("Topic/thread ID for supergroups with topics enabled"),
      disable_notification: z.boolean().optional().describe("Send silently without notification"),
      protect_content: z.boolean().optional().describe("Protect message from forwarding/saving"),
      reply_parameters: z.string().optional().describe("JSON object with ReplyParameters (e.g. {\"message_id\": 123})"),
      reply_markup: z.string().optional().describe("JSON string with reply markup"),
      message_effect_id: z.string().optional().describe("Unique identifier of the message effect to apply"),
    },
    async ({ chat_id, document, caption, parse_mode, caption_entities, disable_content_type_detection, message_thread_id, disable_notification, protect_content, reply_parameters, reply_markup, message_effect_id }) => {
      try {
        const resolvedThreadId = resolveThreadId(chat_id, message_thread_id);
        const isFile = isFilePath(document);

        const params = { chat_id: resolveChatId(chat_id) };
        if (!isFile) params.document = document;
        if (caption) params.caption = caption;
        if (parse_mode) params.parse_mode = parse_mode;
        if (caption_entities) params.caption_entities = parseJSON(caption_entities);
        if (disable_content_type_detection !== undefined) params.disable_content_type_detection = disable_content_type_detection;
        if (resolvedThreadId) params.message_thread_id = resolvedThreadId;
        if (disable_notification) params.disable_notification = true;
        if (protect_content) params.protect_content = true;
        if (reply_parameters) params.reply_parameters = parseJSON(reply_parameters);
        if (reply_markup) params.reply_markup = parseJSON(reply_markup);

        if (message_effect_id) params.message_effect_id = message_effect_id;
        const result = isFile
          ? await tgUpload("sendDocument", document, "document", params)
          : await tgCall("sendDocument", params);

        return ok(`Document sent! ID: ${result.message_id}\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // send_video
  server.tool(
    "send_video",
    "Send a video to a Telegram chat. Can send from URL or local file path. If chat_id is omitted, sends to the default log group.",
    {
      chat_id: z.union([z.string(), z.number()]).optional()
        .describe("Chat ID or @channel_username. Optional — defaults to log group"),
      video: z.string().describe("Video URL, file_id or absolute local file path"),
      caption: z.string().optional().describe("Video caption (up to 1024 chars)"),
      parse_mode: z.enum(["Markdown", "MarkdownV2", "HTML"]).optional()
        .describe("Caption formatting mode"),
      caption_entities: z.string().optional().describe("JSON array of MessageEntity objects (alternative to parse_mode)"),
      show_caption_above_media: z.boolean().optional().describe("Show caption above media"),
      duration: z.number().optional().describe("Video duration in seconds"),
      width: z.number().optional().describe("Video width"),
      height: z.number().optional().describe("Video height"),
      supports_streaming: z.boolean().optional().describe("Video suitable for streaming"),
      has_spoiler: z.boolean().optional().describe("Cover video with spoiler animation"),
      message_thread_id: z.number().optional()
        .describe("Topic/thread ID for supergroups with topics enabled"),
      disable_notification: z.boolean().optional().describe("Send silently without notification"),
      protect_content: z.boolean().optional().describe("Protect message from forwarding/saving"),
      reply_parameters: z.string().optional().describe("JSON object with ReplyParameters (e.g. {\"message_id\": 123})"),
      reply_markup: z.string().optional().describe("JSON string with reply markup"),
      message_effect_id: z.string().optional().describe("Unique identifier of the message effect to apply"),
    },
    async ({ chat_id, video, caption, parse_mode, caption_entities, show_caption_above_media, duration, width, height, supports_streaming, has_spoiler, message_thread_id, disable_notification, protect_content, reply_parameters, reply_markup, message_effect_id }) => {
      try {
        const resolved = resolveChatId(chat_id);
        const resolvedThreadId = resolveThreadId(chat_id, message_thread_id);
        const isFile = isFilePath(video);

        const params = { chat_id: resolved };
        if (!isFile) params.video = video;
        if (caption) params.caption = caption;
        if (parse_mode) params.parse_mode = parse_mode;
        if (caption_entities) params.caption_entities = parseJSON(caption_entities);
        if (show_caption_above_media !== undefined) params.show_caption_above_media = show_caption_above_media;
        if (duration !== undefined) params.duration = duration;
        if (width !== undefined) params.width = width;
        if (height !== undefined) params.height = height;
        if (supports_streaming !== undefined) params.supports_streaming = supports_streaming;
        if (has_spoiler !== undefined) params.has_spoiler = has_spoiler;
        if (resolvedThreadId) params.message_thread_id = resolvedThreadId;
        if (disable_notification) params.disable_notification = true;
        if (protect_content) params.protect_content = true;
        if (reply_parameters) params.reply_parameters = parseJSON(reply_parameters);
        if (reply_markup) params.reply_markup = parseJSON(reply_markup);

        if (message_effect_id) params.message_effect_id = message_effect_id;
        const result = isFile
          ? await tgUpload("sendVideo", video, "video", params)
          : await tgCall("sendVideo", params);

        return ok(`Video sent! ID: ${result.message_id}\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // send_audio
  server.tool(
    "send_audio",
    "Send an audio file to a Telegram chat. Can send from URL or local file path. If chat_id is omitted, sends to the default log group.",
    {
      chat_id: z.union([z.string(), z.number()]).optional()
        .describe("Chat ID or @channel_username. Optional — defaults to log group"),
      audio: z.string().describe("Audio URL, file_id or absolute local file path"),
      caption: z.string().optional().describe("Audio caption (up to 1024 chars)"),
      parse_mode: z.enum(["Markdown", "MarkdownV2", "HTML"]).optional()
        .describe("Caption formatting mode"),
      caption_entities: z.string().optional().describe("JSON array of MessageEntity objects (alternative to parse_mode)"),
      duration: z.number().optional().describe("Audio duration in seconds"),
      performer: z.string().optional().describe("Performer name"),
      title: z.string().optional().describe("Track title"),
      message_thread_id: z.number().optional()
        .describe("Topic/thread ID for supergroups with topics enabled"),
      disable_notification: z.boolean().optional().describe("Send silently without notification"),
      protect_content: z.boolean().optional().describe("Protect message from forwarding/saving"),
      reply_parameters: z.string().optional().describe("JSON object with ReplyParameters (e.g. {\"message_id\": 123})"),
      reply_markup: z.string().optional().describe("JSON string with reply markup"),
      message_effect_id: z.string().optional().describe("Unique identifier of the message effect to apply"),
    },
    async ({ chat_id, audio, caption, parse_mode, caption_entities, duration, performer, title, message_thread_id, disable_notification, protect_content, reply_parameters, reply_markup, message_effect_id }) => {
      try {
        const resolved = resolveChatId(chat_id);
        const resolvedThreadId = resolveThreadId(chat_id, message_thread_id);
        const isFile = isFilePath(audio);

        const params = { chat_id: resolved };
        if (!isFile) params.audio = audio;
        if (caption) params.caption = caption;
        if (parse_mode) params.parse_mode = parse_mode;
        if (caption_entities) params.caption_entities = parseJSON(caption_entities);
        if (duration !== undefined) params.duration = duration;
        if (performer) params.performer = performer;
        if (title) params.title = title;
        if (resolvedThreadId) params.message_thread_id = resolvedThreadId;
        if (disable_notification) params.disable_notification = true;
        if (protect_content) params.protect_content = true;
        if (reply_parameters) params.reply_parameters = parseJSON(reply_parameters);
        if (reply_markup) params.reply_markup = parseJSON(reply_markup);

        if (message_effect_id) params.message_effect_id = message_effect_id;
        const result = isFile
          ? await tgUpload("sendAudio", audio, "audio", params)
          : await tgCall("sendAudio", params);

        return ok(`Audio sent! ID: ${result.message_id}\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // send_voice
  server.tool(
    "send_voice",
    "Send a voice message to a Telegram chat. Can send from URL or local file path. If chat_id is omitted, sends to the default log group.",
    {
      chat_id: z.union([z.string(), z.number()]).optional()
        .describe("Chat ID or @channel_username. Optional — defaults to log group"),
      voice: z.string().describe("Voice file URL, file_id or absolute local file path"),
      caption: z.string().optional().describe("Voice caption (up to 1024 chars)"),
      parse_mode: z.enum(["Markdown", "MarkdownV2", "HTML"]).optional()
        .describe("Caption formatting mode"),
      caption_entities: z.string().optional().describe("JSON array of MessageEntity objects (alternative to parse_mode)"),
      duration: z.number().optional().describe("Voice duration in seconds"),
      message_thread_id: z.number().optional()
        .describe("Topic/thread ID for supergroups with topics enabled"),
      disable_notification: z.boolean().optional().describe("Send silently without notification"),
      protect_content: z.boolean().optional().describe("Protect message from forwarding/saving"),
      reply_parameters: z.string().optional().describe("JSON object with ReplyParameters (e.g. {\"message_id\": 123})"),
      reply_markup: z.string().optional().describe("JSON string with reply markup"),
      message_effect_id: z.string().optional().describe("Unique identifier of the message effect to apply"),
    },
    async ({ chat_id, voice, caption, parse_mode, caption_entities, duration, message_thread_id, disable_notification, protect_content, reply_parameters, reply_markup, message_effect_id }) => {
      try {
        const resolved = resolveChatId(chat_id);
        const resolvedThreadId = resolveThreadId(chat_id, message_thread_id);
        const isFile = isFilePath(voice);

        const params = { chat_id: resolved };
        if (!isFile) params.voice = voice;
        if (caption) params.caption = caption;
        if (parse_mode) params.parse_mode = parse_mode;
        if (caption_entities) params.caption_entities = parseJSON(caption_entities);
        if (duration !== undefined) params.duration = duration;
        if (resolvedThreadId) params.message_thread_id = resolvedThreadId;
        if (disable_notification) params.disable_notification = true;
        if (protect_content) params.protect_content = true;
        if (reply_parameters) params.reply_parameters = parseJSON(reply_parameters);
        if (reply_markup) params.reply_markup = parseJSON(reply_markup);

        if (message_effect_id) params.message_effect_id = message_effect_id;
        const result = isFile
          ? await tgUpload("sendVoice", voice, "voice", params)
          : await tgCall("sendVoice", params);

        return ok(`Voice sent! ID: ${result.message_id}\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // send_animation
  server.tool(
    "send_animation",
    "Send an animation (GIF) to a Telegram chat. Can send from URL or local file path. If chat_id is omitted, sends to the default log group.",
    {
      chat_id: z.union([z.string(), z.number()]).optional()
        .describe("Chat ID or @channel_username. Optional — defaults to log group"),
      animation: z.string().describe("Animation URL, file_id or absolute local file path"),
      caption: z.string().optional().describe("Animation caption (up to 1024 chars)"),
      parse_mode: z.enum(["Markdown", "MarkdownV2", "HTML"]).optional()
        .describe("Caption formatting mode"),
      caption_entities: z.string().optional().describe("JSON array of MessageEntity objects (alternative to parse_mode)"),
      show_caption_above_media: z.boolean().optional().describe("Show caption above media"),
      duration: z.number().optional().describe("Animation duration in seconds"),
      width: z.number().optional().describe("Animation width"),
      height: z.number().optional().describe("Animation height"),
      has_spoiler: z.boolean().optional().describe("Cover animation with spoiler"),
      message_thread_id: z.number().optional()
        .describe("Topic/thread ID for supergroups with topics enabled"),
      disable_notification: z.boolean().optional().describe("Send silently without notification"),
      protect_content: z.boolean().optional().describe("Protect message from forwarding/saving"),
      reply_parameters: z.string().optional().describe("JSON object with ReplyParameters (e.g. {\"message_id\": 123})"),
      reply_markup: z.string().optional().describe("JSON string with reply markup"),
      message_effect_id: z.string().optional().describe("Unique identifier of the message effect to apply"),
    },
    async ({ chat_id, animation, caption, parse_mode, caption_entities, show_caption_above_media, duration, width, height, has_spoiler, message_thread_id, disable_notification, protect_content, reply_parameters, reply_markup, message_effect_id }) => {
      try {
        const resolved = resolveChatId(chat_id);
        const resolvedThreadId = resolveThreadId(chat_id, message_thread_id);
        const isFile = isFilePath(animation);

        const params = { chat_id: resolved };
        if (!isFile) params.animation = animation;
        if (caption) params.caption = caption;
        if (parse_mode) params.parse_mode = parse_mode;
        if (caption_entities) params.caption_entities = parseJSON(caption_entities);
        if (show_caption_above_media !== undefined) params.show_caption_above_media = show_caption_above_media;
        if (duration !== undefined) params.duration = duration;
        if (width !== undefined) params.width = width;
        if (height !== undefined) params.height = height;
        if (has_spoiler !== undefined) params.has_spoiler = has_spoiler;
        if (resolvedThreadId) params.message_thread_id = resolvedThreadId;
        if (disable_notification) params.disable_notification = true;
        if (protect_content) params.protect_content = true;
        if (reply_parameters) params.reply_parameters = parseJSON(reply_parameters);
        if (reply_markup) params.reply_markup = parseJSON(reply_markup);

        if (message_effect_id) params.message_effect_id = message_effect_id;
        const result = isFile
          ? await tgUpload("sendAnimation", animation, "animation", params)
          : await tgCall("sendAnimation", params);

        return ok(`Animation sent! ID: ${result.message_id}\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // send_video_note
  server.tool(
    "send_video_note",
    "Send a video note (round video message) to a Telegram chat. Can send from URL or local file path. If chat_id is omitted, sends to the default log group.",
    {
      chat_id: z.union([z.string(), z.number()]).optional()
        .describe("Chat ID or @channel_username. Optional — defaults to log group"),
      video_note: z.string().describe("Video note URL, file_id or absolute local file path"),
      duration: z.number().optional().describe("Video note duration in seconds"),
      length: z.number().optional().describe("Video note diameter (width/height)"),
      message_thread_id: z.number().optional()
        .describe("Topic/thread ID for supergroups with topics enabled"),
      disable_notification: z.boolean().optional().describe("Send silently without notification"),
      protect_content: z.boolean().optional().describe("Protect message from forwarding/saving"),
      reply_parameters: z.string().optional().describe("JSON object with ReplyParameters (e.g. {\"message_id\": 123})"),
      reply_markup: z.string().optional().describe("JSON string with reply markup"),
      message_effect_id: z.string().optional().describe("Unique identifier of the message effect to apply"),
    },
    async ({ chat_id, video_note, duration, length, message_thread_id, disable_notification, protect_content, reply_parameters, reply_markup, message_effect_id }) => {
      try {
        const resolved = resolveChatId(chat_id);
        const resolvedThreadId = resolveThreadId(chat_id, message_thread_id);
        const isFile = isFilePath(video_note);

        const params = { chat_id: resolved };
        if (!isFile) params.video_note = video_note;
        if (duration !== undefined) params.duration = duration;
        if (length !== undefined) params.length = length;
        if (resolvedThreadId) params.message_thread_id = resolvedThreadId;
        if (disable_notification) params.disable_notification = true;
        if (protect_content) params.protect_content = true;
        if (reply_parameters) params.reply_parameters = parseJSON(reply_parameters);
        if (reply_markup) params.reply_markup = parseJSON(reply_markup);

        if (message_effect_id) params.message_effect_id = message_effect_id;
        const result = isFile
          ? await tgUpload("sendVideoNote", video_note, "video_note", params)
          : await tgCall("sendVideoNote", params);

        return ok(`Video note sent! ID: ${result.message_id}\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // send_media_group
  server.tool(
    "send_media_group",
    "Send a group of photos or videos as an album. If chat_id is omitted, sends to the default log group.",
    {
      chat_id: z.union([z.string(), z.number()]).optional()
        .describe("Chat ID or @channel_username. Optional — defaults to log group"),
      media: z.string().describe("JSON array of InputMedia objects (2-10 items). Each must have type and media."),
      message_thread_id: z.number().optional()
        .describe("Topic/thread ID for supergroups with topics enabled"),
      disable_notification: z.boolean().optional().describe("Send silently without notification"),
      protect_content: z.boolean().optional().describe("Protect messages from forwarding/saving"),
      reply_parameters: z.string().optional().describe("JSON object with ReplyParameters (e.g. {\"message_id\": 123})"),
      message_effect_id: z.string().optional().describe("Unique identifier of the message effect to apply"),
    },
    async ({ chat_id, media, message_thread_id, disable_notification, protect_content, reply_parameters, message_effect_id }) => {
      try {
        const resolvedThreadId = resolveThreadId(chat_id, message_thread_id);
        const params = { chat_id: resolveChatId(chat_id), media: parseJSON(media) };
        if (resolvedThreadId) params.message_thread_id = resolvedThreadId;
        if (disable_notification) params.disable_notification = true;
        if (protect_content) params.protect_content = true;
        if (reply_parameters) params.reply_parameters = parseJSON(reply_parameters);
        if (message_effect_id) params.message_effect_id = message_effect_id;
        const result = await tgCall("sendMediaGroup", params);
        const msgIds = result.map((m) => m.message_id).join(", ");
        return ok(`Media group sent! Message IDs: [${msgIds}]\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // send_location
  server.tool(
    "send_location",
    "Send a location point to a Telegram chat. If chat_id is omitted, sends to the default log group.",
    {
      chat_id: z.union([z.string(), z.number()]).optional()
        .describe("Chat ID or @channel_username. Optional — defaults to log group"),
      latitude: z.number().describe("Latitude"),
      longitude: z.number().describe("Longitude"),
      horizontal_accuracy: z.number().min(0).max(1500).optional().describe("Radius of uncertainty in meters (0-1500)"),
      live_period: z.number().optional().describe("Live location period in seconds (60-86400), or 0x7FFFFFFF for indefinite"),
      heading: z.number().min(1).max(360).optional().describe("Direction of user movement in degrees (1-360)"),
      proximity_alert_radius: z.number().optional().describe("Max distance for proximity alerts in meters (0-100000)"),
      message_thread_id: z.number().optional()
        .describe("Topic/thread ID for supergroups with topics enabled"),
      disable_notification: z.boolean().optional().describe("Send silently without notification"),
      protect_content: z.boolean().optional().describe("Protect message from forwarding/saving"),
      reply_parameters: z.string().optional().describe("JSON object with ReplyParameters (e.g. {\"message_id\": 123})"),
      reply_markup: z.string().optional().describe("JSON string with reply markup"),
      message_effect_id: z.string().optional().describe("Unique identifier of the message effect to apply"),
    },
    async ({ chat_id, latitude, longitude, horizontal_accuracy, live_period, heading, proximity_alert_radius, message_thread_id, disable_notification, protect_content, reply_parameters, reply_markup, message_effect_id }) => {
      try {
        const resolvedThreadId = resolveThreadId(chat_id, message_thread_id);
        const params = { chat_id: resolveChatId(chat_id), latitude, longitude };
        if (horizontal_accuracy !== undefined) params.horizontal_accuracy = horizontal_accuracy;
        if (live_period !== undefined) params.live_period = live_period;
        if (heading !== undefined) params.heading = heading;
        if (proximity_alert_radius !== undefined) params.proximity_alert_radius = proximity_alert_radius;
        if (resolvedThreadId) params.message_thread_id = resolvedThreadId;
        if (disable_notification) params.disable_notification = true;
        if (protect_content) params.protect_content = true;
        if (reply_parameters) params.reply_parameters = parseJSON(reply_parameters);
        if (reply_markup) params.reply_markup = parseJSON(reply_markup);
        if (message_effect_id) params.message_effect_id = message_effect_id;
        const result = await tgCall("sendLocation", params);
        return ok(`Location sent! ID: ${result.message_id}\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // send_venue
  server.tool(
    "send_venue",
    "Send a venue location to a Telegram chat. If chat_id is omitted, sends to the default log group.",
    {
      chat_id: z.union([z.string(), z.number()]).optional()
        .describe("Chat ID or @channel_username. Optional — defaults to log group"),
      latitude: z.number().describe("Latitude of the venue"),
      longitude: z.number().describe("Longitude of the venue"),
      title: z.string().describe("Name of the venue"),
      address: z.string().describe("Address of the venue"),
      foursquare_id: z.string().optional().describe("Foursquare venue identifier"),
      foursquare_type: z.string().optional().describe("Foursquare venue type"),
      google_place_id: z.string().optional().describe("Google Places venue identifier"),
      google_place_type: z.string().optional().describe("Google Places venue type"),
      message_thread_id: z.number().optional()
        .describe("Topic/thread ID for supergroups with topics enabled"),
      disable_notification: z.boolean().optional().describe("Send silently without notification"),
      protect_content: z.boolean().optional().describe("Protect message from forwarding/saving"),
      reply_parameters: z.string().optional().describe("JSON object with ReplyParameters (e.g. {\"message_id\": 123})"),
      reply_markup: z.string().optional().describe("JSON string with reply markup"),
      message_effect_id: z.string().optional().describe("Unique identifier of the message effect to apply"),
    },
    async ({ chat_id, latitude, longitude, title, address, foursquare_id, foursquare_type, google_place_id, google_place_type, message_thread_id, disable_notification, protect_content, reply_parameters, reply_markup, message_effect_id }) => {
      try {
        const resolvedThreadId = resolveThreadId(chat_id, message_thread_id);
        const params = { chat_id: resolveChatId(chat_id), latitude, longitude, title, address };
        if (foursquare_id) params.foursquare_id = foursquare_id;
        if (foursquare_type) params.foursquare_type = foursquare_type;
        if (google_place_id) params.google_place_id = google_place_id;
        if (google_place_type) params.google_place_type = google_place_type;
        if (resolvedThreadId) params.message_thread_id = resolvedThreadId;
        if (disable_notification) params.disable_notification = true;
        if (protect_content) params.protect_content = true;
        if (reply_parameters) params.reply_parameters = parseJSON(reply_parameters);
        if (reply_markup) params.reply_markup = parseJSON(reply_markup);
        if (message_effect_id) params.message_effect_id = message_effect_id;
        const result = await tgCall("sendVenue", params);
        return ok(`Venue sent! ID: ${result.message_id}\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // send_contact
  server.tool(
    "send_contact",
    "Send a contact to a chat. If chat_id is omitted, sends to the default log group.",
    {
      chat_id: z.union([z.string(), z.number()]).optional()
        .describe("Chat ID or @channel_username. Optional — defaults to log group"),
      phone_number: z.string().describe("Phone number"),
      first_name: z.string().describe("Contact first name"),
      last_name: z.string().optional().describe("Contact last name"),
      vcard: z.string().optional().describe("vCard data"),
      message_thread_id: z.number().optional()
        .describe("Topic/thread ID for supergroups with topics enabled"),
      disable_notification: z.boolean().optional().describe("Send silently without notification"),
      protect_content: z.boolean().optional().describe("Protect message from forwarding/saving"),
      reply_parameters: z.string().optional().describe("JSON object with ReplyParameters (e.g. {\"message_id\": 123})"),
      reply_markup: z.string().optional().describe("JSON string with reply markup"),
      message_effect_id: z.string().optional().describe("Unique identifier of the message effect to apply"),
    },
    async ({ chat_id, phone_number, first_name, last_name, vcard, message_thread_id, disable_notification, protect_content, reply_parameters, reply_markup, message_effect_id }) => {
      try {
        const resolvedThreadId = resolveThreadId(chat_id, message_thread_id);
        const params = { chat_id: resolveChatId(chat_id), phone_number, first_name };
        if (last_name) params.last_name = last_name;
        if (vcard) params.vcard = vcard;
        if (resolvedThreadId) params.message_thread_id = resolvedThreadId;
        if (disable_notification) params.disable_notification = true;
        if (protect_content) params.protect_content = true;
        if (reply_parameters) params.reply_parameters = parseJSON(reply_parameters);
        if (reply_markup) params.reply_markup = parseJSON(reply_markup);
        if (message_effect_id) params.message_effect_id = message_effect_id;
        const result = await tgCall("sendContact", params);
        const contactName = last_name ? `${first_name} ${last_name}` : first_name;
        return ok(`Contact sent! ${contactName}: ${phone_number}\nMessage ID: ${result.message_id}\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // send_poll
  server.tool(
    "send_poll",
    "Send a poll to a Telegram chat. If chat_id is omitted, sends to the default log group.",
    {
      chat_id: z.union([z.string(), z.number()]).optional()
        .describe("Chat ID or @channel_username. Optional — defaults to log group"),
      question: z.string().describe("Poll question (up to 300 chars)"),
      question_parse_mode: z.enum(["Markdown", "MarkdownV2", "HTML"]).optional()
        .describe("Question formatting mode"),
      question_entities: z.string().optional().describe("JSON array of MessageEntity objects for the question"),
      options: z.string().describe("JSON array of InputPollOption objects (2-10 items)"),
      is_anonymous: z.boolean().optional().describe("Anonymous poll (default: true)"),
      type: z.enum(["regular", "quiz"]).optional().describe("Poll type (default: regular)"),
      allows_multiple_answers: z.boolean().optional()
        .describe("Allow multiple answers (regular polls only)"),
      correct_option_id: z.number().optional().describe("0-based index of the correct answer (quiz mode only)"),
      explanation: z.string().optional().describe("Explanation shown after answering (quiz mode, up to 200 chars)"),
      explanation_parse_mode: z.enum(["Markdown", "MarkdownV2", "HTML"]).optional()
        .describe("Explanation formatting mode"),
      explanation_entities: z.string().optional().describe("JSON array of MessageEntity for explanation"),
      open_period: z.number().min(5).max(600).optional().describe("Auto-close after N seconds (5-600)"),
      close_date: z.number().optional().describe("Unix timestamp when poll will be auto-closed"),
      is_closed: z.boolean().optional().describe("Create poll in closed state"),
      message_thread_id: z.number().optional()
        .describe("Topic/thread ID for supergroups with topics enabled"),
      disable_notification: z.boolean().optional().describe("Send silently without notification"),
      protect_content: z.boolean().optional().describe("Protect message from forwarding/saving"),
      reply_parameters: z.string().optional().describe("JSON object with ReplyParameters (e.g. {\"message_id\": 123})"),
      reply_markup: z.string().optional().describe("JSON string with reply markup"),
      message_effect_id: z.string().optional().describe("Unique identifier of the message effect to apply"),
    },
    async ({ chat_id, question, question_parse_mode, question_entities, options, is_anonymous, type, allows_multiple_answers, correct_option_id, explanation, explanation_parse_mode, explanation_entities, open_period, close_date, is_closed, message_thread_id, disable_notification, protect_content, reply_parameters, reply_markup, message_effect_id }) => {
      try {
        const resolvedThreadId = resolveThreadId(chat_id, message_thread_id);
        const params = { chat_id: resolveChatId(chat_id), question, options: parseJSON(options) };
        if (question_parse_mode) params.question_parse_mode = question_parse_mode;
        if (question_entities) params.question_entities = parseJSON(question_entities);
        if (is_anonymous !== undefined) params.is_anonymous = is_anonymous;
        if (type) params.type = type;
        if (allows_multiple_answers !== undefined) params.allows_multiple_answers = allows_multiple_answers;
        if (correct_option_id !== undefined) params.correct_option_id = correct_option_id;
        if (explanation) params.explanation = explanation;
        if (explanation_parse_mode) params.explanation_parse_mode = explanation_parse_mode;
        if (explanation_entities) params.explanation_entities = parseJSON(explanation_entities);
        if (open_period !== undefined) params.open_period = open_period;
        if (close_date !== undefined) params.close_date = close_date;
        if (is_closed !== undefined) params.is_closed = is_closed;
        if (resolvedThreadId) params.message_thread_id = resolvedThreadId;
        if (disable_notification) params.disable_notification = true;
        if (protect_content) params.protect_content = true;
        if (reply_parameters) params.reply_parameters = parseJSON(reply_parameters);
        if (reply_markup) params.reply_markup = parseJSON(reply_markup);
        if (message_effect_id) params.message_effect_id = message_effect_id;
        const result = await tgCall("sendPoll", params);
        return ok(`Poll sent! ID: ${result.message_id}\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // send_dice
  server.tool(
    "send_dice",
    "Send a dice roll animation to a chat. If chat_id is omitted, sends to the default log group.",
    {
      chat_id: z.union([z.string(), z.number()]).optional()
        .describe("Chat ID or @channel_username. Optional — defaults to log group"),
      emoji: z.string().optional()
        .describe("Dice emoji: 🎲 🎯 🏀 ⚽ 🎳 🎰 (default: 🎲)"),
      message_thread_id: z.number().optional()
        .describe("Topic/thread ID for supergroups with topics enabled"),
      disable_notification: z.boolean().optional().describe("Send silently without notification"),
      protect_content: z.boolean().optional().describe("Protect message from forwarding/saving"),
      reply_parameters: z.string().optional().describe("JSON object with ReplyParameters (e.g. {\"message_id\": 123})"),
      reply_markup: z.string().optional().describe("JSON string with reply markup"),
      message_effect_id: z.string().optional().describe("Unique identifier of the message effect to apply"),
    },
    async ({ chat_id, emoji, message_thread_id, disable_notification, protect_content, reply_parameters, reply_markup, message_effect_id }) => {
      try {
        const resolvedThreadId = resolveThreadId(chat_id, message_thread_id);
        const params = { chat_id: resolveChatId(chat_id) };
        if (emoji) params.emoji = emoji;
        if (resolvedThreadId) params.message_thread_id = resolvedThreadId;
        if (disable_notification) params.disable_notification = true;
        if (protect_content) params.protect_content = true;
        if (reply_parameters) params.reply_parameters = parseJSON(reply_parameters);
        if (reply_markup) params.reply_markup = parseJSON(reply_markup);
        if (message_effect_id) params.message_effect_id = message_effect_id;
        const result = await tgCall("sendDice", params);
        return ok(`Dice rolled! ${result.dice.emoji} → ${result.dice.value}\nMessage ID: ${result.message_id}\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // send_sticker
  server.tool(
    "send_sticker",
    "Send a sticker to a Telegram chat. Can send from URL, file_id or local file path. If chat_id is omitted, sends to the default log group.",
    {
      chat_id: z.union([z.string(), z.number()]).optional()
        .describe("Chat ID or @channel_username. Optional — defaults to log group"),
      sticker: z.string().describe("Sticker URL, file_id or absolute local file path"),
      message_thread_id: z.number().optional()
        .describe("Topic/thread ID for supergroups with topics enabled"),
      emoji: z.string().optional().describe("Emoji associated with the sticker (for uploaded stickers)"),
      disable_notification: z.boolean().optional().describe("Send silently without notification"),
      protect_content: z.boolean().optional().describe("Protect message from forwarding/saving"),
      reply_parameters: z.string().optional().describe("JSON object with ReplyParameters (e.g. {\"message_id\": 123})"),
      reply_markup: z.string().optional().describe("JSON string with reply markup (inline keyboard, custom keyboard, etc.)"),
      message_effect_id: z.string().optional().describe("Unique identifier of the message effect to apply"),
    },
    async ({ chat_id, sticker, message_thread_id, emoji, disable_notification, protect_content, reply_parameters, reply_markup, message_effect_id }) => {
      try {
        const resolved = resolveChatId(chat_id);
        const resolvedThreadId = resolveThreadId(chat_id, message_thread_id);
        const isFile = isFilePath(sticker);

        const params = { chat_id: resolved };
        if (!isFile) params.sticker = sticker;
        if (resolvedThreadId) params.message_thread_id = resolvedThreadId;
        if (emoji) params.emoji = emoji;
        if (disable_notification) params.disable_notification = true;
        if (protect_content) params.protect_content = true;
        if (reply_parameters) params.reply_parameters = parseJSON(reply_parameters);
        if (reply_markup) params.reply_markup = parseJSON(reply_markup);

        if (message_effect_id) params.message_effect_id = message_effect_id;
        const result = isFile
          ? await tgUpload("sendSticker", sticker, "sticker", params)
          : await tgCall("sendSticker", params);

        return ok(`Sticker sent! ID: ${result.message_id}\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // send_paid_media
  server.tool(
    "send_paid_media",
    "Send paid media to a chat.",
    {
      chat_id: z.union([z.string(), z.number()]).optional()
        .describe("Chat ID. Optional — defaults to log group"),
      star_count: z.number().min(1).describe("Price in Telegram Stars"),
      media: z.string().describe("JSON array of InputPaidMedia objects"),
      caption: z.string().optional().describe("Caption for the media"),
      parse_mode: z.enum(["Markdown", "MarkdownV2", "HTML"]).optional().describe("Caption formatting"),
      caption_entities: z.string().optional().describe("JSON array of MessageEntity"),
      show_caption_above_media: z.boolean().optional().describe("Show caption above media"),
      disable_notification: z.boolean().optional().describe("Send silently"),
      protect_content: z.boolean().optional().describe("Protect from forwarding"),
      reply_parameters: z.string().optional().describe("JSON ReplyParameters object"),
      message_thread_id: z.number().optional().describe("Topic/thread ID"),
    },
    async ({ chat_id, star_count, media, caption, parse_mode, caption_entities, show_caption_above_media, disable_notification, protect_content, reply_parameters, message_thread_id }) => {
      try {
        const resolvedThreadId = resolveThreadId(chat_id, message_thread_id);
        const params = {
          chat_id: resolveChatId(chat_id),
          star_count,
          media: parseJSON(media),
        };
        if (caption) params.caption = caption;
        if (parse_mode) params.parse_mode = parse_mode;
        if (caption_entities) params.caption_entities = parseJSON(caption_entities);
        if (show_caption_above_media) params.show_caption_above_media = true;
        if (disable_notification) params.disable_notification = true;
        if (protect_content) params.protect_content = true;
        if (reply_parameters) params.reply_parameters = parseJSON(reply_parameters);
        if (resolvedThreadId) params.message_thread_id = resolvedThreadId;
        const result = await tgCall("sendPaidMedia", params);
        return ok(`Paid media sent.\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // send_checklist
  server.tool(
    "send_checklist",
    "Send a checklist message to a chat.",
    {
      chat_id: z.union([z.string(), z.number()]).optional()
        .describe("Chat ID. Optional — defaults to log group"),
      checklist: z.string().describe("JSON InputChecklist object"),
      disable_notification: z.boolean().optional().describe("Send silently"),
      protect_content: z.boolean().optional().describe("Protect from forwarding"),
      message_thread_id: z.number().optional().describe("Topic/thread ID"),
      reply_parameters: z.string().optional().describe("JSON ReplyParameters object"),
      message_effect_id: z.string().optional().describe("Unique identifier of the message effect to apply"),
    },
    async ({ chat_id, checklist, disable_notification, protect_content, message_thread_id, reply_parameters, message_effect_id }) => {
      try {
        const resolvedThreadId = resolveThreadId(chat_id, message_thread_id);
        const params = {
          chat_id: resolveChatId(chat_id),
          checklist: parseJSON(checklist),
        };
        if (disable_notification) params.disable_notification = true;
        if (protect_content) params.protect_content = true;
        if (resolvedThreadId) params.message_thread_id = resolvedThreadId;
        if (reply_parameters) params.reply_parameters = parseJSON(reply_parameters);
        if (message_effect_id) params.message_effect_id = message_effect_id;
        const result = await tgCall("sendChecklist", params);
        return ok(`Checklist sent.\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // send_message_draft
  server.tool(
    "send_message_draft",
    "Send a draft message that can be updated progressively.",
    {
      chat_id: z.union([z.string(), z.number()]).optional()
        .describe("Chat ID. Optional — defaults to log group"),
      text: z.string().optional().describe("Draft text (partial)"),
      message_thread_id: z.number().optional().describe("Topic/thread ID"),
      parse_mode: z.enum(["Markdown", "MarkdownV2", "HTML"]).optional(),
      entities: z.string().optional().describe("JSON array of MessageEntity"),
      disable_notification: z.boolean().optional().describe("Send silently"),
      protect_content: z.boolean().optional().describe("Protect from forwarding"),
    },
    async ({ chat_id, text, message_thread_id, parse_mode, entities, disable_notification, protect_content }) => {
      try {
        const resolvedThreadId = resolveThreadId(chat_id, message_thread_id);
        const params = { chat_id: resolveChatId(chat_id) };
        if (text !== undefined) params.text = text;
        if (resolvedThreadId) params.message_thread_id = resolvedThreadId;
        if (parse_mode) params.parse_mode = parse_mode;
        if (entities) params.entities = parseJSON(entities);
        if (disable_notification) params.disable_notification = true;
        if (protect_content) params.protect_content = true;
        const result = await tgCall("sendMessageDraft", params);
        return ok(`Draft message sent.\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // send_chat_action
  server.tool(
    "send_chat_action",
    "Send a chat action (typing, upload_photo, etc.) to show the bot is doing something.",
    {
      chat_id: z.union([z.string(), z.number()]).optional()
        .describe("Chat ID or @channel_username. Optional — defaults to log group"),
      action: z.enum([
        "typing",
        "upload_photo",
        "record_video",
        "upload_video",
        "record_voice",
        "upload_voice",
        "upload_document",
        "choose_sticker",
        "find_location",
        "record_video_note",
        "upload_video_note"
      ]).describe("Type of action to broadcast"),
      message_thread_id: z.number().optional()
        .describe("Topic/thread ID for supergroups with topics enabled"),
    },
    async ({ chat_id, action, message_thread_id }) => {
      try {
        const resolvedThreadId = resolveThreadId(chat_id, message_thread_id);
        const params = { chat_id: resolveChatId(chat_id), action };
        if (resolvedThreadId) params.message_thread_id = resolvedThreadId;
        const result = await tgCall("sendChatAction", params);
        return ok(`Chat action "${action}" sent.\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // send_business_message
  server.tool(
    "send_business_message",
    "Send a text message on behalf of a business account. Requires business_connection_id.",
    {
      business_connection_id: z.string().describe("Business connection ID"),
      chat_id: z.union([z.string(), z.number()]).describe("Chat ID to send message to"),
      text: z.string().describe("Message text (up to 4096 characters)"),
      parse_mode: z.enum(["Markdown", "MarkdownV2", "HTML"]).optional()
        .describe("Text formatting mode. Default: none"),
      reply_markup: z.string().optional().describe("JSON string with inline keyboard markup"),
    },
    async ({ business_connection_id, chat_id, text, parse_mode, reply_markup }) => {
      try {
        const params = { business_connection_id, chat_id, text };
        if (parse_mode) params.parse_mode = parse_mode;
        if (reply_markup) params.reply_markup = parseJSON(reply_markup);
        const result = await tgCall("sendMessage", params);
        return ok(`Business message sent! ID: ${result.message_id}\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );
}

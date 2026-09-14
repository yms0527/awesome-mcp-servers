import { z } from "zod";
import {
  tgCall, tgUpload, resolveChatId,
  formatResult, parseJSON, ok, err, isFilePath
} from "../utils/api.js";

export function registerStoryTools(server) {
  // post_story
  server.tool(
    "post_story",
    "Post a story on behalf of a business account.",
    {
      business_connection_id: z.string().describe("Business connection ID"),
      content: z.string().describe("JSON object with InputStoryContent"),
      active_period: z.number().optional().describe("Story active period in seconds (6h, 12h, 24h, 48h)"),
      caption: z.string().optional().describe("Story caption (0-2048 chars)"),
      parse_mode: z.enum(["Markdown", "MarkdownV2", "HTML"]).optional().describe("Caption formatting mode"),
      caption_entities: z.string().optional().describe("JSON array of MessageEntity objects"),
      areas: z.string().optional().describe("JSON array of StoryArea objects"),
      post_to_chat_page: z.boolean().optional().describe("Post story to chat page"),
      protect_content: z.boolean().optional().describe("Protect content from forwarding/saving"),
    },
    async ({ business_connection_id, content, active_period, caption, parse_mode, caption_entities, areas, post_to_chat_page, protect_content }) => {
      try {
        const params = {
          business_connection_id,
          content: parseJSON(content),
        };
        if (active_period !== undefined) params.active_period = active_period;
        if (caption) params.caption = caption;
        if (parse_mode) params.parse_mode = parse_mode;
        if (caption_entities) params.caption_entities = parseJSON(caption_entities);
        if (areas) params.areas = parseJSON(areas);
        if (post_to_chat_page !== undefined) params.post_to_chat_page = post_to_chat_page;
        if (protect_content !== undefined) params.protect_content = protect_content;
        const result = await tgCall("postStory", params);
        return ok(`Story posted! ID: ${result.id}\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // edit_story
  server.tool(
    "edit_story",
    "Edit a story on behalf of a business account.",
    {
      business_connection_id: z.string().describe("Business connection ID"),
      story_id: z.number().describe("Story ID to edit"),
      content: z.string().optional().describe("JSON object with InputStoryContent"),
      caption: z.string().optional().describe("New story caption"),
      parse_mode: z.enum(["Markdown", "MarkdownV2", "HTML"]).optional().describe("Caption formatting mode"),
      caption_entities: z.string().optional().describe("JSON array of MessageEntity objects"),
      areas: z.string().optional().describe("JSON array of StoryArea objects"),
    },
    async ({ business_connection_id, story_id, content, caption, parse_mode, caption_entities, areas }) => {
      try {
        const params = { business_connection_id, story_id };
        if (content) params.content = parseJSON(content);
        if (caption !== undefined) params.caption = caption;
        if (parse_mode) params.parse_mode = parse_mode;
        if (caption_entities) params.caption_entities = parseJSON(caption_entities);
        if (areas) params.areas = parseJSON(areas);
        const result = await tgCall("editStory", params);
        return ok(`Story ${story_id} edited.\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // delete_story
  server.tool(
    "delete_story",
    "Delete a story on behalf of a business account.",
    {
      business_connection_id: z.string().describe("Business connection ID"),
      story_id: z.number().describe("Story ID to delete"),
    },
    async ({ business_connection_id, story_id }) => {
      try {
        const result = await tgCall("deleteStory", { business_connection_id, story_id });
        return ok(`Story ${story_id} deleted.\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // repost_story
  server.tool(
    "repost_story",
    "Repost a story on behalf of a business account.",
    {
      business_connection_id: z.string().describe("Business connection ID"),
      from_chat_id: z.union([z.string(), z.number()]).describe("Source chat ID"),
      story_id: z.number().describe("Story ID to repost"),
      caption: z.string().optional().describe("Story caption"),
      parse_mode: z.enum(["Markdown", "MarkdownV2", "HTML"]).optional().describe("Caption formatting mode"),
      caption_entities: z.string().optional().describe("JSON array of MessageEntity objects"),
    },
    async ({ business_connection_id, from_chat_id, story_id, caption, parse_mode, caption_entities }) => {
      try {
        const params = { business_connection_id, from_chat_id, story_id };
        if (caption) params.caption = caption;
        if (parse_mode) params.parse_mode = parse_mode;
        if (caption_entities) params.caption_entities = parseJSON(caption_entities);
        const result = await tgCall("repostStory", params);
        return ok(`Story ${story_id} reposted.\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );
}

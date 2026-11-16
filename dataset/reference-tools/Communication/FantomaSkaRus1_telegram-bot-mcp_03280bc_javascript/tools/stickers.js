import { z } from "zod";
import {
  tgCall, tgUpload, resolveChatId,
  formatResult, parseJSON, ok, err, isFilePath
} from "../utils/api.js";

export function registerStickerTools(server) {
  // get_sticker_set
  server.tool(
    "get_sticker_set",
    "Get information about a sticker set by name.",
    {
      name: z.string().describe("Name of the sticker set"),
    },
    async ({ name }) => {
      try {
        const result = await tgCall("getStickerSet", { name });
        const info = `Sticker Set: ${result.title}\nName: ${result.name}\nType: ${result.sticker_type}\nStickers: ${result.stickers.length}`;
        return ok(`${info}\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // get_custom_emoji_stickers
  server.tool(
    "get_custom_emoji_stickers",
    "Get stickers by their custom emoji IDs.",
    {
      custom_emoji_ids: z.string().describe("JSON array of custom emoji ID strings"),
    },
    async ({ custom_emoji_ids }) => {
      try {
        const result = await tgCall("getCustomEmojiStickers", {
          custom_emoji_ids: parseJSON(custom_emoji_ids),
        });
        return ok(`Custom emoji stickers:\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // upload_sticker_file
  server.tool(
    "upload_sticker_file",
    "Upload a sticker file to Telegram servers for later use in creating stickers.",
    {
      user_id: z.number().describe("User ID who will own the sticker"),
      sticker: z.string().describe("Absolute local file path to the sticker file"),
      sticker_format: z.enum(["static", "animated", "video"]).describe("Sticker format"),
    },
    async ({ user_id, sticker, sticker_format }) => {
      try {
        const result = await tgUpload("uploadStickerFile", sticker, "sticker", {
          user_id,
          sticker_format,
        });
        return ok(`Sticker file uploaded!\nFile ID: ${result.file_id}\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // create_new_sticker_set
  server.tool(
    "create_new_sticker_set",
    "Create a new sticker set owned by a user.",
    {
      user_id: z.number().describe("User ID who will own the sticker set"),
      name: z.string().describe("Short name of sticker set (used in URLs)"),
      title: z.string().describe("Sticker set title (1-64 chars)"),
      stickers: z.string().describe("JSON array of InputSticker objects"),
      sticker_type: z.enum(["regular", "mask", "custom_emoji"]).optional()
        .describe("Type of stickers (default: regular)"),
      needs_repainting: z.boolean().optional()
        .describe("True if stickers must be repainted to the color of the Telegram theme (custom_emoji sets only)"),
    },
    async ({ user_id, name, title, stickers, sticker_type, needs_repainting }) => {
      try {
        const params = { user_id, name, title, stickers: parseJSON(stickers) };
        if (sticker_type) params.sticker_type = sticker_type;
        if (needs_repainting !== undefined) params.needs_repainting = needs_repainting;
        const result = await tgCall("createNewStickerSet", params);
        return ok(`Sticker set "${name}" created!\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // add_sticker_to_set
  server.tool(
    "add_sticker_to_set",
    "Add a new sticker to a sticker set.",
    {
      user_id: z.number().describe("User ID who owns the sticker set"),
      name: z.string().describe("Sticker set name"),
      sticker: z.string().describe("JSON object with InputSticker"),
    },
    async ({ user_id, name, sticker }) => {
      try {
        const result = await tgCall("addStickerToSet", { user_id, name, sticker: parseJSON(sticker) });
        return ok(`Sticker added to set "${name}"!\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // set_sticker_position_in_set
  server.tool(
    "set_sticker_position_in_set",
    "Move a sticker to a new position in the set.",
    {
      sticker: z.string().describe("File ID of the sticker"),
      position: z.number().describe("New position (0-based index)"),
    },
    async ({ sticker, position }) => {
      try {
        const result = await tgCall("setStickerPositionInSet", { sticker, position });
        return ok(`Sticker moved to position ${position}.\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // delete_sticker_from_set
  server.tool(
    "delete_sticker_from_set",
    "Delete a sticker from a sticker set.",
    {
      sticker: z.string().describe("File ID of the sticker to delete"),
    },
    async ({ sticker }) => {
      try {
        const result = await tgCall("deleteStickerFromSet", { sticker });
        return ok(`Sticker deleted from set.\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // replace_sticker_in_set
  server.tool(
    "replace_sticker_in_set",
    "Replace a sticker in a sticker set with a new one.",
    {
      user_id: z.number().describe("User ID who owns the sticker set"),
      name: z.string().describe("Sticker set name"),
      old_sticker: z.string().describe("File ID of the sticker to replace"),
      sticker: z.string().describe("JSON object with InputSticker"),
    },
    async ({ user_id, name, old_sticker, sticker }) => {
      try {
        const result = await tgCall("replaceStickerInSet", {
          user_id,
          name,
          old_sticker,
          sticker: parseJSON(sticker),
        });
        return ok(`Sticker replaced in set "${name}".\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // set_sticker_emoji_list
  server.tool(
    "set_sticker_emoji_list",
    "Set the emoji list for a sticker.",
    {
      sticker: z.string().describe("File ID of the sticker"),
      emoji_list: z.string().describe("JSON array of emoji strings"),
    },
    async ({ sticker, emoji_list }) => {
      try {
        const result = await tgCall("setStickerEmojiList", { sticker, emoji_list: parseJSON(emoji_list) });
        return ok(`Sticker emoji list updated.\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // set_sticker_keywords
  server.tool(
    "set_sticker_keywords",
    "Set the keywords for a sticker (used in search).",
    {
      sticker: z.string().describe("File ID of the sticker"),
      keywords: z.string().optional().describe("JSON array of keyword strings"),
    },
    async ({ sticker, keywords }) => {
      try {
        const params = { sticker };
        if (keywords !== undefined) params.keywords = parseJSON(keywords);
        const result = await tgCall("setStickerKeywords", params);
        return ok(`Sticker keywords updated.\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // set_sticker_mask_position
  server.tool(
    "set_sticker_mask_position",
    "Set the mask position for a mask sticker.",
    {
      sticker: z.string().describe("File ID of the sticker"),
      mask_position: z.string().optional().describe("JSON object with MaskPosition"),
    },
    async ({ sticker, mask_position }) => {
      try {
        const params = { sticker };
        if (mask_position !== undefined) params.mask_position = parseJSON(mask_position);
        const result = await tgCall("setStickerMaskPosition", params);
        return ok(`Sticker mask position updated.\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // set_sticker_set_title
  server.tool(
    "set_sticker_set_title",
    "Set the title of a sticker set.",
    {
      name: z.string().describe("Sticker set name"),
      title: z.string().describe("New title (1-64 chars)"),
    },
    async ({ name, title }) => {
      try {
        const result = await tgCall("setStickerSetTitle", { name, title });
        return ok(`Sticker set "${name}" title updated to "${title}".\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // set_sticker_set_thumbnail
  server.tool(
    "set_sticker_set_thumbnail",
    "Set the thumbnail for a sticker set.",
    {
      name: z.string().describe("Sticker set name"),
      user_id: z.number().describe("User ID who owns the sticker set"),
      thumbnail: z.string().optional().describe("Thumbnail URL or local file path. Omit to delete."),
      format: z.enum(["static", "animated", "video"]).describe("Thumbnail format"),
    },
    async ({ name, user_id, thumbnail, format }) => {
      try {
        let result;
        if (thumbnail) {
          const isFile = isFilePath(thumbnail);
          if (isFile) {
            const params = { name, user_id, format };
            result = await tgUpload("setStickerSetThumbnail", thumbnail, "thumbnail", params);
          } else {
            result = await tgCall("setStickerSetThumbnail", { name, user_id, thumbnail, format });
          }
        } else {
          result = await tgCall("setStickerSetThumbnail", { name, user_id, format });
        }
        return ok(`Sticker set "${name}" thumbnail updated.\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // delete_sticker_set
  server.tool(
    "delete_sticker_set",
    "Delete a sticker set.",
    {
      name: z.string().describe("Sticker set name"),
    },
    async ({ name }) => {
      try {
        const result = await tgCall("deleteStickerSet", { name });
        return ok(`Sticker set "${name}" deleted.\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // ─── Custom Emoji Sticker Sets ──────────────────────────────────────────────────

  // set_custom_emoji_sticker_set_thumbnail
  server.tool(
    "set_custom_emoji_sticker_set_thumbnail",
    "Set the thumbnail of a custom emoji sticker set.",
    {
      name: z.string().describe("Sticker set name"),
      custom_emoji_id: z.string().optional().describe("Custom emoji ID for thumbnail"),
    },
    async ({ name, custom_emoji_id }) => {
      try {
        const params = { name };
        if (custom_emoji_id !== undefined) params.custom_emoji_id = custom_emoji_id;
        const result = await tgCall("setCustomEmojiStickerSetThumbnail", params);
        return ok(`Custom emoji sticker set "${name}" thumbnail updated.\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // ─── Chat Sticker Sets ───────────────────────────────────────────────────────────

  // set_chat_sticker_set
  server.tool(
    "set_chat_sticker_set",
    "Set a group sticker set for a supergroup.",
    {
      chat_id: z.union([z.string(), z.number()]).optional()
        .describe("Chat ID or @channel_username. Optional — defaults to log group"),
      sticker_set_name: z.string().describe("Name of the sticker set"),
    },
    async ({ chat_id, sticker_set_name }) => {
      try {
        const result = await tgCall("setChatStickerSet", {
          chat_id: resolveChatId(chat_id),
          sticker_set_name,
        });
        return ok(`Chat sticker set updated.\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // delete_chat_sticker_set
  server.tool(
    "delete_chat_sticker_set",
    "Delete the group sticker set for a supergroup.",
    {
      chat_id: z.union([z.string(), z.number()]).optional()
        .describe("Chat ID or @channel_username. Optional — defaults to log group"),
    },
    async ({ chat_id }) => {
      try {
        const result = await tgCall("deleteChatStickerSet", {
          chat_id: resolveChatId(chat_id),
        });
        return ok(`Chat sticker set deleted.\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );
}

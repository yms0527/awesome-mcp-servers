import { z } from "zod";
import { tgCall, formatResult, parseJSON, ok, err } from "../../utils/api.js";

// ─── Bot Profile & User Profile Methods ───────────────────────────────────────

export function registerBotProfileTools(server) {
  // get_user_profile_photos
  server.tool(
    "get_user_profile_photos",
    "Get a user's profile pictures.",
    {
      user_id: z.number().describe("User ID"),
      offset: z.number().optional().describe("Offset for pagination"),
      limit: z.number().min(1).max(100).optional().describe("Number of photos (1-100)"),
    },
    async ({ user_id, offset, limit }) => {
      try {
        const params = { user_id };
        if (offset !== undefined) params.offset = offset;
        if (limit !== undefined) params.limit = limit;
        const result = await tgCall("getUserProfilePhotos", params);
        return ok(`User profile photos: ${result.total_count} total\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // get_user_profile_audios
  server.tool(
    "get_user_profile_audios",
    "Get audios added to a user's profile.",
    {
      user_id: z.number().describe("User ID"),
      offset: z.number().optional().describe("Offset for pagination"),
      limit: z.number().min(1).max(100).optional().describe("Number of audios (1-100)"),
    },
    async ({ user_id, offset, limit }) => {
      try {
        const params = { user_id };
        if (offset !== undefined) params.offset = offset;
        if (limit !== undefined) params.limit = limit;
        const result = await tgCall("getUserProfileAudios", params);
        return ok(`User profile audios: ${result.total_count} total\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // set_user_emoji_status
  server.tool(
    "set_user_emoji_status",
    "Set emoji status for a user (requires business connection).",
    {
      business_connection_id: z.string().describe("Business connection ID"),
      emoji_status_custom_emoji_id: z.string().optional().describe("Custom emoji ID"),
      emoji_status_expiration_date: z.number().optional().describe("Unix timestamp when status expires"),
    },
    async ({ business_connection_id, emoji_status_custom_emoji_id, emoji_status_expiration_date }) => {
      try {
        const params = { business_connection_id };
        if (emoji_status_custom_emoji_id !== undefined) params.emoji_status_custom_emoji_id = emoji_status_custom_emoji_id;
        if (emoji_status_expiration_date !== undefined) params.emoji_status_expiration_date = emoji_status_expiration_date;
        const result = await tgCall("setUserEmojiStatus", params);
        return ok(`User emoji status updated.\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // set_my_profile_photo
  server.tool(
    "set_my_profile_photo",
    "Set the bot's profile photo.",
    {
      photo: z.string().describe("JSON object with InputProfilePhoto"),
    },
    async ({ photo }) => {
      try {
        const result = await tgCall("setMyProfilePhoto", { photo: parseJSON(photo) });
        return ok(`Bot profile photo updated.\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // remove_my_profile_photo
  server.tool(
    "remove_my_profile_photo",
    "Remove the bot's profile photo.",
    {},
    async () => {
      try {
        const result = await tgCall("removeMyProfilePhoto");
        return ok(`Bot profile photo removed.\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // get_my_star_balance
  server.tool(
    "get_my_star_balance",
    "Get the bot's Telegram Star balance.",
    {},
    async () => {
      try {
        const result = await tgCall("getMyStarBalance");
        return ok(`Bot star balance: ${result.amount} stars\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // save_prepared_inline_message
  server.tool(
    "save_prepared_inline_message",
    "Save a prepared inline message for later use.",
    {
      user_id: z.number().describe("User ID"),
      result: z.string().describe("JSON InlineQueryResult object"),
      allow_user_chats: z.boolean().optional().describe("Allow sending to user chats"),
      allow_bot_chats: z.boolean().optional().describe("Allow sending to bot chats"),
      allow_group_chats: z.boolean().optional().describe("Allow sending to group chats"),
      allow_channel_chats: z.boolean().optional().describe("Allow sending to channel chats"),
    },
    async ({ user_id, result, allow_user_chats, allow_bot_chats, allow_group_chats, allow_channel_chats }) => {
      try {
        const params = { user_id, result: parseJSON(result) };
        if (allow_user_chats !== undefined) params.allow_user_chats = allow_user_chats;
        if (allow_bot_chats !== undefined) params.allow_bot_chats = allow_bot_chats;
        if (allow_group_chats !== undefined) params.allow_group_chats = allow_group_chats;
        if (allow_channel_chats !== undefined) params.allow_channel_chats = allow_channel_chats;
        const res = await tgCall("savePreparedInlineMessage", params);
        return ok(`Prepared inline message saved. ID: ${res.id}\n\n${formatResult(res)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // edit_user_star_subscription
  server.tool(
    "edit_user_star_subscription",
    "Edit a user's Telegram Star subscription.",
    {
      user_id: z.number().describe("User ID"),
      telegram_payment_charge_id: z.string().describe("Payment charge ID"),
      is_canceled: z.boolean().optional().describe("Whether subscription is canceled"),
    },
    async ({ user_id, telegram_payment_charge_id, is_canceled }) => {
      try {
        const params = { user_id, telegram_payment_charge_id };
        if (is_canceled !== undefined) params.is_canceled = is_canceled;
        const result = await tgCall("editUserStarSubscription", params);
        return ok(`Star subscription updated.\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );
}

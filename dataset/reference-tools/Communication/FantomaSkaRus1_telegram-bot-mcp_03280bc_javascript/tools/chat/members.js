import { z } from "zod";
import { tgCall, resolveChatId, formatResult, parseJSON, ok, err } from "../../utils/api.js";

// ─── Chat Member Management ────────────────────────────────────────────────────

export function registerChatMembersTools(server) {
  // ban_chat_member
  server.tool(
    "ban_chat_member",
    "Ban a user from a chat. If chat_id is omitted, targets the default log group.",
    {
      chat_id: z.union([z.string(), z.number()]).optional()
        .describe("Chat ID or @channel_username. Optional — defaults to log group"),
      user_id: z.number().describe("User ID to ban"),
      until_date: z.number().optional()
        .describe("Unix timestamp when the ban will be lifted. 0 or omitted = forever"),
      revoke_messages: z.boolean().optional()
        .describe("Delete all messages from the banned user"),
    },
    async ({ chat_id, user_id, until_date, revoke_messages }) => {
      try {
        const params = { chat_id: resolveChatId(chat_id), user_id };
        if (until_date !== undefined) params.until_date = until_date;
        if (revoke_messages !== undefined) params.revoke_messages = revoke_messages;
        await tgCall("banChatMember", params);
        return ok(`User ${user_id} banned.`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // unban_chat_member
  server.tool(
    "unban_chat_member",
    "Unban a previously banned user in a chat. If chat_id is omitted, targets the default log group.",
    {
      chat_id: z.union([z.string(), z.number()]).optional()
        .describe("Chat ID or @channel_username. Optional — defaults to log group"),
      user_id: z.number().describe("User ID to unban"),
      only_if_banned: z.boolean().optional()
        .describe("Only unban if the user is currently banned"),
    },
    async ({ chat_id, user_id, only_if_banned }) => {
      try {
        const params = { chat_id: resolveChatId(chat_id), user_id };
        if (only_if_banned !== undefined) params.only_if_banned = only_if_banned;
        await tgCall("unbanChatMember", params);
        return ok(`User ${user_id} unbanned.`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // restrict_chat_member
  server.tool(
    "restrict_chat_member",
    "Restrict a user's permissions in a chat. If chat_id is omitted, targets the default log group.",
    {
      chat_id: z.union([z.string(), z.number()]).optional()
        .describe("Chat ID or @channel_username. Optional — defaults to log group"),
      user_id: z.number().describe("User ID to restrict"),
      permissions: z.string().describe("JSON string with ChatPermissions object"),
      use_independent_chat_permissions: z.boolean().optional()
        .describe("Use independent permissions for each privilege instead of implicit grouping"),
      until_date: z.number().optional()
        .describe("Unix timestamp when restrictions will be lifted"),
    },
    async ({ chat_id, user_id, permissions, use_independent_chat_permissions, until_date }) => {
      try {
        const params = { chat_id: resolveChatId(chat_id), user_id, permissions: parseJSON(permissions) };
        if (use_independent_chat_permissions !== undefined) params.use_independent_chat_permissions = use_independent_chat_permissions;
        if (until_date !== undefined) params.until_date = until_date;
        await tgCall("restrictChatMember", params);
        return ok(`User ${user_id} permissions restricted.`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // promote_chat_member
  server.tool(
    "promote_chat_member",
    "Promote a user to admin in a chat. If chat_id is omitted, targets the default log group.",
    {
      chat_id: z.union([z.string(), z.number()]).optional()
        .describe("Chat ID or @channel_username. Optional — defaults to log group"),
      user_id: z.number().describe("User ID to promote"),
      is_anonymous: z.boolean().optional().describe("Admin remains anonymous"),
      can_manage_chat: z.boolean().optional().describe("Can manage the chat"),
      can_post_messages: z.boolean().optional().describe("Can post messages (channels only)"),
      can_edit_messages: z.boolean().optional().describe("Can edit messages (channels only)"),
      can_delete_messages: z.boolean().optional().describe("Can delete messages"),
      can_manage_video_chats: z.boolean().optional().describe("Can manage video chats"),
      can_restrict_members: z.boolean().optional().describe("Can restrict members"),
      can_promote_members: z.boolean().optional().describe("Can promote other members"),
      can_change_info: z.boolean().optional().describe("Can change chat info"),
      can_invite_users: z.boolean().optional().describe("Can invite users"),
      can_pin_messages: z.boolean().optional().describe("Can pin messages"),
      can_manage_topics: z.boolean().optional().describe("Can manage topics"),
    },
    async ({ chat_id, user_id, is_anonymous, can_manage_chat, can_post_messages, can_edit_messages, can_delete_messages, can_manage_video_chats, can_restrict_members, can_promote_members, can_change_info, can_invite_users, can_pin_messages, can_manage_topics }) => {
      try {
        const params = { chat_id: resolveChatId(chat_id), user_id };
        if (is_anonymous !== undefined) params.is_anonymous = is_anonymous;
        if (can_manage_chat !== undefined) params.can_manage_chat = can_manage_chat;
        if (can_post_messages !== undefined) params.can_post_messages = can_post_messages;
        if (can_edit_messages !== undefined) params.can_edit_messages = can_edit_messages;
        if (can_delete_messages !== undefined) params.can_delete_messages = can_delete_messages;
        if (can_manage_video_chats !== undefined) params.can_manage_video_chats = can_manage_video_chats;
        if (can_restrict_members !== undefined) params.can_restrict_members = can_restrict_members;
        if (can_promote_members !== undefined) params.can_promote_members = can_promote_members;
        if (can_change_info !== undefined) params.can_change_info = can_change_info;
        if (can_invite_users !== undefined) params.can_invite_users = can_invite_users;
        if (can_pin_messages !== undefined) params.can_pin_messages = can_pin_messages;
        if (can_manage_topics !== undefined) params.can_manage_topics = can_manage_topics;
        await tgCall("promoteChatMember", params);
        return ok(`User ${user_id} promoted.`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // set_chat_administrator_custom_title
  server.tool(
    "set_chat_administrator_custom_title",
    "Set a custom title for an admin in a chat. If chat_id is omitted, targets the default log group.",
    {
      chat_id: z.union([z.string(), z.number()]).optional()
        .describe("Chat ID or @channel_username. Optional — defaults to log group"),
      user_id: z.number().describe("User ID of the admin"),
      custom_title: z.string().max(16).describe("Custom title (up to 16 characters)"),
    },
    async ({ chat_id, user_id, custom_title }) => {
      try {
        await tgCall("setChatAdministratorCustomTitle", {
          chat_id: resolveChatId(chat_id),
          user_id,
          custom_title,
        });
        return ok(`Admin ${user_id} custom title set to "${custom_title}".`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // set_chat_member_tag
  server.tool(
    "set_chat_member_tag",
    "Set a tag for a chat member.",
    {
      chat_id: z.union([z.string(), z.number()]).optional()
        .describe("Chat ID or @channel_username. Optional — defaults to log group"),
      user_id: z.number().describe("User ID to set tag for"),
      tag: z.string().max(16).optional().describe("Tag text (empty to remove)"),
    },
    async ({ chat_id, user_id, tag }) => {
      try {
        const params = { chat_id: resolveChatId(chat_id), user_id };
        if (tag !== undefined) params.tag = tag;
        const result = await tgCall("setChatMemberTag", params);
        return ok(`Member tag ${tag ? `set to "${tag}"` : "removed"}.\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // ban_chat_sender_chat
  server.tool(
    "ban_chat_sender_chat",
    "Ban a channel chat in a supergroup or channel. The owner of the sender chat won't be able to send messages on behalf of their chat.",
    {
      chat_id: z.union([z.string(), z.number()]).optional()
        .describe("Chat ID or @channel_username. Optional — defaults to log group"),
      sender_chat_id: z.number().describe("The sender chat to ban"),
    },
    async ({ chat_id, sender_chat_id }) => {
      try {
        const result = await tgCall("banChatSenderChat", {
          chat_id: resolveChatId(chat_id),
          sender_chat_id,
        });
        return ok(`Sender chat ${sender_chat_id} banned.\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // unban_chat_sender_chat
  server.tool(
    "unban_chat_sender_chat",
    "Unban a previously banned channel chat in a supergroup or channel.",
    {
      chat_id: z.union([z.string(), z.number()]).optional()
        .describe("Chat ID or @channel_username. Optional — defaults to log group"),
      sender_chat_id: z.number().describe("The sender chat to unban"),
    },
    async ({ chat_id, sender_chat_id }) => {
      try {
        const result = await tgCall("unbanChatSenderChat", {
          chat_id: resolveChatId(chat_id),
          sender_chat_id,
        });
        return ok(`Sender chat ${sender_chat_id} unbanned.\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // approve_chat_join_request
  server.tool(
    "approve_chat_join_request",
    "Approve a user's join request to a chat.",
    {
      chat_id: z.union([z.string(), z.number()]).optional()
        .describe("Chat ID or @channel_username. Optional — defaults to log group"),
      user_id: z.number().describe("User ID to approve"),
    },
    async ({ chat_id, user_id }) => {
      try {
        const result = await tgCall("approveChatJoinRequest", {
          chat_id: resolveChatId(chat_id),
          user_id,
        });
        return ok(`Join request approved for user ${user_id}!\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // decline_chat_join_request
  server.tool(
    "decline_chat_join_request",
    "Decline a user's join request to a chat.",
    {
      chat_id: z.union([z.string(), z.number()]).optional()
        .describe("Chat ID or @channel_username. Optional — defaults to log group"),
      user_id: z.number().describe("User ID to decline"),
    },
    async ({ chat_id, user_id }) => {
      try {
        const result = await tgCall("declineChatJoinRequest", {
          chat_id: resolveChatId(chat_id),
          user_id,
        });
        return ok(`Join request declined for user ${user_id}!\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );
}

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

// Messages
import { registerMessageSendTools } from "./tools/messages/send.js";
import { registerMessageEditTools } from "./tools/messages/edit.js";
import { registerMessageForwardTools } from "./tools/messages/forward.js";
import { registerMessageManageTools } from "./tools/messages/manage.js";

// Chat
import { registerChatInfoTools } from "./tools/chat/info.js";
import { registerChatSettingsTools } from "./tools/chat/settings.js";
import { registerChatInviteTools } from "./tools/chat/invite.js";
import { registerChatMembersTools } from "./tools/chat/members.js";
import { registerChatVerifyTools } from "./tools/chat/verify.js";

// Bot
import { registerBotCoreTools } from "./tools/bot/core.js";
import { registerBotCommandsTools } from "./tools/bot/commands.js";
import { registerBotSettingsTools } from "./tools/bot/settings.js";
import { registerBotProfileTools } from "./tools/bot/profile.js";

// Other (unchanged)
import { registerForumTools } from "./tools/forum.js";
import { registerStickerTools } from "./tools/stickers.js";
import { registerPaymentTools } from "./tools/payments.js";
import { registerGameTools } from "./tools/games.js";
import { registerWebhookTools } from "./tools/webhook.js";
import { registerStoryTools } from "./tools/stories.js";
import { registerBusinessTools } from "./tools/business.js";

// ─── MCP Server ──────────────────────────────────────────────────────────────

const server = new McpServer({
  name: "telegram-bot",
  version: "3.0.3",
});

// ─── Register Tools ────────────────────────────────────────────────────────────

// Messages
registerMessageSendTools(server);
registerMessageEditTools(server);
registerMessageForwardTools(server);
registerMessageManageTools(server);

// Chat
registerChatInfoTools(server);
registerChatSettingsTools(server);
registerChatInviteTools(server);
registerChatMembersTools(server);
registerChatVerifyTools(server);

// Bot
registerBotCoreTools(server);
registerBotCommandsTools(server);
registerBotSettingsTools(server);
registerBotProfileTools(server);

// Other
registerForumTools(server);
registerStickerTools(server);
registerPaymentTools(server);
registerGameTools(server);
registerWebhookTools(server);
registerStoryTools(server);
registerBusinessTools(server);

// ─── Start ────────────────────────────────────────────────────────────────────

const transport = new StdioServerTransport();
await server.connect(transport);

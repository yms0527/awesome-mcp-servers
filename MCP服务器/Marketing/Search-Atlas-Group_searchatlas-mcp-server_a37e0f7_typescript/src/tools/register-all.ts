/**
 * Register all MCP tools on the server instance.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Config } from "../config.js";
import { registerAgentTools } from "./agent-tools.js";
import { registerProjectTools } from "./project-tools.js";
import { registerConversationTools } from "./conversation-tools.js";
import { registerArtifactTools } from "./artifact-tools.js";
import { registerPlaybookTools } from "./playbook-tools.js";

export function registerAllTools(server: McpServer, config: Config): void {
  registerAgentTools(server, config);
  registerProjectTools(server, config);
  registerConversationTools(server, config);
  registerArtifactTools(server, config);
  registerPlaybookTools(server, config);
}

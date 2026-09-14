import meow from "meow";
import { getUsageText } from "./getUsageText";

/**
 * Creates and configures a CLI parser using the meow library
 *
 * @returns Configured CLI parser instance
 */
export function createCliParser() {
  const usage = getUsageText();

  return meow(usage, {
    importMeta: import.meta,
    flags: {
      enableHttpTransport: {
        type: "boolean",
        default: false,
      },
      enableStdioTransport: {
        type: "boolean",
        default: true,
      },
      enableRestServer: {
        type: "boolean",
        default: false,
      },
      enableShellExecTool: {
        type: "boolean",
        default: false,
      },
      mcpHttpPort: {
        type: "number",
        default: 3001,
      },
      restHttpPort: {
        type: "number",
        default: 3002,
      },
      allowedDirectories: {
        type: "string",
        isMultiple: true,
        isRequired: true,
      },
      initialMode: {
        type: "string",
        default: "mcpAct",
        choices: ["mcpAct", "mcpPlan"],
      },
    },
  });
}

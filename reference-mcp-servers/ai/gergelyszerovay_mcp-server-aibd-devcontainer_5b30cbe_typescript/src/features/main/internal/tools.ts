import { createCreateDirectoryMcpTool } from "@features/tool-fs-create-directory/createCreateDirectoryMcpTool";
import { createDeleteMultipleFilesMcpTool } from "@features/tool-fs-delete-multiple-files/createDeleteMultipleFilesMcpTool";
import { createDirectoryTreeMcpTool } from "@features/tool-fs-directory-tree/createDirectoryTreeMcpTool";
import { createEditFileMcpTool } from "@features/tool-fs-edit-file/createEditFileMcpTool";
import { createGetFileInfoMcpTool } from "@features/tool-fs-get-file-info/createGetFileInfoMcpTool";
import { createListAllowedDirectoriesMcpTool } from "@features/tool-fs-list-allowed-directories/createListAllowedDirectoriesMcpTool";
import { createMoveFileMcpTool } from "@features/tool-fs-move-file/createMoveFileMcpTool";
import { createReadMultipleFilesMcpTool } from "@features/tool-fs-read-multiple-files/createReadMultipleFilesMcpTool";
import { createSearchFilesMcpTool } from "@features/tool-fs-search-files/createSearchFilesMcpTool";
import { createWriteFileMcpTool } from "@features/tool-fs-write-file/createWriteFileMcpTool";
import { createGetModeMcpTool } from "@features/tool-get-mode/createGetModeMcpTool";
import { createSetModeMcpTool } from "@features/tool-set-mode/createSetModeMcpTool";
import { createShellExecMcpTool } from "@features/tool-shell-exec/createShellExecMcpTool";
import type { McpTool } from "@shared/mcp-tool/McpTool";

// Note: Allowed directories are now set in main.ts from CLI arguments
import type { AppState } from "@features/app-state/AppState";

import type { CliArgs } from "@features/cli-args/CliArgs";

/**
 * Creates the tools array based on application state or CLI args
 * Conditionally includes tools based on CLI flags
 *
 * @param state - Current application state or CLI args
 * @returns Array of MCP tools
 */
export function getTools(state: AppState | CliArgs): McpTool[] {
  // Standard tools that are always available
  const standardTools: McpTool[] = [
    ...createGetModeMcpTool(),
    ...createSetModeMcpTool(),
    ...createReadMultipleFilesMcpTool(),
    ...createWriteFileMcpTool(),
    ...createEditFileMcpTool(),
    ...createCreateDirectoryMcpTool(),
    ...createDirectoryTreeMcpTool(),
    ...createMoveFileMcpTool(),
    ...createSearchFilesMcpTool(),
    ...createGetFileInfoMcpTool(),
    ...createListAllowedDirectoriesMcpTool(),
    ...createDeleteMultipleFilesMcpTool(),
  ];

  // Conditionally add shell execution tool if enabled
  if (state.enableShellExecTool) {
    return [...standardTools, ...createShellExecMcpTool()];
  }

  return standardTools;
}

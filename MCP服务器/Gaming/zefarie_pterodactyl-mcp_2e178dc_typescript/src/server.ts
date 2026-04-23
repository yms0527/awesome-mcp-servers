import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { PterodactylClient } from "./client/pterodactyl.client.js";
import { registerCompressFilesTool } from "./tools/compress-files.js";
import { registerCreateAllocationTool } from "./tools/create-allocation.js";
import { registerCreateBackupTool } from "./tools/create-backup.js";
import { registerCreateDatabaseTool } from "./tools/create-database.js";
import { registerCreateEggVariableTool } from "./tools/create-egg-variable.js";
import { registerCreateFolderTool } from "./tools/create-folder.js";
import { registerCreateScheduleTool } from "./tools/create-schedule.js";
import { registerCreateScheduleTaskTool } from "./tools/create-schedule-task.js";
import { registerCreateServerTool } from "./tools/create-server.js";
import { registerCreateSubuserTool } from "./tools/create-subuser.js";
import { registerCreateUserTool } from "./tools/create-user.js";
import { registerDecompressFileTool } from "./tools/decompress-file.js";
import { registerDeleteAllocationTool } from "./tools/delete-allocation.js";
import { registerDeleteBackupTool } from "./tools/delete-backup.js";
import { registerDeleteDatabaseTool } from "./tools/delete-database.js";
import { registerDeleteEggTool } from "./tools/delete-egg.js";
import { registerDeleteEggVariableTool } from "./tools/delete-egg-variable.js";
import { registerDeleteFilesTool } from "./tools/delete-files.js";
import { registerDeleteScheduleTool } from "./tools/delete-schedule.js";
import { registerDeleteScheduleTaskTool } from "./tools/delete-schedule-task.js";
import { registerDeleteServerTool } from "./tools/delete-server.js";
import { registerDeleteSubuserTool } from "./tools/delete-subuser.js";
import { registerDownloadBackupTool } from "./tools/download-backup.js";
import { registerDownloadFileTool } from "./tools/download-file.js";
import { registerExportEggTool } from "./tools/export-egg.js";
import { registerGetAccountTool } from "./tools/get-account.js";
import { registerGetEggTool } from "./tools/get-egg.js";
import { registerGetNestTool } from "./tools/get-nest.js";
import { registerGetNodeTool } from "./tools/get-node.js";
import { registerGetNodeConfigTool } from "./tools/get-node-config.js";
import { registerGetRecentLogsTool } from "./tools/get-recent-logs.js";
import { registerGetScheduleTool } from "./tools/get-schedule.js";
import { registerGetServerTool } from "./tools/get-server.js";
import { registerGetServerActivityTool } from "./tools/get-server-activity.js";
import { registerGetServerResourcesTool } from "./tools/get-server-resources.js";
import { registerGetStartupVariablesTool } from "./tools/get-startup-variables.js";
import { registerGetUserTool } from "./tools/get-user.js";
import { registerImportEggTool } from "./tools/import-egg.js";
import { registerKillServerTool } from "./tools/kill-server.js";
import { registerListAllocationsTool } from "./tools/list-allocations.js";
import { registerListBackupsTool } from "./tools/list-backups.js";
import { registerListClientDatabasesTool } from "./tools/list-client-databases.js";
import { registerListEggVariablesTool } from "./tools/list-egg-variables.js";
import { registerListEggsTool } from "./tools/list-eggs.js";
import { registerListFilesTool } from "./tools/list-files.js";
import { registerListMountsTool } from "./tools/list-mounts.js";
import { registerListNestsTool } from "./tools/list-nests.js";
import { registerListNodesTool } from "./tools/list-nodes.js";
import { registerListRolesTool } from "./tools/list-roles.js";
import { registerListSchedulesTool } from "./tools/list-schedules.js";
import { registerListServerDatabasesTool } from "./tools/list-server-databases.js";
import { registerListServersTool } from "./tools/list-servers.js";
import { registerListSubusersTool } from "./tools/list-subusers.js";
import { registerListUsersTool } from "./tools/list-users.js";
import { registerReadFileTool } from "./tools/read-file.js";
import { registerReinstallServerTool } from "./tools/reinstall-server.js";
import { registerRenameFileTool } from "./tools/rename-file.js";
import { registerRestartServerTool } from "./tools/restart-server.js";
import { registerRestoreBackupTool } from "./tools/restore-backup.js";
import { registerRotateDatabasePasswordTool } from "./tools/rotate-database-password.js";
import { registerSendCommandTool } from "./tools/send-command.js";
import { registerStartServerTool } from "./tools/start-server.js";
import { registerStopServerTool } from "./tools/stop-server.js";
import { registerSuspendServerTool } from "./tools/suspend-server.js";
import { registerUnsuspendServerTool } from "./tools/unsuspend-server.js";
import { registerUpdateEggVariableTool } from "./tools/update-egg-variable.js";
import { registerUpdateScheduleTool } from "./tools/update-schedule.js";
import { registerUpdateServerBuildTool } from "./tools/update-server-build.js";
import { registerUpdateServerDetailsTool } from "./tools/update-server-details.js";
import { registerUpdateServerStartupTool } from "./tools/update-server-startup.js";
import { registerUpdateSubuserTool } from "./tools/update-subuser.js";
import { registerUpdateUserTool } from "./tools/update-user.js";
import { registerWriteFileTool } from "./tools/write-file.js";
import { VERSION } from "./version.js";

const APP_TOOLS_COUNT = 34;
const CLIENT_TOOLS_COUNT = 39;

export function countTools(hasClientKey: boolean): number {
  return hasClientKey ? APP_TOOLS_COUNT + CLIENT_TOOLS_COUNT : APP_TOOLS_COUNT;
}

export function createServer(client: PterodactylClient): McpServer {
  const server = new McpServer({
    name: "pterodactyl-mcp",
    version: VERSION,
  });

  // ── Application API tools (always available) ──────────────────────────
  registerListServersTool(server, client);
  registerGetServerTool(server, client);
  registerSuspendServerTool(server, client);
  registerUnsuspendServerTool(server, client);
  registerReinstallServerTool(server, client);
  registerCreateServerTool(server, client);
  registerDeleteEggTool(server, client);
  registerDeleteServerTool(server, client);
  registerUpdateServerDetailsTool(server, client);
  registerUpdateServerBuildTool(server, client);
  registerUpdateServerStartupTool(server, client);
  registerListServerDatabasesTool(server, client);
  registerListUsersTool(server, client);
  registerGetUserTool(server, client);
  registerCreateUserTool(server, client);
  registerUpdateUserTool(server, client);
  registerListNodesTool(server, client);
  registerGetEggTool(server, client);
  registerGetNodeTool(server, client);
  registerGetNodeConfigTool(server, client);
  registerImportEggTool(server, client);
  registerListEggsTool(server, client);
  registerListRolesTool(server, client);
  registerListMountsTool(server, client);
  registerListNestsTool(server, client);
  registerGetNestTool(server, client);
  registerListAllocationsTool(server, client);
  registerCreateAllocationTool(server, client);
  registerDeleteAllocationTool(server, client);
  registerListEggVariablesTool(server, client);
  registerCreateEggVariableTool(server, client);
  registerUpdateEggVariableTool(server, client);
  registerDeleteEggVariableTool(server, client);
  registerExportEggTool(server, client);

  // ── Client API tools (only if clientKey is provided) ──────────────────
  if (client.hasClientKey) {
    registerGetServerResourcesTool(server, client);
    registerStartServerTool(server, client);
    registerStopServerTool(server, client);
    registerRestartServerTool(server, client);
    registerKillServerTool(server, client);
    registerSendCommandTool(server, client);
    registerListFilesTool(server, client);
    registerReadFileTool(server, client);
    registerWriteFileTool(server, client);
    registerCreateFolderTool(server, client);
    registerDeleteFilesTool(server, client);
    registerCompressFilesTool(server, client);
    registerDecompressFileTool(server, client);
    registerRenameFileTool(server, client);
    registerListBackupsTool(server, client);
    registerCreateBackupTool(server, client);
    registerListSchedulesTool(server, client);
    registerListClientDatabasesTool(server, client);
    registerListSubusersTool(server, client);
    registerGetStartupVariablesTool(server, client);
    registerGetAccountTool(server, client);
    registerGetScheduleTool(server, client);
    registerCreateScheduleTool(server, client);
    registerUpdateScheduleTool(server, client);
    registerDeleteScheduleTool(server, client);
    registerCreateScheduleTaskTool(server, client);
    registerDeleteScheduleTaskTool(server, client);
    registerCreateSubuserTool(server, client);
    registerUpdateSubuserTool(server, client);
    registerDeleteSubuserTool(server, client);
    registerCreateDatabaseTool(server, client);
    registerDeleteDatabaseTool(server, client);
    registerRotateDatabasePasswordTool(server, client);
    registerDeleteBackupTool(server, client);
    registerDownloadBackupTool(server, client);
    registerRestoreBackupTool(server, client);
    registerDownloadFileTool(server, client);
    registerGetRecentLogsTool(server, client);
    registerGetServerActivityTool(server, client);
  }

  return server;
}

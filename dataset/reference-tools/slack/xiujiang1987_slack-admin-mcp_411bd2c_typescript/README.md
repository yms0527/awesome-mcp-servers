# Slack Admin MCP Server

這是一個自訂的 Model Context Protocol (MCP) 伺服器，用於執行 Slack 頻道的管理操作。

## 功能

提供以下工具：

*   `slack_create_channel`：建立新的 Slack 頻道 (公開或私密)。
*   `slack_rename_channel`：重新命名現有的 Slack 頻道。
*   `slack_archive_channel`：封存現有的 Slack 頻道。

## 設定

1.  **取得 Slack Bot Token**：
    *   前往 [https://api.slack.com/apps](https://api.slack.com/apps) 建立或選擇一個 Slack App。
    *   在 "OAuth & Permissions" > "Bot Token Scopes" 中，確保至少加入以下權限：
        *   `channels:manage` (建立/封存/重新命名公開頻道)
        *   `groups:write` (建立/封存/重新命名私密頻道)
        *   `channels:read` (讀取頻道資訊)
        *   `groups:read` (讀取私密頻道資訊)
    *   重新安裝 App 到您的工作區以使權限生效。
    *   複製產生的 "Bot User OAuth Token" (以 `xoxb-` 開頭)。

2.  **設定 MCP**：
    *   將此伺服器加入您的 MCP 設定檔 (例如 `cline_mcp_settings.json`)。
    *   確保 `command`, `args`, `options.cwd`, `env.NODE_PATH` 指向正確的路徑。
    *   在 `env` 中設定 `SLACK_BOT_TOKEN` 為您取得的 Token。

    ```json
    "slack-admin-mcp": {
      "command": "cmd", // 或 node 的完整路徑
      "args": [
        "/c",
        "node", // 如果 command 是 cmd
        "D:\\Github_Project\\slack-admin-mcp\\build\\index.js" // 確認路徑正確
      ],
      "options": {
        "cwd": "D:\\Github_Project\\slack-admin-mcp" // 確認路徑正確
      },
      "env": {
        "SLACK_BOT_TOKEN": "YOUR_SLACK_BOT_TOKEN_HERE", // 替換成您的 Token
        "NODE_PATH": "D:\\Github_Project\\slack-admin-mcp\\node_modules" // 確認路徑正確
      },
      "disabled": false,
      "autoApprove": []
    }
    ```

## 開發

*   安裝依賴：`npm install`
*   建置：`npm run build`
*   監看變更並自動建置：`npm run watch`

## 使用

透過支援 MCP 的客戶端 (例如 Cline)，使用 `use_mcp_tool` 指令呼叫以下工具：

*   `slack_create_channel` (參數: `name`, `is_private` (可選, 預設 false))
*   `slack_rename_channel` (參數: `channel_id`, `new_name`)
*   `slack_archive_channel` (參數: `channel_id`)

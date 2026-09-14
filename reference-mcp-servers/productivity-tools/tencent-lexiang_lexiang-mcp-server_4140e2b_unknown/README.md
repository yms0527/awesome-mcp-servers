# Lexiang MCP Server

<p align="center">
  <a href="#中文">中文</a> | <a href="#english">English</a>
</p>

---

<a name="中文"></a>
## 中文

### 关于乐享

[腾讯乐享](https://lexiang.tencent.com/?event_type=link_exchange&event_channel=mcp&event_detail=github) 是**更懂企业的 AI 知识库**，通过 AI 技术激活团队私有知识价值，让知识触手可及。

**核心能力：**

- 🤖 **AI 智能问答**：锁定专属知识域，通过 AI 问答快速找下文
- 📚 **多格式全兼容**：支持文档、音视频、表格、图片等百余种格式
- 🔗 **多源知识入库**：聚合微信文件、微信公众号文章、腾讯会议、腾讯文档及本地文件入库
- 👥 **轻松协作**：多人在线编辑，任务即时下发，知识与业务紧密关联
- 🔒 **安全可控**：四级权限管控、防泄露水印、操作可追溯

### 什么是 Lexiang MCP

Lexiang MCP 是乐享提供的 [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) 服务，让 AI 助手能够直接与您的乐享知识库进行交互。

通过 Lexiang MCP，您可以在 AI 对话中：

- 🔍 **搜索知识**：在知识库中搜索文档和内容
- 📖 **阅读内容**：获取文档、页面的详细内容
- ✏️ **创建编辑**：创建新页面、编辑文档内容
- 📁 **管理组织**：移动、重命名、组织知识结构
- 📎 **文件操作**：上传、下载文件
- 🎥 **会议导入**：将腾讯会议录制导入知识库

### 快速开始

#### 认证方式说明

MCP 服务支持 **2 种认证方式**：

1. **方式 1：OAuth 登录（推荐）** ⭐
   - 不需要提前创建 token，直接点击"在 Cursor 中打开"或"在 VS Code 中打开"即可
   - MCP 客户端将重定向到登录页面进行身份验证
   - 支持浏览器自动跳转登录流程
   - 适用于：大多数场景，最简便快捷

2. **方式 2：手动配置 Access Token（备选）**
   - 在"会话管理"标签页创建会话，获取 `access_token`
   - 在 MCP 接入地址中通过 `access_token` URL 参数传递令牌
   - 适用于：需要完全控制认证过程或离线场景

> **推荐方案**：使用方式 1（OAuth 登录），无需创建会话，最快最简便。

#### 快速开始（推荐 OAuth 方式）

**最快的方式（只需 2 步）：**

1. 登录乐享后，访问 [https://lexiangla.com/mcp](https://lexiangla.com/mcp)
2. 点击页面上的 **"在 Cursor 中打开"** 或 **"在 VS Code 中打开"** 按钮
3. 在跳转的登录页面中完成身份验证

配置会自动导入，无需手动复制粘贴！

#### 手动配置方式（Token 方式）

如果需要手动配置，请按以下步骤操作：

1. 访问 [https://lexiangla.com/mcp](https://lexiangla.com/mcp)
2. 切换到 **"会话管理"** 标签页
3. 点击 **"新建会话"** 获得 `access_token`
4. 根据您的客户端类型，选择对应的配置方式：

---

##### Cursor / Cline / CodeBuddy 配置

编辑配置文件（支持 Remote URL OAuth）：

**配置文件位置：**
- Cursor：`.cursor/mcp.json`
- Cline：`.cline/mcp.json`  
- CodeBuddy：`.codebuddy/mcp.json` 或 `~/.codebuddy/mcp.json`

```json
{
  "mcpServers": {
    "lexiang": {
      "url": "https://mcp.lexiang-app.com/mcp?company_from={您的乐享code}&access_token={您的access_token}"
    }
  }
}
```

---

##### VS Code 配置 (settings.json)

编辑 VS Code 的 `settings.json`：

```json
{
  "mcp": {
    "servers": {
      "lexiang": {
        "url": "https://mcp.lexiang-app.com/mcp?company_from={您的乐享code}&access_token={您的access_token}"
      }
    }
  }
}
```

---

##### CodeBuddy 插件版 / Codebuddy Code 配置（需 npx）

> ⚠️ CodeBuddy 插件版和 Codebuddy Code 暂不支持 Remote URL OAuth 方式，需要通过 `npx mcp-remote` 桥接。请确保已安装 Node.js 环境。

```json
{
  "mcpServers": {
    "lexiang": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "https://mcp.lexiang-app.com/mcp?company_from={您的乐享code}&access_token={您的access_token}"
      ]
    }
  }
}
```

---

> **说明**：将 `{您的乐享code}` 和 `{您的access_token}` 替换为配置页面中显示的实际值。

### 高级配置：工具预设 (Preset)

通过在配置时选择不同的 `preset` 参数，控制 AI 助手可访问的工具类别。不指定时返回所有工具。

#### 支持的 Preset 预设

| Preset | 说明 |
|--------|------|
| `knowledge` | 完整知识库工具集（条目、知识库、文件、文档编辑、团队等） |
| `knowledge.entry` | 知识条目管理（创建、编辑、删除、搜索条目） |
| `knowledge.space` | 知识库管理（创建知识库、列表管理） |
| `knowledge.file` | 文件上传下载（支持 PDF、Word、图片等） |
| `knowledge.block` | 在线文档编辑（创建、更新、删除块结构） |
| `teamspace.team` | 团队管理（获取团队信息） |

#### 元工具说明

当不指定 `preset` 时，返回以下 4 个元工具用于动态发现和调用其他工具：

- `list_tool_categories` - 列出所有工具分类
- `search_tools` - 搜索工具
- `get_tool_schema` - 获取工具参数定义
- `call_tool` - 调用指定工具

#### 如何使用

1. 使用 OAuth 方式时，直接点击"在 Cursor/VS Code 中打开"即可使用所有工具
2. 如需限制工具范围，可选择预设后复制配置
3. 配置将自动包含选定的 `preset` 查询参数

**示例**：仅启用知识条目管理工具

```json
{
  "mcpServers": {
    "lexiang": {
      "url": "https://mcp.lexiang-app.com/mcp?company_from={您的乐享code}&preset=knowledge.entry"
    }
  }
}
```

> 💡 选择合适的预设可以让 AI 助手工具列表更简洁，加快响应速度。

### 使用示例

配置完成后，您可以直接在 AI 对话中操作乐享知识库：

#### 搜索知识

```
帮我搜索知识库中关于"产品规划"的文档
```

#### 创建页面

```
在"团队文档"空间中创建一个名为"Q1 会议纪要"的新页面
```

#### 更新版本日志

```
将本次更新，提交 github 仓库，同步更新到知识库版本更新日志中
```

> AI 会自动定位文档位置，在顶部插入新版本内容，历史记录原封不动。

#### 生成 API 文档

```
在同目录下，生成对应 API 文档，方便让其他系统调用
```

> AI 会分析代码中的接口结构，自动在乐享知识库中创建格式规范的 API 文档。

#### 导入会议录制

```
把会议号 123456789 的腾讯会议录制导入到知识库
```

### 为什么选择乐享知识库？

相比本地 Markdown 文件或其他在线文档工具，乐享知识库有几个独特优势：

1. **文档块（Block）级别的精准操作**
   - 本地文件只能全量覆盖，大部分在线文档只支持页面级操作
   - 乐享的 Block 设计让 AI 可以像"外科手术"一样精准更新文档任意位置
   - 对于版本日志、API 文档这种增量更新场景，这是刚需

2. **严肃场景下的文档审批**
   - 支持文档审批流，AI 生成的内容可先进入待审核状态
   - 经负责人确认后再正式发布，安全兜底

3. **一键分享，扩大影响力**
   - 便捷的文档共享，一个链接就能分享给客户、合作伙伴
   - 访问记录一目了然，支持点赞和评论

4. **AI 可二次消费的知识**
   - 文档不再是静态说明书，而是可被 AI 调用的"知识接口"
   - 在 CodeBuddy 中通过 MCP 直接读取 API 文档，自动完成接口集成

### 可用工具列表

Lexiang MCP 提供 **38 个工具**，覆盖以下场景：

| 分类 | 工具数 | 说明 |
|-----|-------|------|
| 知识条目操作 | 11 | 创建、查看、编辑、移动、搜索知识条目 |
| 文档块操作 | 8 | 在线文档的块级编辑操作 |
| 知识库操作 | 3 | 创建和管理知识库 |
| 文件操作 | 5 | 文件上传、下载、外链导入 |
| 搜索操作 | 2 | 关键词搜索和语义搜索 |
| 团队操作 | 3 | 获取团队信息 |
| 连接器 | 6 | 腾讯会议、iWiki 等外部内容导入 |

<details>
<summary>📋 点击查看完整工具列表</summary>

#### 知识条目操作

| 工具 | 描述 |
|------|------|
| `knowledge_create_entry` | 创建知识条目（页面/文件夹） |
| `knowledge_describe_entry` | 获取知识条目详情 |
| `knowledge_describe_ai_parse_content` | 获取 AI 可解析内容 |
| `knowledge_diff_entry_content` | 对比内容版本差异 |
| `knowledge_import_content` | 导入 markdown/html 内容 |
| `knowledge_list_children` | 列出子条目 |
| `knowledge_list_latest_entries` | 获取最近更新的条目 |
| `knowledge_list_parents` | 获取面包屑路径 |
| `knowledge_move_entry` | 移动条目 |
| `knowledge_rename_entry` | 重命名条目 |
| `knowledge_search_udf_entries` | 搜索条目 |

#### 文档块操作

| 工具 | 描述 |
|------|------|
| `block_create_block_descendant` | 创建子块 |
| `block_delete_block` | 删除块 |
| `block_delete_block_children` | 删除子块 |
| `block_describe_block` | 获取块详情 |
| `block_list_block_children` | 列出子块 |
| `block_move_blocks` | 移动块 |
| `block_update_block` | 更新块内容 |
| `block_update_blocks` | 批量更新块 |

#### 知识库操作

| 工具 | 描述 |
|------|------|
| `knowledge_create_space` | 创建知识库 |
| `knowledge_describe_space` | 获取知识库详情 |
| `knowledge_list_spaces` | 列出知识库 |

#### 文件操作

| 工具 | 描述 |
|------|------|
| `knowledge_apply_upload` | 申请上传凭证 |
| `knowledge_commit_upload` | 确认上传完成 |
| `knowledge_create_hyperlink` | 导入外部链接 |
| `knowledge_describe_file` | 获取文件信息 |
| `knowledge_download_file` | 获取下载地址 |

#### 搜索操作

| 工具 | 描述 |
|------|------|
| `search_kb_search` | 关键词搜索 |
| `search_kb_embedding_search` | 语义向量搜索 |

#### 团队操作

| 工具 | 描述 |
|------|------|
| `teamspace_describe_team` | 获取团队详情 |
| `teamspace_list_some_teams` | 批量获取团队 |
| `teamspace_list_teams` | 列出可访问团队 |

#### 连接器

| 工具 | 描述 |
|------|------|
| `connector_import_iwiki_doc` | 导入 iWiki 文档 |
| `connector_describe_tx_meeting_record` | 获取会议录制详情 |
| `connector_import_tx_meeting_record` | 导入会议录制 |
| `connector_list_tx_meeting_records` | 列出会议录制 |
| `connector_reload_tx_meeting_record` | 重新导入录制 |
| `connector_search_tx_meeting_records` | 搜索会议录制 |

</details>

### 常见问题

**问：出现"需要授权"错误怎么办？**

答：
1. 确保已从 [https://lexiangla.com/mcp](https://lexiangla.com/mcp) 获取正确的配置信息
2. 在 CodeBuddy 中点击「刷新」图标，完成 OAuth 授权
3. 检查 URL 中的 `company_from` 参数是否正确

**问：找不到我的知识库？**

答：MCP 只能访问您有权限的知识库，请在乐享中检查您的权限设置。

**问：文件上传失败？**

答：文件上传需要 3 步：
1. 调用 `apply_upload` 获取上传地址
2. HTTP PUT 上传文件（在 MCP 外部完成）
3. 调用 `commit_upload` 确认

**问：AI 更新文档时创建了新文档而不是更新原文档？**

答：可以明确告诉 AI："在原文档上进行更新，而不是生成新文档"，AI 会使用块级操作精准更新原文档。

### 相关链接

- [乐享官网](https://lexiang.tencent.com/?event_type=link_exchange&event_channel=mcp&event_detail=github)
- [乐享 MCP 配置页面](https://lexiangla.com/mcp)
- [MCP 协议规范](https://spec.modelcontextprotocol.io/)

---

<a name="english"></a>
## English

### About Lexiang

[Tencent Lexiang](https://lexiang.tencent.com/?event_type=link_exchange&event_channel=mcp&event_detail=github) is an **AI-powered enterprise knowledge base** that activates the value of team knowledge through AI technology, making knowledge accessible at your fingertips.

**Core Capabilities:**

- 🤖 **AI Q&A**: Lock into your dedicated knowledge domain and quickly find business context through AI
- 📚 **Multi-format Support**: Supports 100+ formats including documents, audio/video, spreadsheets, and images
- 🔗 **Multi-source Integration**: Aggregate WeChat files, WeChat media platform articles, Tencent Meeting, Tencent Docs, and local files
- 👥 **Easy Collaboration**: Real-time co-editing, instant task assignment, seamlessly integrated with business workflows
- 🔒 **Secure & Controllable**: Four-level access control, anti-leak watermarks, auditable operations

### What is Lexiang MCP

Lexiang MCP is a [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) service provided by Lexiang, enabling AI assistants to interact directly with your Lexiang knowledge bases.

With Lexiang MCP, you can perform the following in AI conversations:

- 🔍 **Search Knowledge**: Search documents and content in your knowledge bases
- 📖 **Read Content**: Get detailed content of documents and pages
- ✏️ **Create & Edit**: Create new pages and edit document content
- 📁 **Organize**: Move, rename, and organize knowledge structure
- 📎 **File Operations**: Upload and download files
- 🎥 **Import Meetings**: Import Tencent Meeting recordings to knowledge bases

### Quick Start

#### Authentication Methods

MCP service supports **2 authentication methods**:

1. **Method 1: OAuth Login (Recommended)** ⭐
   - No need to create a token in advance, just click "Open in Cursor" or "Open in VS Code"
   - MCP client will redirect to the login page for authentication
   - Supports automatic browser redirect login flow
   - Best for: Most scenarios, simplest and fastest

2. **Method 2: Manual Access Token Configuration (Alternative)**
   - Create a session in the "Session Management" tab to get an `access_token`
   - Pass the token via `access_token` URL parameter in the MCP endpoint
   - Best for: Scenarios requiring full control over authentication or offline use

> **Recommendation**: Use Method 1 (OAuth Login) - no session creation needed, fastest and simplest.

#### Quick Start (Recommended OAuth Method)

**Fastest way (only 2 steps):**

1. Log in to Lexiang, then visit [https://lexiangla.com/mcp](https://lexiangla.com/mcp)
2. Click **"Open in Cursor"** or **"Open in VS Code"** button on the page
3. Complete authentication in the redirected login page

Configuration will be imported automatically, no manual copy-paste needed!

#### Manual Configuration (Token Method)

If you need to configure manually, follow these steps:

1. Visit [https://lexiangla.com/mcp](https://lexiangla.com/mcp)
2. Switch to the **"Session Management"** tab
3. Click **"New Session"** to get your `access_token`
4. Choose the configuration method based on your client type:

---

##### Cursor / Cline / CodeBuddy Configuration

Edit configuration file (supports Remote URL OAuth):

**Configuration file locations:**
- Cursor: `.cursor/mcp.json`
- Cline: `.cline/mcp.json`
- CodeBuddy: `.codebuddy/mcp.json` or `~/.codebuddy/mcp.json`

```json
{
  "mcpServers": {
    "lexiang": {
      "url": "https://mcp.lexiang-app.com/mcp?company_from={your_lexiang_code}&access_token={your_access_token}"
    }
  }
}
```

---

##### VS Code Configuration (settings.json)

Edit VS Code's `settings.json`:

```json
{
  "mcp": {
    "servers": {
      "lexiang": {
        "url": "https://mcp.lexiang-app.com/mcp?company_from={your_lexiang_code}&access_token={your_access_token}"
      }
    }
  }
}
```

---

##### CodeBuddy Plugin / Codebuddy Code Configuration (requires npx)

> ⚠️ CodeBuddy Plugin and Codebuddy Code do not support Remote URL OAuth yet. You need to use `npx mcp-remote` as a bridge. Make sure Node.js is installed.

```json
{
  "mcpServers": {
    "lexiang": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "https://mcp.lexiang-app.com/mcp?company_from={your_lexiang_code}&access_token={your_access_token}"
      ]
    }
  }
}
```

---

> **Note**: Replace `{your_lexiang_code}` and `{your_access_token}` with the actual values shown on the configuration page.

### Advanced Configuration: Tool Presets

Control which tool categories the AI assistant can access by selecting different `preset` parameters. All tools are returned when not specified.

#### Supported Presets

| Preset | Description |
|--------|-------------|
| `knowledge` | Complete knowledge base toolset (entries, spaces, files, document editing, teams, etc.) |
| `knowledge.entry` | Knowledge entry management (create, edit, delete, search entries) |
| `knowledge.space` | Knowledge space management (create spaces, list management) |
| `knowledge.file` | File upload/download (supports PDF, Word, images, etc.) |
| `knowledge.block` | Online document editing (create, update, delete block structures) |
| `teamspace.team` | Team management (get team information) |

#### Meta Tools

When `preset` is not specified, the following 4 meta tools are returned for dynamic discovery and invocation:

- `list_tool_categories` - List all tool categories
- `search_tools` - Search for tools
- `get_tool_schema` - Get tool parameter definitions
- `call_tool` - Call a specific tool

#### How to Use

1. With OAuth method, click "Open in Cursor/VS Code" to access all tools
2. To limit tool scope, select a preset before copying the configuration
3. The configuration will automatically include the selected `preset` query parameter

**Example**: Enable only knowledge entry management tools

```json
{
  "mcpServers": {
    "lexiang": {
      "url": "https://mcp.lexiang-app.com/mcp?company_from={your_lexiang_code}&preset=knowledge.entry"
    }
  }
}
```

> 💡 Choosing the right preset makes the AI assistant's tool list cleaner and improves response speed.

### Usage Examples

After configuration, you can interact with your Lexiang knowledge base directly in AI conversations:

#### Search Knowledge

```
Search for documents about "product planning" in my knowledge base
```

#### Create Page

```
Create a new page titled "Q1 Meeting Notes" in the "Team Documents" space
```

#### Update Version Log

```
Commit this update to github and sync to the version changelog in the knowledge base
```

> AI will automatically locate the document position and insert new version content at the top, keeping historical records intact.

#### Generate API Documentation

```
Generate API documentation in the same directory for other systems to call
```

> AI will analyze the interface structure in the code and automatically create well-formatted API documentation in Lexiang.

#### Import Meeting Recording

```
Import the Tencent Meeting recording with meeting ID 123456789 to my knowledge base
```

### Why Choose Lexiang Knowledge Base?

Compared to local Markdown files or other online document tools, Lexiang offers unique advantages:

1. **Block-level Precision Operations**
   - Local files can only be fully overwritten; most online docs only support page-level operations
   - Lexiang's Block design allows AI to precisely update any position in a document like "surgery"
   - Essential for incremental update scenarios like version logs and API documentation

2. **Document Approval for Serious Scenarios**
   - Supports document approval workflows; AI-generated content can enter pending review status
   - Officially published only after responsible person confirmation

3. **One-click Sharing**
   - Easy document sharing with a single link to customers and partners
   - Clear access records with like and comment features

4. **AI-consumable Knowledge**
   - Documents are no longer static manuals but "knowledge interfaces" callable by AI
   - Read API docs via MCP in CodeBuddy to automatically complete interface integration

### Available Tools

Lexiang MCP provides **38 tools** covering the following scenarios:

| Category | Count | Description |
|----------|-------|-------------|
| Knowledge Entry Operations | 11 | Create, view, edit, move, search knowledge entries |
| Document Block Operations | 8 | Block-level editing for online documents |
| Knowledge Space Operations | 3 | Create and manage knowledge spaces |
| File Operations | 5 | File upload, download, external link import |
| Search Operations | 2 | Keyword search and semantic search |
| Team Operations | 3 | Get team information |
| Connectors | 6 | Import from Tencent Meeting, iWiki, etc. |

<details>
<summary>📋 Click to view full tool list</summary>

#### Knowledge Entry Operations

| Tool | Description |
|------|-------------|
| `knowledge_create_entry` | Create knowledge entries (page/folder) |
| `knowledge_describe_entry` | Get knowledge entry details |
| `knowledge_describe_ai_parse_content` | Get AI-parseable content |
| `knowledge_diff_entry_content` | Compare content versions |
| `knowledge_import_content` | Import markdown/html content |
| `knowledge_list_children` | List child entries |
| `knowledge_list_latest_entries` | Get recently updated entries |
| `knowledge_list_parents` | Get breadcrumb path |
| `knowledge_move_entry` | Move entry |
| `knowledge_rename_entry` | Rename entry |
| `knowledge_search_udf_entries` | Search entries |

#### Document Block Operations

| Tool | Description |
|------|-------------|
| `block_create_block_descendant` | Create child blocks |
| `block_delete_block` | Delete block |
| `block_delete_block_children` | Delete child blocks |
| `block_describe_block` | Get block details |
| `block_list_block_children` | List child blocks |
| `block_move_blocks` | Move blocks |
| `block_update_block` | Update block content |
| `block_update_blocks` | Batch update blocks |

#### Knowledge Space Operations

| Tool | Description |
|------|-------------|
| `knowledge_create_space` | Create knowledge space |
| `knowledge_describe_space` | Get space details |
| `knowledge_list_spaces` | List spaces |

#### File Operations

| Tool | Description |
|------|-------------|
| `knowledge_apply_upload` | Request upload credentials |
| `knowledge_commit_upload` | Confirm upload completion |
| `knowledge_create_hyperlink` | Import external links |
| `knowledge_describe_file` | Get file metadata |
| `knowledge_download_file` | Get download URL |

#### Search Operations

| Tool | Description |
|------|-------------|
| `search_kb_search` | Keyword search |
| `search_kb_embedding_search` | Semantic vector search |

#### Team Operations

| Tool | Description |
|------|-------------|
| `teamspace_describe_team` | Get team details |
| `teamspace_list_some_teams` | Get multiple teams |
| `teamspace_list_teams` | List accessible teams |

#### Connectors

| Tool | Description |
|------|-------------|
| `connector_import_iwiki_doc` | Import iWiki documents |
| `connector_describe_tx_meeting_record` | Get meeting recording details |
| `connector_import_tx_meeting_record` | Import meeting recording |
| `connector_list_tx_meeting_records` | List meeting recordings |
| `connector_reload_tx_meeting_record` | Re-import recording |
| `connector_search_tx_meeting_records` | Search meeting recordings |

</details>

### FAQ

**Q: I get "Authorization Required" errors**

A:
1. Make sure you obtained the correct configuration from [https://lexiangla.com/mcp](https://lexiangla.com/mcp)
2. Click the "Refresh" icon in CodeBuddy to complete OAuth authorization
3. Verify the `company_from` parameter in the URL is correct

**Q: I can't find my knowledge spaces**

A: MCP can only access spaces you have permission to. Check your permissions in Lexiang.

**Q: File upload fails**

A: File upload requires 3 steps:
1. Call `apply_upload` to get upload URL
2. HTTP PUT the file (done outside MCP)
3. Call `commit_upload` to confirm

**Q: AI created a new document instead of updating the original?**

A: You can explicitly tell AI: "Update the original document instead of creating a new one", and AI will use block-level operations to precisely update the original document.

### Related Links

- [Lexiang Official Website](https://lexiang.tencent.com/?event_type=link_exchange&event_channel=mcp&event_detail=github)
- [Lexiang MCP Configuration Page](https://lexiangla.com/mcp)
- [MCP Protocol Specification](https://spec.modelcontextprotocol.io/)

---

## License / 许可证

This documentation is provided by Tencent Lexiang team. Usage is subject to Lexiang's terms of service.

本文档由腾讯乐享团队提供，使用须遵守乐享服务条款。

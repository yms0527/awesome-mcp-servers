# YApi MCP

<p>
  <a href="./README.md"><strong>中文</strong></a>
  ·
  <a href="./README.en.md">English</a>
</p>

用于读取 YApi 接口元数据的 MCP server。你可以通过 YApi 页面 URL、接口 ID 或项目 ID 获取接口路径、请求参数、请求体、响应结构等信息。

它刻意保持项目无关：这个 MCP 只负责从 YApi 拉取结构化数据，至于如何生成 `services`、TypeScript 类型、model 或 API client，可以交给你的编码 agent 或项目专用生成器完成。

<!-- mcp-name: io.github.xiaozhi666666/yapi-mcp -->

## 功能

- 通过 YApi 页面 URL 或接口 ID 获取单个接口详情。
- 读取 YApi 项目的接口目录。
- 按关键字分页搜索项目接口。
- 支持 YApi 项目 token 鉴权和 cookie/session 鉴权。
- 返回归一化后的请求/响应元数据，也可按需返回原始 YApi 数据。

## 安装

```bash
npm install -g yapi-fetch-mcp
```

本地开发：

```bash
git clone https://github.com/xiaozhi666666/yapi-mcp.git
cd yapi-mcp
npm install
npm run build
```

## 配置

如果你的 YApi 支持项目 token，推荐使用：

```bash
export YAPI_HOST="https://yapi.example.com"
export YAPI_TOKEN="project-token"
```

如果你的 YApi 只能通过登录态访问，可以复制浏览器 cookie：

```bash
export YAPI_HOST="https://yapi.example.com"
export YAPI_COOKIE="_yapi_token=...; _yapi_uid=..."
```

工具参数里也可以直接传 `host`、`token` 和 `cookie`。

### 如何获取长期 Token

`YAPI_TOKEN` 指的是 YApi 的项目 token，通常是项目级别的长期 token。获取方式一般如下：

1. 打开对应的 YApi 项目。
2. 进入项目的 `设置`、`项目设置` 或类似页面。
3. 找到 `Token`、`项目 Token` 或 `开放接口 Token`。
4. 复制 token，并配置为 `YAPI_TOKEN`。

配置后，本 MCP 会把它作为 YApi API 的 `token` 查询参数发送，例如：

```text
/api/interface/get?id=123&token=project-token
```

注意：这里的 `YAPI_TOKEN` 不是所有系统里的 `accessToken`。如果你的 `accessToken` 可以直接作为 YApi API 的 `token` 参数使用，就可以填到 `YAPI_TOKEN`；如果它必须通过 `Authorization: Bearer ...` 请求头传递，当前版本不会自动处理，请改用 `YAPI_COOKIE` 或按你的私有化 YApi 鉴权方式扩展代码。

## MCP 客户端配置

### Codex 项目级配置

如果你使用 Codex，并且希望这个 MCP 只在某个业务项目里生效，可以在该业务项目根目录创建：

```text
.codex/config.toml
```

写入：

```toml
[mcp_servers.yapi]
command = "npx"
args = ["-y", "yapi-fetch-mcp"]

[mcp_servers.yapi.env]
YAPI_HOST = "https://yapi.example.com"
YAPI_TOKEN = "project-token"
```

然后在 Codex 中打开或重启这个项目。Codex 只有在项目被信任后才会加载项目级 `.codex/config.toml`。

注意：如果 `.codex/config.toml` 会提交到 Git，不建议把真实 `YAPI_TOKEN` 写进去。可以只提交示例配置，或者把真实 token 放到你的个人 `~/.codex/config.toml` 中。

推荐用 `npx`：

```json
{
  "mcpServers": {
    "yapi": {
      "command": "npx",
      "args": ["-y", "yapi-fetch-mcp"],
      "env": {
        "YAPI_HOST": "https://yapi.example.com",
        "YAPI_TOKEN": "project-token"
      }
    }
  }
}
```

如果已经全局安装，也可以直接使用命令：

```json
{
  "mcpServers": {
    "yapi": {
      "command": "yapi-fetch-mcp",
      "env": {
        "YAPI_HOST": "https://yapi.example.com",
        "YAPI_TOKEN": "project-token"
      }
    }
  }
}
```

从源码运行：

```json
{
  "mcpServers": {
    "yapi": {
      "command": "node",
      "args": ["/absolute/path/to/yapi-mcp/build/src/index.js"],
      "env": {
        "YAPI_HOST": "https://yapi.example.com",
        "YAPI_TOKEN": "project-token"
      }
    }
  }
}
```

## 工具

### `get_interface`

通过 URL 或接口 ID 获取单个接口详情。

```json
{
  "url": "https://yapi.example.com/project/12/interface/api/345"
}
```

```json
{
  "host": "https://yapi.example.com",
  "interfaceId": 345,
  "token": "project-token"
}
```

返回字段包括：

- `method`
- `path`
- `headers`
- `query`
- `pathParams`
- `bodySchema`
- `responseSchema`
- 当 `includeRaw` 为 `true` 时返回原始 YApi 数据

### `list_project_interfaces`

读取 YApi 项目的接口目录。

```json
{
  "url": "https://yapi.example.com/project/12/interface/api/345"
}
```

### `search_project_interfaces`

按关键字分页搜索项目接口。

```json
{
  "projectId": 12,
  "keyword": "order",
  "page": 1,
  "limit": 20
}
```

## MCP Registry

仓库已经包含 `server.json` 和 `package.json#mcpName`，npm 包发布后可以继续走 MCP Registry 发布流程。

常见发布流程：

```bash
npm publish --access public
mcp-publisher login github
mcp-publisher publish
```

npm 包名：

```text
yapi-fetch-mcp
```

Registry server name：

```text
io.github.xiaozhi666666/yapi-mcp
```

## 说明

当前使用的常见 YApi API：

- `/api/interface/get?id=:interfaceId`
- `/api/interface/list_menu?project_id=:projectId`
- `/api/interface/list?project_id=:projectId&page=1&limit=20`

部分私有化 YApi 可能改造过鉴权方式。如果 token 不可用，可以尝试 `YAPI_COOKIE`。

## License

MIT

# Playwright MCP Server

![GitHub](https://img.shields.io/github/license/ma-pony/mcp-playwright)
![Python](https://img.shields.io/badge/python-3.10+-blue.svg)
![Playwright](https://img.shields.io/badge/playwright-1.51.0+-green.svg)
![MCP](https://img.shields.io/badge/MCP-compatible-purple.svg)

一个基于 FastMCP 框架的专业级 Playwright 浏览器自动化 MCP 服务器，为 LLM 应用提供强大的网页交互和数据提取能力。

## 🌟 特性

### 🎯 核心功能
- **浏览器自动化**: 完整的 Playwright 浏览器控制能力
- **多引擎支持**: 支持 Chromium、Firefox、WebKit
- **会话管理**: 独立的浏览器会话，支持并发操作
- **资源管理**: 智能的生命周期管理和资源清理
- **错误恢复**: 完善的错误处理和超时控制

### 🏗️ 工程化特性
- **模块化设计**: 清晰的代码架构和职责分离
- **类型安全**: 完整的 TypeScript 风格类型注解
- **异步安全**: 基于 asyncio 的并发安全实现
- **生命周期管理**: 使用 FastMCP 的生命周期机制
- **日志系统**: 结构化的日志记录和监控

### 🛠️ 工具集合
- **浏览器控制**: 创建/关闭会话、页面导航
- **页面交互**: 点击、输入、等待元素
- **数据提取**: 文本内容、属性值、页面信息
- **高级功能**: 截图、JavaScript 执行
- **资源接口**: 会话状态、健康检查

## 🚀 快速开始

### 安装

```bash
# 从 PyPI 安装（推荐）
pip install mcp-playwright

# 或使用 uv
uv add mcp-playwright

# 安装 Playwright 浏览器
playwright install

# 开发安装（从源码）
git clone https://github.com/ma-pony/mcp-playwright.git
cd mcp-playwright

# 使用 uv 安装依赖（推荐）
uv sync

# 或使用 pip
pip install -e .

# 安装 Playwright 浏览器
uv run playwright install
# 或
playwright install
```

### 运行服务器

```bash
# 使用已安装的包
mcp-playwright

# 或从源码运行
python main.py

# 或使用 uv
uv run python main.py

# 使用 MCP 开发工具
uv run mcp dev main.py
```

### Claude Desktop 集成

将以下配置添加到 Claude Desktop 的 MCP 配置文件中：

```json
{
  "mcpServers": {
    "playwright": {
      "command": "mcp-playwright"
    }
  }
}
```

或者如果从源码运行：

```json
{
  "mcpServers": {
    "playwright": {
      "command": "uv",
      "args": ["run", "python", "/path/to/mcp-playwright/main.py"],
      "env": {}
    }
  }
}
```

## 📖 使用指南

### 基本工作流程

1. **创建浏览器会话**
```python
# 使用 create_browser_session 工具
await create_browser_session(
    browser_type="chromium",
    headless=True,
    viewport_width=1280,
    viewport_height=720
)
```

2. **导航到目标网站**
```python
await navigate_to_url("https://example.com")
```

3. **页面交互**
```python
# 点击元素
await click_element("#login-button")

# 填写表单
await fill_input("#username", "your-username")
await fill_input("#password", "your-password")

# 等待元素
await wait_for_selector(".dashboard", state="visible")
```

4. **数据提取**
```python
# 获取文本内容
title = await get_page_title()
content = await get_text_content(".main-content")

# 获取属性值
href = await get_element_attribute("a.download", "href")
```

5. **截图和分析**
```python
# 截取页面截图
screenshot = await take_screenshot(full_page=True)

# 执行 JavaScript
result = await execute_javascript("return document.readyState")
```

6. **关闭会话**
```python
await close_browser_session()
```

### 高级用法

#### 错误处理
所有工具都内置了完善的错误处理，会返回详细的错误信息：

```python
# 如果元素不存在或超时，会返回描述性错误信息
result = await click_element("#non-existent", timeout=5000)
# 返回: "点击超时: #non-existent"
```

#### 会话状态监控
```python
# 检查会话状态
status = await get_resource("session://status")

# 检查浏览器健康状态
health = await get_resource("browser://health")
```

## 🏗️ 架构设计

### 核心组件

```
┌─────────────────────────────────────────────┐
│        Playwright MCP 服务器                 │
│  ┌─────────────┬─────────────┬─────────────┐ │
│  │   会话管理   │   工具层     │   资源层     │ │
│  └─────────────┴─────────────┴─────────────┘ │
├─────────────────────────────────────────────┤
│           Playwright 管理器                  │
│  ┌─────────────┬─────────────┬─────────────┐ │
│  │ 浏览器池     │  页面管理    │  生命周期    │ │
│  └─────────────┴─────────────┴─────────────┘ │
└─────────────────────────────────────────────┘
```

### 设计原则

- **工程化**: 模块化设计、依赖注入、统一配置
- **稳定性**: 资源管理、异步安全、优雅关闭
- **可扩展性**: 插件架构、会话隔离、类型安全

详细架构说明请参阅 [TECHNICAL_ARCHITECTURE.md](./TECHNICAL_ARCHITECTURE.md)

## 🛠️ 工具参考

### 浏览器控制
- `create_browser_session` - 创建新的浏览器会话
- `close_browser_session` - 关闭当前浏览器会话
- `navigate_to_url` - 导航到指定URL

### 页面交互
- `click_element` - 点击页面元素
- `fill_input` - 填写输入框
- `wait_for_selector` - 等待元素出现

### 数据提取
- `get_text_content` - 获取元素文本内容
- `get_element_attribute` - 获取元素属性值
- `get_page_title` - 获取页面标题
- `get_page_url` - 获取当前页面URL

### 高级功能
- `take_screenshot` - 截取页面截图
- `execute_javascript` - 执行JavaScript代码

### 资源接口
- `session://status` - 当前会话状态
- `browser://health` - 浏览器健康检查
- `help://tools` - 工具使用帮助

## 🔧 配置选项

### 浏览器配置
- `browser_type`: 浏览器类型（chromium, firefox, webkit）
- `headless`: 无头模式（默认: true）
- `max_sessions`: 最大会话数（默认: 10）

### 性能配置
- `default_timeout`: 默认超时时间（默认: 30000ms）
- `viewport_width`: 视口宽度（默认: 1280）
- `viewport_height`: 视口高度（默认: 720）

## 🧪 测试

```bash
# 运行单元测试
uv run pytest tests/

# 运行特定测试
uv run pytest tests/test_browser_manager.py

# 运行集成测试
uv run pytest tests/integration/
```

## 📊 性能优化

### 资源管理
- 智能会话池化，避免频繁创建/销毁浏览器
- 弱引用管理，防止内存泄漏
- 自动资源清理，确保稳定运行

### 并发控制
- 异步锁保护关键操作
- 最大会话数限制，防止资源耗尽
- 上下文管理器确保资源释放

## 🔒 安全考虑

### 访问控制
- 会话隔离，防止交叉访问
- 超时控制，避免长时间占用
- 错误边界，防止异常传播

### 资源限制
- 最大会话数限制
- 内存使用监控
- CPU 使用优化

## 🤝 贡献

欢迎贡献代码！请遵循以下步骤：

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

### 开发环境设置

```bash
# 克隆你的 fork
git clone https://github.com/your-username/mcp-playwright.git

# 安装开发依赖
uv sync --dev

# 运行代码格式化
uv run black .
uv run isort .

# 运行类型检查
uv run mypy .
```

## 📄 许可证

本项目采用 MIT 许可证 - 详情请参阅 [LICENSE](LICENSE) 文件。

## 🙏 致谢

- [Playwright](https://playwright.dev/) - 强大的浏览器自动化库
- [FastMCP](https://github.com/modelcontextprotocol/python-sdk) - 现代化的 MCP 框架
- [Model Context Protocol](https://modelcontextprotocol.io/) - LLM 上下文协议标准

## 📞 支持

如果您有任何问题或需要帮助：

- 📁 [提交 Issue](https://github.com/your-username/mcp-playwright/issues)
- 💬 [讨论区](https://github.com/your-username/mcp-playwright/discussions)
- 📧 Email: your-email@example.com

---

**Playwright MCP Server** - 为 LLM 应用提供强大的浏览器自动化能力 🚀

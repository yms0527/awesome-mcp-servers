# Playwright MCP Server 部署指南

本指南详细说明如何部署和配置Playwright MCP服务器。

## 🛠️ 环境准备

### 系统要求

- **操作系统**: macOS, Linux, Windows
- **Python版本**: >= 3.10
- **内存**: 至少2GB RAM
- **磁盘空间**: 至少1GB（用于浏览器安装）

### 依赖工具

- `uv` - Python包管理器（推荐）
- `git` - 版本控制

## 📦 安装步骤

### 1. 克隆项目

```bash
git clone <your-repository-url>
cd mcp-playwright
```

### 2. 安装Python依赖

```bash
# 使用uv (推荐)
uv sync

# 或使用pip
pip install -e .
```

### 3. 安装Playwright浏览器

```bash
# 使用uv
uv run python -m playwright install

# 或使用pip环境
python -m playwright install
```

### 4. 验证安装

```bash
# 运行快速测试
uv run python test_quick.py

# 或运行完整测试
uv run python -m pytest tests/ -v
```

## 🔧 配置MCP客户端

### Claude Desktop配置

1. 找到Claude Desktop配置文件：
   - **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

2. 添加MCP服务器配置：

```json
{
  "mcpServers": {
    "playwright": {
      "command": "uv",
      "args": [
        "--directory",
        "/path/to/mcp-playwright",
        "run",
        "python",
        "main.py"
      ],
      "env": {
        "PYTHONPATH": "/path/to/mcp-playwright"
      }
    }
  }
}
```

**重要**: 将 `/path/to/mcp-playwright` 替换为实际的项目路径。

### 其他MCP客户端

对于其他支持MCP协议的客户端，使用以下启动命令：

```bash
cd /path/to/mcp-playwright
uv run python main.py
```

## 🚀 运行服务器

### 开发模式

```bash
# 直接运行
uv run python main.py

# 运行示例
uv run python examples/usage_example.py
```

### 生产模式

```bash
# 使用守护进程运行
nohup uv run python main.py > mcp-playwright.log 2>&1 &

# 或使用systemd (Linux)
# 创建服务文件: /etc/systemd/system/mcp-playwright.service
```

## 📋 使用示例

### 基础操作

1. **启动浏览器**
```python
await launch_browser(browser_type="chromium", headless=True)
```

2. **导航到页面**
```python
await navigate_to_url("https://example.com")
```

3. **交互操作**
```python
await click_element("button#submit")
await fill_input("input[name='username']", "testuser")
```

4. **数据提取**
```python
title = await get_page_title()
text = await get_text_content("h1")
```

5. **截图**
```python
await take_screenshot("screenshot.png", full_page=True)
```

6. **关闭浏览器**
```python
await close_browser()
```

### 高级用法

```python
# 等待动态内容
await wait_for_selector(".dynamic-content", timeout=10000)

# 执行JavaScript
result = await execute_javascript("return document.readyState")

# 获取元素属性
href = await get_element_attribute("a.link", "href")
```

## 🔧 配置优化

### 性能调优

1. **浏览器设置**
```python
# 启用无头模式提高性能
await launch_browser(headless=True)

# 调整视口大小
await launch_browser(viewport_width=1920, viewport_height=1080)
```

2. **超时设置**
```python
# 调整默认超时时间
DEFAULT_TIMEOUT = 60000  # 60秒
```

3. **资源管理**
```python
# 及时关闭浏览器实例
await close_browser()
```

### 安全配置

1. **网络限制**
   - 配置防火墙规则
   - 限制访问域名

2. **资源限制**
   - 设置内存限制
   - 配置CPU使用率限制

## 🔍 监控和日志

### 状态监控

```python
# 检查浏览器状态
status = get_browser_status()

# 获取页面信息
page_info = get_current_page_info()
```

### 日志配置

```bash
# 启用详细日志
export PLAYWRIGHT_DEBUG=1
uv run python main.py
```

### 健康检查

```bash
# 创建健康检查脚本
#!/bin/bash
uv run python test_quick.py
if [ $? -eq 0 ]; then
    echo "服务器正常运行"
    exit 0
else
    echo "服务器异常"
    exit 1
fi
```

## 🛡️ 故障排除

### 常见问题

1. **浏览器启动失败**
```bash
# 重新安装浏览器
uv run python -m playwright install --force
```

2. **依赖冲突**
```bash
# 清理并重新安装
uv sync --refresh
```

3. **权限问题**
```bash
# 确保有执行权限
chmod +x main.py
```

4. **内存不足**
   - 检查系统内存使用情况
   - 适当增加swap空间
   - 使用无头模式减少内存消耗

### 调试模式

```bash
# 启用调试模式
export DEBUG=1
export PLAYWRIGHT_DEBUG=1
uv run python main.py
```

### 日志分析

```bash
# 查看错误日志
tail -f mcp-playwright.log | grep ERROR

# 分析性能日志
tail -f mcp-playwright.log | grep "timeout"
```

## 📊 性能基准

### 典型操作时间

- 启动浏览器: 2-5秒
- 页面导航: 1-3秒
- 元素点击: 0.1-1秒
- 截图操作: 0.5-2秒
- JavaScript执行: 0.1-5秒

### 系统资源使用

- 内存消耗: 100-500MB
- CPU使用: 10-50%
- 磁盘IO: 低

## 🔄 更新和维护

### 版本更新

```bash
# 更新代码
git pull origin main

# 重新安装依赖
uv sync

# 重启服务
# 根据你的部署方式重启服务器
```

### 定期维护

1. **清理临时文件**
2. **更新浏览器版本**
3. **检查日志文件大小**
4. **监控系统资源使用**

### 备份和恢复

```bash
# 备份配置文件
tar -czf mcp-playwright-backup.tar.gz .

# 恢复配置
tar -xzf mcp-playwright-backup.tar.gz
```

## 📞 技术支持

遇到问题时，请：

1. 检查日志文件
2. 运行诊断脚本
3. 查看GitHub Issues
4. 提交新的Issue（包含详细的错误信息和环境信息）

---

**提示**: 定期检查项目更新，确保使用最新版本的功能和安全修复。

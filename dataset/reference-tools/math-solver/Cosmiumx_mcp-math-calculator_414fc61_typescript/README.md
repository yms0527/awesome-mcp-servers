# mcp-math-calculator

🧮 **精确数学计算的 MCP 服务器** - 为 AI 提供 100% 准确的计算能力

[![npm version](https://img.shields.io/npm/v/mcp-math-calculator)](https://www.npmjs.com/package/mcp-math-calculator)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🌟 特性

- ✅ **精确算术运算** - 解决浮点数精度问题（如 0.1 + 0.2 = 0.3）
- ✅ **大数支持** - 处理超出 JavaScript 安全整数范围的数字
- ✅ **复杂表达式** - 支持括号、运算符优先级
- ✅ **科学函数** - sqrt, pow, sin, cos, log, exp 等 300+ 函数
- ✅ **安全求值** - 无代码注入风险，沙箱隔离执行
- ✅ **超时保护** - 5秒自动超时，防止恶意计算

## 📦 安装

### 快速开始（推荐）

在你的 MCP 客户端配置中添加（如 Claude Desktop）：

**macOS/Linux:**
`~/Library/Application Support/Claude/claude_desktop_config.json`

**Windows:**
`%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "math-calculator": {
      "command": "npx",
      "args": ["-y", "mcp-math-calculator"]
    }
  }
}
```

### 方式 2: 全局安装

```bash
npm install -g mcp-math-calculator
# 或
pnpm add -g mcp-math-calculator
```

然后配置：

```json
{
  "mcpServers": {
    "math-calculator": {
      "command": "mcp-math-calculator"
    }
  }
}
```

## 🚀 使用方法

配置完成后，重启你的 AI 客户端，然后可以这样提问：

- "精确计算 0.1 + 0.2"
- "123456789 * 987654321 等于多少？"
- "计算 (10 + 20) * 3 / 2"
- "sqrt(16) + pow(2, 3) 的值是多少？"
- "帮我算一下 sin(pi/2)"

AI 会自动调用此工具进行精确计算。

## 🛠️ 可用工具

### `calculate`

精确计算数学表达式。

**参数：**
- `expression` (string, 必需): 要计算的数学表达式
- `precision` (number, 可选): 小数精度位数（默认: 15，范围: 1-64）

**支持的运算：**

| 类型 | 示例 |
|------|------|
| 基础运算 | `+`, `-`, `*`, `/`, `^`, `%` |
| 括号 | `(`, `)` |
| 函数 | `sqrt()`, `pow()`, `abs()`, `round()`, `floor()`, `ceil()` |
| 三角函数 | `sin()`, `cos()`, `tan()`, `asin()`, `acos()`, `atan()` |
| 对数指数 | `log()`, `log10()`, `log2()`, `exp()` |
| 常数 | `pi`, `e`, `tau`, `phi` |

**示例：**

```javascript
// 基础运算
"2 + 2"                    // 4
"10 - 3"                   // 7
"6 * 7"                    // 42
"20 / 4"                   // 5

// 浮点数精度
"0.1 + 0.2"                // 0.3 (不是 0.30000000000000004)

// 复杂表达式
"(10 + 20) * 3"            // 90
"2 + 3 * 4 - 5 / 5"        // 13

// 科学函数
"sqrt(16)"                 // 4
"pow(2, 3)"                // 8
"sin(pi / 2)"              // 1

// 大数运算
"123456789 * 987654321"    // 121932631112635269
"999999999999999999 + 1"   // 1000000000000000000
```

## 🔒 安全性

本工具采用多层安全机制：

- ✅ **不使用 `eval()`** - 使用 mathjs 安全解析器
- ✅ **沙箱执行** - 隔离计算环境
- ✅ **函数白名单** - 仅允许安全的数学函数
- ✅ **输入验证** - 拒绝危险模式（import, require, eval 等）
- ✅ **超时保护** - 5秒自动终止
- ✅ **结果大小限制** - 防止内存溢出

## 🧪 开发

```bash
# 克隆仓库
git clone https://github.com/Cosmiumx/mcp-math-calculator.git
cd mcp-math-calculator

# 安装依赖
pnpm install

# 构建
pnpm build

# 运行测试
pnpm test

# 监听模式
pnpm watch
```

## 📊 测试覆盖

项目包含 37 个测试用例，覆盖：

- ✅ 基础算术运算
- ✅ 浮点数精度问题
- ✅ 复杂表达式计算
- ✅ 科学函数
- ✅ 数学常数
- ✅ 大数运算
- ✅ 错误处理
- ✅ 安全性验证
- ✅ 精度控制

## 🤝 贡献

欢迎贡献！请随时提交 Issue 或 Pull Request。

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的改动 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

## 📝 License

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🐛 问题反馈

遇到问题？请在 [GitHub Issues](https://github.com/Cosmiumx/mcp-math-calculator/issues) 中报告。

## 📚 相关资源

- [Model Context Protocol](https://modelcontextprotocol.io/)
- [MCP Specification](https://spec.modelcontextprotocol.io/)
- [mathjs 文档](https://mathjs.org/)

## ⭐ Star History

如果这个项目对你有帮助，请给它一个 ⭐️！

---

**Made with ❤️ by [Cosmiumx](https://github.com/Cosmiumx)**


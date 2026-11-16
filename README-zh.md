# MCP工具安全数据集

面向MCP安全研究的工具级数据集，包含参考工具和安全模拟的恶意变体工具。

[English](https://github.com/yms0527/awesome-mcp-servers/tree/main) · [简体中文](https://github.com/yms0527/awesome-mcp-servers/tree/readme-zh-cn) · [繁體中文](https://github.com/yms0527/awesome-mcp-servers/tree/readme-zh-tw) · [日本語](https://github.com/yms0527/awesome-mcp-servers/tree/readme-ja) · [한국어](https://github.com/yms0527/awesome-mcp-servers/tree/readme-ko)

## 负责任使用

恶意变体仅用于防御性安全研究和教学。请勿将其部署到生产环境或用于攻击第三方系统。

## 数据集概览

| 统计项 | 数值 |
|---|---|
| 物理源项目 | 1,126 |
| 逻辑MCP服务器 | 1,450 |
| 参考工具版本 | 26,021 |
| 包含变体的服务器目录 | 263 |
| 恶意变体工具版本 | 1,513 |
| 工具版本总数 | 27,534 |
| 已实现攻击类型 | 15 |

## 目录结构

```text
dataset/
├── reference-tools/
├── malicious-variant-tools/
└── metadata/
```

## 语言分布

| 参考服务器语言 | 服务器数 |
|---|---|
| Python | 752 |
| TypeScript | 532 |
| Go | 75 |
| JavaScript | 44 |
| Java | 17 |
| 其他 | 30 |

## 恶意变体分布

| 攻击类型 | DTPE阶段 | 工具数 |
|---|---|---|
| Tool Preference Manipulation Attack | Decision | 92 |
| Puppet Attack | Decision | 89 |
| Tool Squatting Attack | Decision | 92 |
| Tool Chain Exploitation Attack | Decision | 90 |
| Prompt Injection Attack | Decision | 118 |
| Credential Leakage | Transmission | 107 |
| Rug Pulls Attacks | Processing | 97 |
| Unauthorized Invocation | Processing | 110 |
| Tool Poisoning Attack | Execution | 133 |
| Tool Shadowing Attack | Execution | 83 |
| Command Injection Attack | Execution | 128 |
| Remote Listener Attack | Execution | 91 |
| Webpage Poison Attack | Execution | 83 |
| Sandbox Escape | Execution | 101 |
| Backdoor Attack | Execution | 99 |

## 文档与元数据

- `dataset/README.md`
- `dataset/reference-tools/README.md`
- `dataset/malicious-variant-tools/README.md`
- `dataset/malicious-variant-tools/<Attack Type>/README.md`
- `dataset/metadata/`

## 适用场景

本数据集可用于工具级静态分析、机器学习评估、攻击模式研究和MCP安全研究。

## 许可证

来源项目保留其原始许可证。再分发单个文件前，请核对许可证和来源元数据。

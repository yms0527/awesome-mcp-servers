<div align="center">

# MCP 安全服务器与恶意 MCP 服务器数据集

**面向工具增强型大语言模型安全研究的数据集，包含 786 个参考 MCP Server 和 190 个恶意 MCP Server 变体。**

[English](README.md) · [简体中文](README-zh.md) · [繁體中文](README-zh_TW.md) · [日本語](README-ja.md) · [한국어](README-ko.md)

</div>

---

## 免责声明

本仓库中的恶意 MCP Server 变体仅用于安全研究、数据集构建、防御评估和教学用途。

请勿将这些样本用于未授权访问、恶意软件部署、凭证窃取、服务破坏，或任何可能损害第三方系统、数据和用户权益的行为。使用本仓库内容即表示你同意遵守相关法律法规，并对使用行为承担责任。

---

## 数据集概览

本仓库包含两个互补的数据集：

| 数据集 | 数量 | 说明 |
|---|---:|---|
| `MCP服务器/` | 786 | 经过 MCP Server 识别与筛选规则得到的参考服务器根目录。 |
| `MCP攻击版/` | 190 | 基于真实 MCP Server 派生构造的恶意服务器变体。 |
| 实验样本总数 | 976 | 786 个参考服务器 + 190 个恶意变体。 |

需要注意的是，786 个参考 MCP Server 不是简单的物理目录数量，而是依据 MCP Server 根目录识别与筛选规则统计得到的有效实验口径。恶意变体目录保留原始 server/project 名称，攻击类型、DTPE 最终影响位置、编号等元数据记录在 `MCP攻击版/variant_name_mapping.csv` 中。

---

## 数据规模

| 统计项 | 数值 |
|---|---:|
| 参考 MCP Server | 786 |
| 恶意变体 | 190 |
| 实验样本总数 | 976 |
| 恶意样本占比 | 19.47% |
| 已实现攻击类型 | 15 |
| 参考服务器工具数 | 6,284 |
| 参考服务器函数数 | 218,108 |
| 参考服务器代码文件数 | 19,459 |
| 参考服务器代码行数 | 4,306,858 |

---

## 参考 MCP Server 统计

### 编程语言分布

| 语言 | Server 数量 |
|---|---:|
| TypeScript | 332 |
| Python | 328 |
| Go | 48 |
| JavaScript | 26 |
| Java | 7 |
| Other | 45 |

### 应用场景分布

| 应用场景 | Server 数量 | 占比 |
|---|---:|---:|
| AI Agent 工具 | 184 | 23.41% |
| 云与基础设施 | 128 | 16.28% |
| 开发辅助 | 128 | 16.28% |
| 数据分析 | 77 | 9.80% |
| 通信协作与办公 | 77 | 9.80% |
| 其他 | 75 | 9.54% |
| 信息检索与网络服务 | 68 | 8.65% |
| 金融商业 | 32 | 4.07% |
| 知识管理 | 13 | 1.65% |
| 数据库管理 | 4 | 0.51% |

---

## 恶意 MCP Server 数据集

恶意数据集包含 190 个变体，覆盖 15 类已实现攻击。该分布有意保持非均衡：Tool Poisoning、Command Injection、Prompt Injection、Credential Leakage、Unauthorized Invocation 和 Sandbox Escape 等重要攻击类型包含更多样本，同时恶意数据集总规模控制在 150--200 的小规模范围内。

### 按 DTPE 最终影响位置统计

| 最终影响位置 | 恶意变体数量 |
|---|---:|
| Decision | 57 |
| Transmission | 15 |
| Protocol | 25 |
| Execution | 93 |

### 按攻击类型统计

| 攻击类型 | 恶意变体数量 |
|---|---:|
| Tool Poisoning Attack | 20 |
| Command Injection Attack | 18 |
| Prompt Injection Attack | 17 |
| Credential Leakage | 15 |
| Unauthorized Invocation | 14 |
| Sandbox Escape | 13 |
| Backdoor Attack | 12 |
| Rug Pulls Attacks | 11 |
| Puppet Attack | 10 |
| Remote Listener Attack | 10 |
| Tool Chain Exploitation Attack | 10 |
| Tool Preference Manipulation Attack | 10 |
| Tool Shadowing Attack | 10 |
| Tool Squatting Attack | 10 |
| Webpage Poison Attack | 10 |

---

## 目录结构

```text
.
├── MCP服务器/                         # 参考 MCP Server
├── MCP攻击版/                         # 恶意 MCP Server 变体
│   ├── variant_name_mapping.csv       # 变体、攻击类型与元数据映射
│   ├── variant_label_schema.json      # 元数据 schema
│   ├── attack_expansion_manifest.json # 构造与分布清单
│   └── */attack_summary.md            # 各攻击类型摘要
├── 统计结果/                          # 数据集统计结果
├── README.md                          # 英文 README
└── README-zh.md                       # 简体中文 README
```

---

## 命名与元数据

`MCP攻击版/` 中的恶意变体目录保留原始 MCP server/project 名称，不再把攻击类型或 DTPE 标签编码进目录名。请通过以下文件查看攻击类型、最终影响位置和变体编号：

- `MCP攻击版/variant_name_mapping.csv`
- `MCP攻击版/variant_label_schema.json`
- `MCP攻击版/attack_expansion_manifest.json`
- `MCP攻击版/<Attack Type>/attack_summary.md`

---

## 适用场景

该数据集可用于：

- MCP Server 安全分析；
- 恶意工具/恶意服务器检测；
- 静态分析与机器学习检测方法评估；
- 面向工具增强型 LLM 系统的攻击分类与基准构建。

---

## 引用

如果你在学术研究中使用该数据集，请在论文或项目中引用对应论文或仓库版本。

---

## 许可与责任

使用或再分发单个 MCP Server 代码前，请检查其原始项目许可证。恶意变体是研究用途样本，不应部署到生产环境，也不得用于攻击真实用户或系统。

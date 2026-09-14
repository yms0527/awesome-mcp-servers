<div align="center">

# MCP Security Servers and Malicious MCP Servers Dataset

**ツール拡張型 LLM システムのセキュリティ研究向けに、786 件の参照 MCP Server と 190 件の悪意ある MCP Server 変種を収録したデータセットです。**

[English](README.md) · [简体中文](README-zh.md) · [繁體中文](README-zh_TW.md) · [日本語](README-ja.md) · [한국어](README-ko.md)

</div>

---

## Disclaimer

このリポジトリに含まれる悪意ある MCP Server 変種は、セキュリティ研究、データセット構築、防御評価、教育目的に限って提供されています。不正アクセス、認証情報の窃取、マルウェア配布、サービス妨害、第三者のシステムやデータを害する行為には使用しないでください。

---

## Dataset Overview

| Dataset | Count | Description |
|---|---:|---|
| `MCP服务器/` | 786 | MCP Server の識別・フィルタリング規則に基づく参照サーバールート。 |
| `MCP攻击版/` | 190 | 実際の MCP Server から派生した悪意あるサーバー変種。 |
| Total experimental samples | 976 | 786 reference servers + 190 malicious variants. |

786 は単純な物理ディレクトリ数ではなく、MCP Server ルートの識別とフィルタリングに基づく実験上の統計値です。悪意ある変種のディレクトリ名は元の server/project 名を保持し、攻撃タイプや DTPE final impact location は `MCP攻击版/variant_name_mapping.csv` に記録されています。

---

## Key Statistics

| Statistic | Value |
|---|---:|
| Reference MCP servers | 786 |
| Malicious variants | 190 |
| Total experimental samples | 976 |
| Malicious sample ratio | 19.47% |
| Implemented attack types | 15 |
| Tools | 6,284 |
| Functions | 218,108 |
| Code files | 19,459 |
| LOC | 4,306,858 |

---

## Malicious Variant Distribution

| DTPE final impact location | Variants |
|---|---:|
| Decision | 57 |
| Transmission | 15 |
| Protocol | 25 |
| Execution | 93 |

| Attack type | Variants |
|---|---:|
| Tool Poisoning Attack | 20 |
| Command Injection Attack | 18 |
| Prompt Injection Attack | 17 |
| Credential Leakage | 15 |
| Unauthorized Invocation | 14 |
| Sandbox Escape | 13 |
| Backdoor Attack | 12 |
| Rug Pulls Attacks | 11 |
| Other 7 attack types | 10 each |

---

## Metadata

Malicious variant directories under `MCP攻击版/` preserve the original MCP server/project names. Attack labels are stored in `variant_name_mapping.csv`, `variant_label_schema.json`, `attack_expansion_manifest.json`, and per-attack `attack_summary.md` files.


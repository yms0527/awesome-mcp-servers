# MCP工具安全資料集

面向MCP安全研究的工具級資料集，包含參考工具與安全模擬的惡意變體工具。

[English](README.md) · [简体中文](README-zh.md) · [繁體中文](README_zh_TW.md) · [日本語](README-ja.md) · [한국어](README-ko.md)

## 負責任使用

惡意變體僅供防禦性安全研究與教學使用。請勿部署至生產環境或用於攻擊第三方系統。

## 資料集概覽

| 統計項 | 數值 |
|---|---|
| 實體來源專案 | 1,126 |
| 邏輯MCP伺服器 | 1,450 |
| 參考工具版本 | 26,021 |
| 包含變體的伺服器目錄 | 263 |
| 惡意變體工具版本 | 1,513 |
| 工具版本總數 | 27,534 |
| 已實作攻擊類型 | 15 |

## 目錄結構

```text
dataset/
├── reference-tools/
├── malicious-variant-tools/
└── metadata/
```

## 語言分布

| 參考伺服器語言 | 伺服器數 |
|---|---|
| Python | 752 |
| TypeScript | 532 |
| Go | 75 |
| JavaScript | 44 |
| Java | 17 |
| Rust | 13 |
| Swift | 5 |
| Kotlin | 3 |
| C# | 3 |
| C++ | 3 |
| Ruby | 1 |
| PHP | 1 |
| Unknown | 1 |

## 惡意變體分布

| 攻擊類型 | DTPE階段 | 工具數 |
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

## 文件與中繼資料

- `dataset/README.md`
- `dataset/reference-tools/README.md`
- `dataset/malicious-variant-tools/README.md`
- `dataset/malicious-variant-tools/<Attack Type>/README.md`
- `dataset/metadata/`

## 適用場景

本資料集可用於工具級靜態分析、機器學習評估、攻擊模式研究與MCP安全研究。

## 授權

來源專案保留原始授權。重新散布單一檔案前，請核對授權與來源中繼資料。

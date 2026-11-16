# MCPツールセキュリティデータセット

参照MCPツールと安全に模擬された悪性バリアントを含むツール単位のデータセットです。

[English](https://github.com/yms0527/awesome-mcp-servers/tree/main) · [简体中文](https://github.com/yms0527/awesome-mcp-servers/tree/readme-zh-cn) · [繁體中文](https://github.com/yms0527/awesome-mcp-servers/tree/readme-zh-tw) · [日本語](https://github.com/yms0527/awesome-mcp-servers/tree/readme-ja) · [한국어](https://github.com/yms0527/awesome-mcp-servers/tree/readme-ko)

## 責任ある利用

悪性バリアントは防御的なセキュリティ研究と教育専用です。本番環境や第三者システムへの攻撃に使用しないでください。

## データセット概要

| 統計項目 | 値 |
|---|---|
| 物理ソースプロジェクト | 1,126 |
| 論理MCPサーバー | 1,450 |
| 参照ツールバージョン | 26,021 |
| バリアントを含むサーバーディレクトリ | 263 |
| 悪性バリアントツールバージョン | 1,513 |
| ツールバージョン総数 | 27,534 |
| 実装済み攻撃タイプ | 15 |

## ディレクトリ構成

```text
dataset/
├── reference-tools/
├── malicious-variant-tools/
└── metadata/
```

## 言語分布

| 参照サーバー言語 | サーバー数 |
|---|---|
| Python | 752 |
| TypeScript | 532 |
| Go | 75 |
| JavaScript | 44 |
| Java | 17 |
| その他 | 30 |

## 悪性バリアント分布

| 攻撃タイプ | DTPE段階 | ツール数 |
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

## ドキュメントとメタデータ

- `dataset/README.md`
- `dataset/reference-tools/README.md`
- `dataset/malicious-variant-tools/README.md`
- `dataset/malicious-variant-tools/<Attack Type>/README.md`
- `dataset/metadata/`

## 利用目的

ツール単位の静的解析、機械学習評価、攻撃パターン研究、MCPセキュリティ研究に利用できます。

## ライセンス

各ソースプロジェクトの元ライセンスが維持されます。再配布前にライセンスと来歴メタデータを確認してください。

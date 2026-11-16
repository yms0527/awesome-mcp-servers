# MCP Tool Security Dataset

A tool-level dataset of reference MCP tools and safely simulated malicious variants.

[English](https://github.com/yms0527/awesome-mcp-servers/tree/main) · [简体中文](https://github.com/yms0527/awesome-mcp-servers/tree/readme-zh-cn) · [繁體中文](https://github.com/yms0527/awesome-mcp-servers/tree/readme-zh-tw) · [日本語](https://github.com/yms0527/awesome-mcp-servers/tree/readme-ja) · [한국어](https://github.com/yms0527/awesome-mcp-servers/tree/readme-ko)

## Responsible Use

The malicious variants are provided only for defensive security research and education. Do not deploy them in production or use them against third-party systems.

## Dataset Overview

| Statistic | Value |
|---|---|
| Physical source projects | 1,126 |
| Logical MCP Servers | 1,450 |
| Reference tool versions | 26,021 |
| Variant-carrying Server directories | 263 |
| Malicious variant tool versions | 1,513 |
| Total tool versions | 27,534 |
| Implemented attack types | 15 |

## Directory Structure

```text
dataset/
├── reference-tools/
├── malicious-variant-tools/
└── metadata/
```

## Language Distribution

| Reference Server language | Servers |
|---|---|
| Python | 752 |
| TypeScript | 532 |
| Go | 75 |
| JavaScript | 44 |
| Java | 17 |
| Other | 30 |

## Malicious Variant Distribution

| Attack type | DTPE stage | Tools |
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

## Documentation and Metadata

- `dataset/README.md`
- `dataset/reference-tools/README.md`
- `dataset/malicious-variant-tools/README.md`
- `dataset/malicious-variant-tools/<Attack Type>/README.md`
- `dataset/metadata/`

## Intended Use

The dataset supports tool-level static analysis, machine-learning evaluation, attack-pattern studies, and MCP security research.

## Licensing

Source projects retain their original licenses. Check the license and provenance metadata before redistributing individual files.

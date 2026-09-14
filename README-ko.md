<div align="center">

# MCP Security Servers and Malicious MCP Servers Dataset

**도구 증강형 LLM 시스템 보안 연구를 위해 786개의 참조 MCP Server와 190개의 악성 MCP Server 변형을 포함한 데이터셋입니다.**

[English](README.md) · [简体中文](README-zh.md) · [繁體中文](README-zh_TW.md) · [日本語](README-ja.md) · [한국어](README-ko.md)

</div>

---

## Disclaimer

이 저장소의 악성 MCP Server 변형은 보안 연구, 데이터셋 구축, 방어 평가 및 교육 목적으로만 제공됩니다. 무단 접근, 자격 증명 탈취, 악성코드 배포, 서비스 방해 또는 제3자의 시스템과 데이터를 해치는 행위에 사용해서는 안 됩니다.

---

## Dataset Overview

| Dataset | Count | Description |
|---|---:|---|
| `MCP服务器/` | 786 | MCP Server 식별 및 필터링 규칙에 따라 선별된 참조 서버 루트입니다. |
| `MCP攻击版/` | 190 | 실제 MCP Server에서 파생된 악성 서버 변형입니다. |
| Total experimental samples | 976 | 786 reference servers + 190 malicious variants. |

786은 단순한 물리적 디렉터리 수가 아니라 MCP Server 루트 식별 및 필터링 규칙에 따른 실험 통계 기준입니다. 악성 변형 디렉터리는 원래 server/project 이름을 유지하며, 공격 유형과 DTPE final impact location은 `MCP攻击版/variant_name_mapping.csv`에 기록됩니다.

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

`MCP攻击版/` 아래의 악성 변형 디렉터리는 원래 MCP server/project 이름을 유지합니다. 공격 라벨은 `variant_name_mapping.csv`, `variant_label_schema.json`, `attack_expansion_manifest.json` 및 각 공격 유형의 `attack_summary.md` 파일에 저장됩니다.


# MCP 도구 보안 데이터셋

참조 MCP 도구와 안전하게 시뮬레이션된 악성 변형을 포함하는 도구 단위 데이터셋입니다.

[English](README.md) · [简体中文](README-zh.md) · [繁體中文](README_zh_TW.md) · [日本語](README-ja.md) · [한국어](README-ko.md)

## 책임 있는 사용

악성 변형은 방어적 보안 연구와 교육 용도로만 제공됩니다. 운영 환경이나 제3자 시스템 공격에 사용하지 마십시오.

## 데이터셋 개요

| 통계 | 값 |
|---|---|
| 물리적 소스 프로젝트 | 1,126 |
| 논리적 MCP 서버 | 1,450 |
| 참조 도구 버전 | 26,021 |
| 변형을 포함한 서버 디렉터리 | 263 |
| 악성 변형 도구 버전 | 1,513 |
| 전체 도구 버전 | 27,534 |
| 구현된 공격 유형 | 15 |

## 디렉터리 구조

```text
dataset/
├── reference-tools/
├── malicious-variant-tools/
└── metadata/
```

## 언어 분포

| 참조 서버 언어 | 서버 수 |
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

## 악성 변형 분포

| 공격 유형 | DTPE 단계 | 도구 수 |
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

## 문서 및 메타데이터

- `dataset/README.md`
- `dataset/reference-tools/README.md`
- `dataset/malicious-variant-tools/README.md`
- `dataset/malicious-variant-tools/<Attack Type>/README.md`
- `dataset/metadata/`

## 사용 목적

도구 단위 정적 분석, 머신러닝 평가, 공격 패턴 분석 및 MCP 보안 연구에 사용할 수 있습니다.

## 라이선스

원본 프로젝트의 라이선스가 유지됩니다. 개별 파일 재배포 전에 라이선스와 출처 메타데이터를 확인하십시오.

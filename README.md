<div align="center">

# Reference MCP Servers and Malicious MCP Variants Dataset

**A curated dataset of 786 reference MCP servers and 190 malicious MCP variants for security research on tool-augmented LLM systems.**

[English](README.md) · [简体中文](README-zh.md) · [繁體中文](README-zh_TW.md) · [日本語](README-ja.md) · [한국어](README-ko.md)

</div>

---

## Disclaimer

The malicious MCP variants in this repository are provided only for security research, dataset construction, defensive evaluation, and educational purposes.

Do not use the samples for unauthorized access, malware deployment, credential theft, service disruption, or any activity that may harm third-party systems, data, or users. By using this repository, you agree to comply with applicable laws and to use the dataset responsibly.

---

## Overview

This repository contains two complementary MCP server datasets:

| Dataset | Count | Description |
|---|---:|---|
| `reference-mcp-servers/` | 786 | Reference MCP server roots selected by MCP-specific filtering rules. |
| `malicious-mcp-variants/` | 190 | Malicious MCP variants derived from real reference servers. |
| Total experimental samples | 976 | 786 reference servers + 190 malicious variants. |

The 786 reference-server count is not a simple physical directory count. It is computed after identifying and filtering MCP server roots from the collected repository structure. The malicious variants preserve the original server/project directory names; attack labels and metadata are recorded in `malicious-mcp-variants/variant_name_mapping.csv`.

---

## Dataset Scale

| Statistic | Value |
|---|---:|
| Reference MCP servers | 786 |
| Malicious variants | 190 |
| Total experimental samples | 976 |
| Malicious sample ratio | 19.47% |
| Implemented attack types | 15 |
| Reference-server tools | 6,284 |
| Reference-server functions | 218,108 |
| Reference-server code files | 19,459 |
| Reference-server LOC | 4,306,858 |

---

## Reference MCP Server Statistics

### Programming languages

| Language | Servers |
|---|---:|
| TypeScript | 332 |
| Python | 328 |
| Go | 48 |
| JavaScript | 26 |
| Java | 7 |
| Other | 45 |

### Application scenarios

| Scenario | Servers | Share |
|---|---:|---:|
| AI Agent tools | 184 | 23.41% |
| Cloud and infrastructure | 128 | 16.28% |
| Development assistance | 128 | 16.28% |
| Data analysis | 77 | 9.80% |
| Communication, collaboration and office work | 77 | 9.80% |
| Other | 75 | 9.54% |
| Information retrieval and web services | 68 | 8.65% |
| Finance and business | 32 | 4.07% |
| Knowledge management | 13 | 1.65% |
| Database management | 4 | 0.51% |

---

## Malicious MCP Server Dataset

The malicious dataset contains 190 variants covering 15 implemented attack types. The distribution is intentionally non-uniform: security-critical attacks such as Tool Poisoning, Command Injection, Prompt Injection, Credential Leakage, Unauthorized Invocation, and Sandbox Escape contain more variants, while the overall malicious set remains within a small-scale 150--200 range.

### Distribution by DTPE final impact location

| Final impact location | Variants |
|---|---:|
| Decision | 57 |
| Transmission | 15 |
| Protocol | 25 |
| Execution | 93 |

### Distribution by attack type

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
| Puppet Attack | 10 |
| Remote Listener Attack | 10 |
| Tool Chain Exploitation Attack | 10 |
| Tool Preference Manipulation Attack | 10 |
| Tool Shadowing Attack | 10 |
| Tool Squatting Attack | 10 |
| Webpage Poison Attack | 10 |

---

## Directory Structure

```text
.
├── reference-mcp-servers/                         # Reference MCP servers
├── malicious-mcp-variants/                         # Malicious MCP variants
│   ├── variant_name_mapping.csv       # Mapping between variants, attack types, and metadata
│   ├── variant_label_schema.json      # Metadata schema
│   ├── attack_expansion_manifest.json # Construction and distribution manifest
│   └── */attack_summary.md            # Per-attack summaries
├── 统计结果/                          # Dataset statistics
├── README.md                          # English README
└── README-zh.md                       # Simplified Chinese README
```

---

## Naming and Metadata

Malicious variant directories preserve the original MCP server/project names. Attack-related labels are not encoded in the directory names. Use the metadata files to identify the attack type and final impact location:

- `malicious-mcp-variants/variant_name_mapping.csv`
- `malicious-mcp-variants/variant_label_schema.json`
- `malicious-mcp-variants/attack_expansion_manifest.json`
- `malicious-mcp-variants/<Attack Type>/attack_summary.md`

---

## Intended Use

This dataset is intended for:

- MCP server security analysis;
- malicious tool/server detection;
- static analysis and machine-learning-based detection research;
- attack taxonomy and benchmark construction for tool-augmented LLM systems.

---

## Citation

If you use this dataset in academic work, please cite the corresponding paper or repository version when available.

---

## License and Responsibility

Please check the licenses of the original MCP server projects before redistributing or using individual server code. The malicious variants are research artifacts and must not be deployed in production or used against real users.

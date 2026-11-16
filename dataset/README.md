# MCP Tool Security Dataset

This directory contains 26,021 unmodified reference tool versions and 1,513 safely simulated malicious variant tool versions.

## Contents

- `reference-tools/`: source files containing the reference tools, with project context files.
- `malicious-variant-tools/`: modified tool files grouped by attack type.
- `metadata/`: inventories, schemas, statistics, and provenance mappings.

## Label Meaning

A reference tool was not assigned a generated attack variant by this study; it is not guaranteed to be vulnerability-free. Credential-shaped literals may be redacted in the public copy and are recorded in `metadata/redactions.csv`. A malicious variant contains a generated attack pattern and is not evidence of successful real-world exploitation.

## Counts

| Collection | Tool versions |
|---|---|
| Reference tools | 26,021 |
| Malicious variant tools | 1,513 |
| Total | 27,534 |

## Attack Distribution

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

# Malicious Variant Tools

The collection contains 1,513 safely simulated malicious tool variants grouped into 15 attack-type directories.

Behavior variants use inert conditional branches and synthetic outputs. Metadata variants modify model-visible names, descriptions, or docstrings. The complete per-tool mutation records are in each attack directory README.

## Languages

| Language | Tools | Share |
|---|---|---|
| Python | 1171 | 77.40% |
| TypeScript | 274 | 18.11% |
| Go | 46 | 3.04% |
| JavaScript | 22 | 1.45% |

## Mutation Forms

| Mutation form | Tools |
|---|---|
| safe behavior branch insertion | 1112 |
| tool-description mutation | 250 |
| exposed-name substitution | 92 |
| Python tool-docstring mutation | 55 |
| Python tool-docstring insertion | 4 |

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

## Machine-readable Manifest

- `mutation_manifest.csv`
- `mutation_manifest.json`

# Memory Bank File Naming Convention Update

## Overview

This document describes the standardization of file naming conventions in the Memory Bank system. All references to Memory Bank files in the `.clinerules-*` configuration files have been updated to use the kebab-case format (with hyphens) instead of camelCase.

## Changes Implemented

The following file name references have been updated in all `.clinerules-*` files:

| Old Name (camelCase) | New Name (kebab-case) |
| -------------------- | --------------------- |
| `activeContext.md`   | `active-context.md`   |
| `productContext.md`  | `product-context.md`  |
| `decisionLog.md`     | `decision-log.md`     |
| `systemPatterns.md`  | `system-patterns.md`  |

## Files Updated

The following configuration files have been updated:

1. `.clinerules-ask`
2. `.clinerules-code`
3. `.clinerules-debug`
4. `.clinerules-test`

Note: `.clinerules-architect` was already using the kebab-case format.

## Compatibility

The system continues to support both naming conventions during the transition period. The `MemoryBankManager.ts` file includes logic to recognize both formats:

```typescript
// Support both camelCase and kebab-case during transition
const coreFiles = [
  // Kebab-case (new format)
  "product-context.md",
  "active-context.md",
  "progress.md",
  "decision-log.md",
  "system-patterns.md",

  // CamelCase (old format)
  "productContext.md",
  "activeContext.md",
  "progress.md",
  "decisionLog.md",
  "systemPatterns.md",
];
```

## Migration

The system includes a migration utility (`MigrationUtils.ts`) that can automatically rename files from camelCase to kebab-case format. This utility can be triggered using the `migrate_file_naming` tool.

## Recommendation

It is recommended to use the kebab-case format (with hyphens) for all new Memory Bank files and references to maintain consistency with the current standard.

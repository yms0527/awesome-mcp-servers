# English Language Policy for Memory Bank

## Overview

This document outlines the policy regarding language usage in the Memory Bank MCP system. The Memory Bank is designed to use English exclusively for all content, regardless of the system locale, user settings, or input language.

## Policy

1. **English-Only Content**: All Memory Bank content is stored in English. This includes:
   - Core files (product-context.md, active-context.md, progress.md, decision-log.md, system-patterns.md)
   - Progress tracking entries
   - Decision log entries
   - Active context updates
   - Any other content stored in the Memory Bank

2. **Hard Requirement**: The use of English is a hard requirement, not a configurable option. This is enforced at the code level in the `MemoryBankManager` class.

3. **Language Parameter**: While the `setLanguage` method exists for API consistency, it always sets the language to English ('en') regardless of the parameter provided.

## Rationale

This policy was implemented for several important reasons:

1. **Consistency**: Using a single language ensures consistency across all Memory Banks, making it easier to share, compare, and analyze content.

2. **Simplicity**: Enforcing a single language simplifies the codebase by eliminating the need for localization logic.

3. **Collaboration**: English serves as a common language for international teams, facilitating collaboration across language barriers.

4. **Technical Documentation**: English is the predominant language in technical documentation and programming, making it the most practical choice for a development tool.

## Implementation

The English-only policy is implemented in the following ways:

1. **Language Property**: The `MemoryBankManager` class has a private `language` property that is always set to 'en'.

```typescript
// Language is always set to English - this is a hard requirement
// All Memory Bank content will be in English regardless of system locale or user settings
private language: string = 'en';
```

2. **Constructor Initialization**: The constructor explicitly sets the language to English.

```typescript
constructor(projectPath?: string, userId?: string, folderName?: string) {
  // Ensure language is always English - this is a hard requirement
  // All Memory Bank content will be in English regardless of system locale or user settings
  this.language = 'en';
  // ...
}
```

3. **Language Setter**: The `setLanguage` method ignores the input parameter and always sets the language to English.

```typescript
setLanguage(language: string): void {
  // Always use English regardless of the parameter
  this.language = 'en';
  console.warn('Memory Bank language is always set to English (en) regardless of the requested language. This is a hard requirement for consistency.');
}
```

4. **Templates**: All templates for Memory Bank files are defined in English.

## User Interface Considerations

While the Memory Bank content is always in English, the user interface of applications that interact with the Memory Bank can be localized to other languages. However, the content stored in the Memory Bank itself will remain in English.

## Conclusion

The English-only policy for Memory Bank content is a deliberate design decision to ensure consistency, simplicity, and collaboration. This policy is enforced at the code level and is not configurable.
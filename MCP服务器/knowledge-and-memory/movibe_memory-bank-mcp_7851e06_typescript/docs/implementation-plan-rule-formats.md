# Implementation Plan: Multi-Format Rule Support

## Overview

This document describes the implementation plan for adding support for multiple file formats (YAML and TOML) to the rule parser in Memory Bank MCP.

## Objectives

1. Add support for YAML format rule files
2. Add support for TOML format rule files
3. Implement automatic format detection
4. Maintain compatibility with existing JSON rules
5. Update documentation to reflect the newly supported formats

## Dependencies

The following libraries will be needed:

1. **YAML Parsing**: `yaml` (js-yaml)
   - Popular and well-maintained library for YAML parsing in Node.js
   - Supports YAML 1.2
   - MIT License

2. **TOML Parsing**: `@iarna/toml`
   - Lightweight and efficient library for TOML parsing
   - Supports TOML v1.0.0
   - ISC License

## Code Changes

### 1. Update ExternalRulesLoader

Modify the `ExternalRulesLoader` class to support multiple formats:

```typescript
// Import parsing libraries
import yaml from 'yaml';
import toml from '@iarna/toml';

// ...

/**
 * Parses the content of a rule file
 * @param content File content
 * @param filePath Optional file path for format detection
 * @returns Parsed rule object or null if invalid
 */
private parseRuleContent(content: string, filePath?: string): ClineruleBase | null {
  // Try to detect format from file extension if available
  if (filePath) {
    const ext = path.extname(filePath).toLowerCase();
    if (ext === '.yaml' || ext === '.yml') {
      return this.parseYaml(content);
    } else if (ext === '.toml') {
      return this.parseToml(content);
    } else if (ext === '.json') {
      return this.parseJson(content);
    }
  }
  
  // If no file path or unknown extension, try all formats
  return this.parseJson(content) || this.parseYaml(content) || this.parseToml(content);
}

/**
 * Parses content as JSON
 * @param content Content to parse
 * @returns Parsed rule object or null if invalid
 */
private parseJson(content: string): ClineruleBase | null {
  try {
    const rule = JSON.parse(content);
    return this.validateRule(rule) ? rule : null;
  } catch (error) {
    return null;
  }
}

/**
 * Parses content as YAML
 * @param content Content to parse
 * @returns Parsed rule object or null if invalid
 */
private parseYaml(content: string): ClineruleBase | null {
  try {
    const rule = yaml.parse(content);
    return this.validateRule(rule) ? rule : null;
  } catch (error) {
    return null;
  }
}

/**
 * Parses content as TOML
 * @param content Content to parse
 * @returns Parsed rule object or null if invalid
 */
private parseToml(content: string): ClineruleBase | null {
  try {
    const rule = toml.parse(content);
    return this.validateRule(rule) ? rule : null;
  } catch (error) {
    return null;
  }
}

/**
 * Validates a rule object
 * @param rule Rule object to validate
 * @returns true if valid, false otherwise
 */
private validateRule(rule: any): boolean {
  return (
    rule &&
    typeof rule.mode === 'string' &&
    rule.instructions &&
    Array.isArray(rule.instructions.general)
  );
}
```

### 2. Update Rule Loading Method

Modify the `detectAndLoadRules` method to pass the file path to the `parseRuleContent` method:

```typescript
async detectAndLoadRules(): Promise<Map<string, ClineruleBase>> {
  const modes = ['architect', 'ask', 'code', 'debug', 'test'];
  
  // Clear existing watchers
  this.stopWatching();
  
  // Clear existing rules
  this.rules.clear();
  
  for (const mode of modes) {
    // Check for files with different extensions
    const baseFilename = `.clinerules-${mode}`;
    const possibleExtensions = ['', '.json', '.yaml', '.yml', '.toml'];
    
    for (const ext of possibleExtensions) {
      const filename = `${baseFilename}${ext}`;
      const filePath = path.join(this.projectDir, filename);
      
      try {
        if (await fs.pathExists(filePath)) {
          const content = await fs.readFile(filePath, 'utf8');
          const rule = this.parseRuleContent(content, filePath);
          
          if (rule && rule.mode === mode) {
            this.rules.set(mode, rule);
            console.error(`Loaded ${filename} rules`);
            
            // Set up watcher for this file
            this.watchRuleFile(filePath, mode);
            
            // Found a valid rule file for this mode, no need to check other extensions
            break;
          } else {
            console.error(`Invalid rule format in ${filename}`);
          }
        }
      } catch (error) {
        console.error(`Error loading ${filename}:`, error);
      }
    }
  }
  
  return this.rules;
}
```

### 3. Update File Watching Method

Modify the `watchRuleFile` method to pass the file path to the `parseRuleContent` method:

```typescript
private watchRuleFile(filePath: string, mode: string): void {
  const watcher = fs.watch(filePath, async (eventType) => {
    if (eventType === 'change') {
      try {
        const content = await fs.readFile(filePath, 'utf8');
        const rule = this.parseRuleContent(content, filePath);
        
        if (rule && rule.mode === mode) {
          this.rules.set(mode, rule);
          this.emit('ruleChanged', mode, rule);
          console.error(`Updated ${path.basename(filePath)} rules`);
        }
      } catch (error) {
        console.error(`Error updating ${path.basename(filePath)}:`, error);
      }
    }
  });
  
  this.watchers.push(watcher);
}
```

## Tests

Implement tests to verify multi-format support:

```typescript
describe('ExternalRulesLoader', () => {
  // ... existing tests ...
  
  describe('Multiple Format Support', () => {
    test('Should parse JSON rules', async () => {
      // Test JSON parsing
    });
    
    test('Should parse YAML rules', async () => {
      // Test YAML parsing
    });
    
    test('Should parse TOML rules', async () => {
      // Test TOML parsing
    });
    
    test('Should detect format from file extension', async () => {
      // Test format detection from extension
    });
    
    test('Should try all formats if extension is unknown', async () => {
      // Test fallback parsing
    });
  });
});
```

## Documentation

1. Update README.md to mention multi-format support
2. Create specific documentation about supported formats (rule-formats.md)
3. Add examples of rule files in each format

## Implementation Plan

### Phase 1: Preparation

1. Add dependencies for YAML and TOML parsing
2. Create example files in each format for testing

### Phase 2: Implementation

1. Modify ExternalRulesLoader to support multiple formats
2. Implement automatic format detection
3. Update file loading and watching methods

### Phase 3: Testing

1. Implement tests for each format
2. Verify compatibility with existing rules
3. Test automatic format detection

### Phase 4: Documentation

1. Update README.md
2. Create specific format documentation
3. Add examples

## Estimated Timeline

- **Phase 1**: 1 day
- **Phase 2**: 2-3 days
- **Phase 3**: 1-2 days
- **Phase 4**: 1 day

**Total**: 5-7 days

## Risks and Mitigations

| Risk | Probability | Impact | Mitigation |
|-------|--------------|---------|-----------|
| Incompatibility with existing rules | Low | High | Maintain JSON support and implement comprehensive tests |
| Parsing issues in specific formats | Medium | Medium | Implement robust error handling and detailed logging |
| Package size increase due to new dependencies | High | Low | Evaluate package size impact and consider lighter dependencies if necessary |
| Inconsistent behavior between formats | Medium | Medium | Implement consistent validation for all formats |
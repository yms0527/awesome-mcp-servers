# Memory Bank Management Strategy

## Core Principles

1. **Space Efficiency**
   - Memory bank files should be concise and focused
   - Deleting irrelevant memories is encouraged and beneficial
   - Information should be stored at the appropriate level of detail

2. **Short-term vs. Long-term Memory**
   - **Short-term memory**: Detailed, recent, specific (activeContext.md, progress.md)
   - **Long-term memory**: Compressed, patterns, principles (systemPatterns.md, techContext.md, projectbrief.md)

```mermaid
flowchart TD
    A[New Information] --> B{Important?}
    B -->|Yes| C[Short-term Memory]
    B -->|No| D[Discard]
    C --> E{Still Relevant?}
    E -->|Yes| F[Long-term Memory]
    E -->|No| D
    
    subgraph "Short-term Memory"
    C[Detailed, Recent]
    end
    
    subgraph "Long-term Memory"
    F[Compressed, Patterns]
    end
```

## File-Specific Guidelines

### Short-term Memory Files

#### activeContext.md
- Focus on **current** work and recent changes
- Limit to last 1-2 work sessions
- Summarize test cases rather than listing each one
- Highlight active decisions and current challenges

#### progress.md
- Use tables for status tracking
- Summarize by category, not individual items
- Focus on high-level completion status
- Keep "What's Left to Build" focused on major items

### Long-term Memory Files

#### systemPatterns.md
- Focus on architectural patterns and design decisions
- Extract principles from implementation details
- Document the "why" behind decisions
- Avoid listing specific implementations

#### techContext.md
- Document technologies, libraries, and tools
- Focus on how they're used in the project
- Highlight constraints and requirements
- Avoid detailed version histories

#### projectbrief.md
- Maintain core project goals and requirements
- Update only when project scope changes
- Keep high-level architecture diagrams
- Serve as the foundation for all other files

## Compression Strategies

1. **Summarize Lists**
   - Replace exhaustive lists with summary statements
   - Use categories instead of individual items
   - Focus on patterns rather than instances

2. **Use Tables**
   - Convert narrative text to tables where appropriate
   - Track progress with percentages rather than detailed lists
   - Provide at-a-glance status information

3. **Reference External Files**
   - Link to PRDs instead of duplicating content
   - Reference test files rather than listing all test cases
   - Point to documentation rather than repeating it

4. **Regular Pruning**
   - Regularly review and compress memory bank files
   - Remove outdated or irrelevant information
   - Consolidate similar information across files

## "Compress Memory Bank" Trigger

When the trigger "compress memory bank" is used:

1. Review all memory bank files with compression as the primary goal
2. Apply the short-term vs. long-term memory strategy
3. Aggressively prune redundant or outdated information
4. Consolidate similar information across files
5. Report on the compression achieved (e.g., token reduction)

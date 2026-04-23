# Vim Code Block Selection Guide

## Basic Indent-based Selection
- `viB` - Select outer code block (indented block)
- `vaB` - Select outer code block including brackets
- `vi{` - Select content inside curly braces
- `va{` - Select content including curly braces

## Bracket-based Selection
- `vi(` - Select content inside parentheses
- `va(` - Select content including parentheses
- `vi[` - Select content inside square brackets
- `va[` - Select content including square brackets

## Basic Selection Commands
- `V` - Select entire line
- `v` - Enter visual mode, move with hjkl
- `vip` - Select current paragraph
- `vap` - Select paragraph and trailing spaces

## Text Object Selection
- `vit` - Select content inside XML/HTML tags
- `vat` - Select content including XML/HTML tags
- `viw` - Select current word
- `vaw` - Select word and trailing space

## Common Operations
After selection, use:
- `d` - Delete selected content
- `y` - Copy selected content
- `>` - Increase indent
- `<` - Decrease indent

## Tips
1. Start with simple `v` command
2. Practice with brackets and tags
3. Understand `i` (inner) vs `a` (around)
4. Learn text objects for efficiency
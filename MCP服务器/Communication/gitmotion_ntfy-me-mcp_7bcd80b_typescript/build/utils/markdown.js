import MarkdownIt from 'markdown-it';
/**
 * Checks if a string contains markdown formatting by attempting to parse it
 * and examining the resulting tokens.
 *
 * @param text The text to check for markdown formatting
 * @returns true if markdown formatting is detected, false otherwise
 */
export function containsMarkdown(text) {
    // Initialize markdown parser with default options
    const md = new MarkdownIt('zero');
    // Parse the text into tokens
    const tokens = md.parse(text, {});
    // If we have just one paragraph with inline content, we need to check 
    // if there's actual formatting inside it
    if (tokens.length <= 2) { // Simple text usually has open/close paragraph tokens
        let hasFormatting = false;
        // Look for any token that indicates markdown formatting
        for (const token of tokens) {
            // Check for formatting inside paragraph
            if (token.type === 'inline' && token.children) {
                for (const child of token.children) {
                    // If any child is not plain text, we have markdown
                    if (child.type !== 'text') {
                        hasFormatting = true;
                        break;
                    }
                }
            }
            // Check for block-level formatting
            if (['heading_open', 'blockquote_open', 'bullet_list_open', 'ordered_list_open',
                'fence', 'hr', 'table_open', 'code_block'].includes(token.type)) {
                hasFormatting = true;
                break;
            }
        }
        return hasFormatting;
    }
    // If we have more than just paragraph tokens, we definitely have markdown
    return tokens.length > 2;
}
/**
 * Simple test to check if a string has common markdown patterns
 * This is a fallback in case the parser-based approach fails to detect some patterns
 *
 * @param text The text to check for markdown patterns
 * @returns true if common markdown patterns are found, false otherwise
 */
export function hasCommonMarkdownPatterns(text) {
    // Common markdown patterns to detect
    const markdownPatterns = [
        /\*\*.+?\*\*/, // Bold text: **bold**
        /\*.+?\*/, // Italic text: *italic*
        /__.+?__/, // Bold text: __bold__
        /_.+?_/, // Italic text: _italic_
        /~~.+?~~/, // Strikethrough: ~~strikethrough~~
        /^#+\s+.+$/m, // Headers: # Header
        /^\s*[-*+]\s+.+$/m, // Unordered lists: - item or * item or + item
        /^\s*\d+\.\s+.+$/m, // Ordered lists: 1. item
        /^\s*>.+$/m, // Blockquotes: > quote
        /`[^`]+`/, // Inline code: `code`
        /```[\s\S]*?```/, // Code blocks: ```code```
        /\[.+?\]\(.+?\)/, // Links: [text](url)
        /!\[.+?\]\(.+?\)/, // Images: ![alt](url)
        /\|.+\|.+\|/, // Tables: |col1|col2|
        /^-{3,}$/m, // Horizontal rules: ---
    ];
    // Check if any markdown pattern matches
    return markdownPatterns.some(pattern => pattern.test(text));
}
/**
 * Combined approach to detect markdown in text
 * First tries using the faster regex pattern matching, then falls back to the more thorough parser-based approach
 *
 * @param text The text to check for markdown
 * @returns true if markdown is detected by either method, false otherwise
 */
export function detectMarkdown(text) {
    // First try the faster regex-based approach
    const hasCommonPatterns = hasCommonMarkdownPatterns(text);
    // If that finds markdown, return immediately
    if (hasCommonPatterns) {
        return true;
    }
    // Fall back to the more thorough but slower parser-based approach
    return containsMarkdown(text);
}

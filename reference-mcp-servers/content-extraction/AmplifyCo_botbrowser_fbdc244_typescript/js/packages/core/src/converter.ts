import TurndownService from "turndown";
import { gfm } from "turndown-plugin-gfm";

let turndownInstance: TurndownService | null = null;

function getTurndown(): TurndownService {
  if (turndownInstance) return turndownInstance;

  const turndown = new TurndownService({
    headingStyle: "atx",
    hr: "---",
    bulletListMarker: "-",
    codeBlockStyle: "fenced",
    emDelimiter: "*",
    strongDelimiter: "**",
  });

  // Add GitHub-flavored markdown support (tables, strikethrough, task lists)
  turndown.use(gfm);

  // Handle images: strip data URIs, simplify normal images
  turndown.addRule("handleImages", {
    filter: "img",
    replacement: (_content, node) => {
      const src = (node as HTMLElement).getAttribute("src") || "";
      const alt = (node as HTMLElement).getAttribute("alt") || "";
      if (!src || src.startsWith("data:")) return "";
      return `![${alt}](${src})`;
    },
  });

  turndownInstance = turndown;
  return turndown;
}

export function htmlToMarkdown(html: string): string {
  const turndown = getTurndown();
  let markdown = turndown.turndown(html);

  // Clean up excessive whitespace
  markdown = markdown
    .replace(/\n{3,}/g, "\n\n") // Max 2 consecutive newlines
    .replace(/[ \t]+$/gm, "") // Trailing whitespace
    .replace(/^\s+/, "") // Leading whitespace
    .replace(/\s+$/, ""); // Trailing whitespace

  return markdown;
}

export function htmlToText(html: string): string {
  // Use turndown but strip all markdown formatting
  const markdown = htmlToMarkdown(html);

  return markdown
    .replace(/#{1,6}\s+/g, "") // Remove heading markers
    .replace(/\*\*(.+?)\*\*/g, "$1") // Remove bold
    .replace(/\*(.+?)\*/g, "$1") // Remove italic
    .replace(/\[(.+?)\]\(.+?\)/g, "$1") // Remove links, keep text
    .replace(/!\[.*?\]\(.+?\)/g, "") // Remove images
    .replace(/`{1,3}[^`]*`{1,3}/g, (m) => m.replace(/`/g, "")) // Remove code markers
    .replace(/^[-*+]\s+/gm, "") // Remove list markers
    .replace(/^\d+\.\s+/gm, "") // Remove numbered list markers
    .replace(/^>\s+/gm, "") // Remove blockquote markers
    .replace(/---/g, "") // Remove horizontal rules
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

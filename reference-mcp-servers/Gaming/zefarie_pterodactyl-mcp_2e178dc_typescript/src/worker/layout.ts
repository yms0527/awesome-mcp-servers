// src/worker/layout.ts - Brutalist HTML layout wrapper

import { VERSION } from "../version.js";
import { STYLES } from "./styles.js";

// ASCII icons - no SVG
export const ICONS = {
  shield: "[!]",
  check: "[✓]",
  trash: "[×]",
  alertCircle: "[!]",
  xCircle: "[×]",
  link: "::",
  zap: ">",
  key: "#",
  terminal: ">_",
} as const;

/**
 * Wraps page content in the full HTML document with header and footer.
 */
export function renderLayout(options: { title: string; body: string; scripts?: string }): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Manage your Pterodactyl game servers through AI via MCP.">
  <meta name="theme-color" content="#000000">
  <title>${options.title}</title>
  <style>${STYLES}</style>
</head>
<body>
  <div class="page-wrapper">
    <header class="page-header">
      <div class="header-inner">
        <a href="/" class="logo">
          <span class="logo-icon">[P]</span>
          PTERODACTYL MCP
        </a>
        <nav class="header-links">
          <a href="https://modelcontextprotocol.io" target="_blank" rel="noopener">docs</a>
        </nav>
      </div>
    </header>

    <main class="main-content">
      <div class="container">
        ${options.body}
      </div>
    </main>

    <footer class="page-footer">
      <div class="footer-inner">
        <span>v${VERSION}</span>
        <div class="footer-links">
          <span>MIT</span>
          <span>-</span>
          <span>zefarie</span>
        </div>
      </div>
    </footer>
  </div>
  ${options.scripts ?? ""}
</body>
</html>`;
}

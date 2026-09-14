// src/worker/styles.ts - Brutalist / Punk CSS for the Pterodactyl MCP frontend

export const STYLES = `
  /* ─── Reset ──────────────────────────────────────────────────────────────── */
  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    -webkit-text-size-adjust: 100%;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: #000000;
    color: #ffffff;
    min-height: 100vh;
    line-height: 1.6;
  }

  /* ─── Layout ─────────────────────────────────────────────────────────────── */
  .page-wrapper {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .page-header {
    border-bottom: 2px solid #222222;
    padding: 0.75rem 1.5rem;
  }

  .header-inner {
    max-width: 640px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
    color: #ffffff;
    font-family: 'SF Mono', 'Cascadia Code', 'Fira Code', 'Consolas', monospace;
    font-weight: 700;
    font-size: 0.85rem;
    letter-spacing: 0.02em;
  }

  .logo-icon {
    color: #00ff41;
    font-weight: 800;
  }

  .header-links {
    display: flex;
    gap: 1.25rem;
    align-items: center;
  }

  .header-links a {
    color: #666666;
    font-family: 'SF Mono', 'Cascadia Code', 'Fira Code', 'Consolas', monospace;
    font-size: 0.75rem;
    text-decoration: none;
    transition: color 0.1s;
  }

  .header-links a:hover {
    color: #ffffff;
  }

  .main-content {
    flex: 1;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 3rem 1.5rem 4rem;
  }

  .container {
    max-width: 640px;
    width: 100%;
  }

  /* ─── Hero ───────────────────────────────────────────────────────────────── */
  .hero {
    margin-bottom: 2rem;
  }

  .hero h1 {
    font-family: 'SF Mono', 'Cascadia Code', 'Fira Code', 'Consolas', monospace;
    font-size: 3rem;
    font-weight: 800;
    color: #ffffff;
    letter-spacing: 0.05em;
    line-height: 1.1;
    text-transform: uppercase;
    margin-bottom: 0.5rem;
  }

  .hero-subtitle {
    color: #666666;
    font-family: 'SF Mono', 'Cascadia Code', 'Fira Code', 'Consolas', monospace;
    font-size: 0.85rem;
    line-height: 1.5;
  }

  /* ─── Sections ───────────────────────────────────────────────────────────── */
  .section {
    border: 2px solid #222222;
    padding: 1.5rem;
    margin-bottom: 1rem;
  }

  .section-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
    font-family: 'SF Mono', 'Cascadia Code', 'Fira Code', 'Consolas', monospace;
    font-size: 0.85rem;
    font-weight: 700;
    color: #ffffff;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .section-icon {
    color: #00ff41;
    font-weight: 800;
  }

  .section p {
    color: #666666;
    font-size: 0.85rem;
    line-height: 1.6;
  }

  /* ─── Form ───────────────────────────────────────────────────────────────── */
  .field {
    margin-bottom: 1.25rem;
  }

  .field:last-of-type {
    margin-bottom: 1.5rem;
  }

  label {
    display: block;
    color: #ffffff;
    font-family: 'SF Mono', 'Cascadia Code', 'Fira Code', 'Consolas', monospace;
    font-size: 0.8rem;
    font-weight: 600;
    margin-bottom: 0.375rem;
  }

  .label-row {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
  }

  .required-star {
    color: #ff3333;
    margin-left: 2px;
  }

  .optional-tag {
    color: #666666;
    font-family: 'SF Mono', 'Cascadia Code', 'Fira Code', 'Consolas', monospace;
    font-size: 0.7rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .input-wrapper {
    position: relative;
  }

  input[type="text"],
  input[type="password"],
  input[type="url"] {
    width: 100%;
    padding: 0.6rem 0.75rem;
    background: #000000;
    border: 2px solid #222222;
    border-radius: 0;
    color: #ffffff;
    font-size: 0.85rem;
    font-family: 'SF Mono', 'Cascadia Code', 'Fira Code', 'Consolas', monospace;
    outline: none;
    transition: border-color 0.1s;
  }

  input:focus {
    border-color: #00ff41;
  }

  input::placeholder {
    color: #666666;
  }

  .input-hint {
    color: #666666;
    font-size: 0.75rem;
    margin-top: 0.375rem;
    line-height: 1.5;
  }

  .input-hint code {
    color: #00ff41;
    font-family: 'SF Mono', 'Cascadia Code', 'Fira Code', 'Consolas', monospace;
    font-size: 0.7rem;
  }

  /* ─── Toggle visibility (CSS only) ──────────────────────────────────────── */
  .toggle-vis {
    display: none;
  }

  .toggle-vis-label {
    position: absolute;
    right: 0.625rem;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    color: #666666;
    font-family: 'SF Mono', 'Cascadia Code', 'Fira Code', 'Consolas', monospace;
    font-size: 0.7rem;
    font-weight: 500;
    user-select: none;
    padding: 0.15rem 0.35rem;
    transition: color 0.1s;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .toggle-vis-label:hover {
    color: #ffffff;
  }

  .toggle-vis-label .show-text { display: inline; }
  .toggle-vis-label .hide-text { display: none; }

  .toggle-vis:checked ~ .input-wrapper input[type="password"] {
    -webkit-text-security: none;
    color: #ffffff;
  }

  .toggle-vis:checked ~ .input-wrapper .toggle-vis-label .show-text { display: none; }
  .toggle-vis:checked ~ .input-wrapper .toggle-vis-label .hide-text { display: inline; }

  /* ─── Buttons ────────────────────────────────────────────────────────────── */
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    width: 100%;
    padding: 0.75rem 1.25rem;
    border: 2px solid;
    border-radius: 0;
    font-family: 'SF Mono', 'Cascadia Code', 'Fira Code', 'Consolas', monospace;
    font-size: 0.85rem;
    font-weight: 700;
    cursor: pointer;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    transition: opacity 0.1s;
  }

  .btn:hover {
    opacity: 0.85;
  }

  .btn-primary {
    background: #00ff41;
    color: #000000;
    border-color: #00ff41;
  }

  .btn-danger {
    background: #000000;
    border-color: #ff3333;
    color: #ff3333;
  }

  .btn-danger:hover {
    background: #ff3333;
    color: #000000;
  }

  /* ─── Error Alert ────────────────────────────────────────────────────────── */
  .alert-error {
    display: flex;
    align-items: flex-start;
    gap: 0.625rem;
    border: 2px solid #ff3333;
    color: #ff3333;
    padding: 0.75rem 1rem;
    margin-bottom: 1.25rem;
    font-size: 0.85rem;
    line-height: 1.5;
    font-family: 'SF Mono', 'Cascadia Code', 'Fira Code', 'Consolas', monospace;
  }

  .alert-error-icon {
    flex-shrink: 0;
    font-weight: 800;
  }

  /* ─── Success heading ────────────────────────────────────────────────────── */
  .success-heading {
    font-family: 'SF Mono', 'Cascadia Code', 'Fira Code', 'Consolas', monospace;
    font-size: 2rem;
    font-weight: 800;
    color: #00ff41;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    margin-bottom: 1.5rem;
  }

  /* ─── URL / config blocks ────────────────────────────────────────────────── */
  .url-block {
    position: relative;
    background: #000000;
    border: 2px solid #222222;
    padding: 0.875rem 1rem;
    margin: 1rem 0;
    font-family: 'SF Mono', 'Cascadia Code', 'Fira Code', 'Consolas', monospace;
    font-size: 0.8rem;
    color: #00ff41;
    word-break: break-all;
    line-height: 1.5;
    cursor: pointer;
    transition: border-color 0.1s;
  }

  .url-block:hover {
    border-color: #00ff41;
  }

  .url-block-label {
    position: absolute;
    right: 0.625rem;
    top: 50%;
    transform: translateY(-50%);
    border: 2px solid #222222;
    color: #666666;
    padding: 0.2rem 0.5rem;
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    pointer-events: none;
    transition: all 0.1s;
    font-family: 'SF Mono', 'Cascadia Code', 'Fira Code', 'Consolas', monospace;
  }

  .url-block:hover .url-block-label {
    border-color: #00ff41;
    color: #00ff41;
  }

  .url-block.copied .url-block-label {
    border-color: #00ff41;
    color: #00ff41;
  }

  .config-block {
    background: #000000;
    border: 2px solid #222222;
    padding: 0.875rem 1rem;
    margin: 0.75rem 0;
    font-family: 'SF Mono', 'Cascadia Code', 'Fira Code', 'Consolas', monospace;
    font-size: 0.75rem;
    color: #ffffff;
    white-space: pre;
    line-height: 1.6;
    overflow-x: auto;
    cursor: pointer;
    transition: border-color 0.1s;
  }

  .config-block:hover {
    border-color: #00ff41;
  }

  /* ─── Steps List ─────────────────────────────────────────────────────────── */
  .steps {
    list-style: none;
    padding: 0;
  }

  .steps li {
    display: flex;
    gap: 0.75rem;
    margin-bottom: 0.75rem;
    color: #666666;
    font-size: 0.85rem;
    line-height: 1.55;
    align-items: flex-start;
  }

  .steps li:last-child {
    margin-bottom: 0;
  }

  .step-num {
    color: #00ff41;
    font-family: 'SF Mono', 'Cascadia Code', 'Fira Code', 'Consolas', monospace;
    font-weight: 700;
    font-size: 0.8rem;
    flex-shrink: 0;
  }

  .steps strong {
    color: #ffffff;
    font-weight: 600;
  }

  .steps em {
    color: #00ff41;
    font-style: normal;
    font-family: 'SF Mono', 'Cascadia Code', 'Fira Code', 'Consolas', monospace;
  }

  /* ─── Tools list ─────────────────────────────────────────────────────────── */
  .tools-section-label {
    font-family: 'SF Mono', 'Cascadia Code', 'Fira Code', 'Consolas', monospace;
    font-size: 0.75rem;
    color: #666666;
    font-weight: 600;
    margin-bottom: 0.5rem;
    padding-left: 0;
  }

  .tools-section-label:not(:first-of-type) {
    margin-top: 1.25rem;
  }

  .tools-list {
    margin-bottom: 0.25rem;
  }

  .tool-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.35rem 0;
    border-bottom: 1px solid #222222;
  }

  .tool-row:last-child {
    border-bottom: none;
  }

  .tool-name {
    font-family: 'SF Mono', 'Cascadia Code', 'Fira Code', 'Consolas', monospace;
    font-size: 0.8rem;
    color: #ffffff;
    font-weight: 500;
  }

  .tool-dots {
    flex: 1;
    border-bottom: 1px dotted #222222;
    margin: 0 0.75rem;
    height: 0;
    align-self: center;
  }

  .badge {
    font-family: 'SF Mono', 'Cascadia Code', 'Fira Code', 'Consolas', monospace;
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.02em;
    flex-shrink: 0;
  }

  .badge-read {
    color: #666666;
  }

  .badge-write {
    color: #ffffff;
    border: 1px solid #222222;
    padding: 0.1rem 0.35rem;
  }

  /* ─── Danger zone ────────────────────────────────────────────────────────── */
  .danger-zone {
    border-color: #ff3333;
  }

  .token-display {
    background: #000000;
    border: 2px solid #222222;
    padding: 0.625rem 0.75rem;
    margin: 0.75rem 0 1rem;
    font-family: 'SF Mono', 'Cascadia Code', 'Fira Code', 'Consolas', monospace;
    font-size: 0.75rem;
    color: #666666;
    word-break: break-all;
  }

  /* ─── Security note ──────────────────────────────────────────────────────── */
  .security-note {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    padding: 0.75rem 0;
    margin-top: 1.25rem;
    border-top: 1px solid #222222;
  }

  .security-note-icon {
    flex-shrink: 0;
    color: #666666;
    font-family: 'SF Mono', 'Cascadia Code', 'Fira Code', 'Consolas', monospace;
    font-weight: 800;
  }

  .security-note p {
    font-size: 0.75rem;
    color: #666666;
    line-height: 1.55;
  }

  /* ─── Footer ─────────────────────────────────────────────────────────────── */
  .page-footer {
    border-top: 2px solid #222222;
    padding: 1rem 1.5rem;
  }

  .footer-inner {
    max-width: 640px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #666666;
    font-family: 'SF Mono', 'Cascadia Code', 'Fira Code', 'Consolas', monospace;
    font-size: 0.7rem;
  }

  .footer-links {
    display: flex;
    gap: 1rem;
  }

  .footer-links span {
    color: #222222;
  }

  /* ─── Links ──────────────────────────────────────────────────────────────── */
  a {
    color: #00ff41;
    text-decoration: none;
    transition: color 0.1s;
  }

  a:hover {
    color: #ffffff;
  }

  /* ─── Utilities ──────────────────────────────────────────────────────────── */
  .text-center { text-align: center; }

  .divider {
    height: 2px;
    background: #222222;
    margin: 1rem 0;
  }

  .back-link {
    font-family: 'SF Mono', 'Cascadia Code', 'Fira Code', 'Consolas', monospace;
    font-size: 0.85rem;
  }

  /* ─── Responsive ─────────────────────────────────────────────────────────── */
  @media (max-width: 640px) {
    .hero h1 {
      font-size: 2rem;
    }

    .main-content {
      padding: 2rem 1rem 3rem;
    }

    .section {
      padding: 1.25rem;
    }

    .header-links {
      gap: 0.75rem;
    }

    .footer-inner {
      flex-direction: column;
      gap: 0.5rem;
      text-align: center;
    }

    .url-block-label {
      position: static;
      transform: none;
      display: block;
      text-align: center;
      margin-top: 0.5rem;
    }

    .url-block {
      padding-right: 1rem;
    }
  }
`;

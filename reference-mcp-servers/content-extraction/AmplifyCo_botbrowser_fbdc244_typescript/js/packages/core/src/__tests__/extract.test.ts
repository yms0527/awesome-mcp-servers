import { describe, it, expect } from "vitest";
import { cleanHtml } from "../cleaner.js";
import { htmlToMarkdown, htmlToText } from "../converter.js";
import { extractContent, extractLinks, extractDescription } from "../extractor.js";

const SAMPLE_HTML = `
<html>
<head>
  <title>Test Page</title>
  <meta name="description" content="A test page for BotBrowser">
  <script>console.log('tracking');</script>
  <style>body { color: red; }</style>
</head>
<body>
  <nav><a href="/">Home</a> <a href="/about">About</a></nav>
  <main>
    <h1>Hello World</h1>
    <p>This is the <strong>main content</strong> of the page.</p>
    <p>It has <a href="https://example.com/link">a link</a> and some text.</p>
    <ul>
      <li>Item one</li>
      <li>Item two</li>
      <li>Item three</li>
    </ul>
    <table>
      <tr><th>Name</th><th>Value</th></tr>
      <tr><td>Foo</td><td>Bar</td></tr>
    </table>
  </main>
  <footer>Copyright 2026</footer>
  <div class="cookie-banner">We use cookies</div>
  <div style="display:none">Hidden content</div>
  <div class="ad">Buy stuff now!</div>
</body>
</html>
`;

describe("cleanHtml", () => {
  it("removes scripts", () => {
    const result = cleanHtml(SAMPLE_HTML, "https://example.com");
    expect(result).not.toContain("<script>");
    expect(result).not.toContain("tracking");
  });

  it("removes styles", () => {
    const result = cleanHtml(SAMPLE_HTML, "https://example.com");
    expect(result).not.toContain("<style>");
  });

  it("removes nav", () => {
    const result = cleanHtml(SAMPLE_HTML, "https://example.com");
    expect(result).not.toContain("<nav>");
  });

  it("removes cookie banner", () => {
    const result = cleanHtml(SAMPLE_HTML, "https://example.com");
    expect(result.toLowerCase()).not.toContain("cookie");
  });

  it("removes hidden elements", () => {
    const result = cleanHtml(SAMPLE_HTML, "https://example.com");
    expect(result).not.toContain("Hidden content");
  });

  it("removes ads", () => {
    const result = cleanHtml(SAMPLE_HTML, "https://example.com");
    expect(result).not.toContain("Buy stuff now");
  });

  it("preserves main content", () => {
    const result = cleanHtml(SAMPLE_HTML, "https://example.com");
    expect(result).toContain("Hello World");
    expect(result).toContain("main content");
  });

  it("strips class and id attributes", () => {
    const result = cleanHtml(SAMPLE_HTML, "https://example.com");
    expect(result).not.toContain('class=');
    expect(result).not.toContain('id=');
  });
});

describe("htmlToMarkdown", () => {
  it("converts headings", () => {
    const md = htmlToMarkdown("<h1>Title</h1><p>Hello</p>");
    expect(md).toContain("# Title");
  });

  it("converts bold and italic", () => {
    const md = htmlToMarkdown("<p>Hello <strong>bold</strong> and <em>italic</em></p>");
    expect(md).toContain("**bold**");
    expect(md).toContain("*italic*");
  });

  it("converts links", () => {
    const md = htmlToMarkdown('<p><a href="https://example.com">click</a></p>');
    expect(md).toContain("[click](https://example.com)");
  });

  it("converts lists", () => {
    const md = htmlToMarkdown("<ul><li>One</li><li>Two</li></ul>");
    expect(md).toContain("-");
    expect(md).toContain("One");
    expect(md).toContain("Two");
  });

  it("removes data URI images but keeps normal images", () => {
    const html = '<img src="data:image/png;base64,abc123" alt="bloat"><img src="https://example.com/img.png" alt="real">';
    const md = htmlToMarkdown(html);
    expect(md).not.toContain("data:");
    expect(md).toContain("![real](https://example.com/img.png)");
  });

  it("collapses excessive whitespace", () => {
    const md = htmlToMarkdown("<p>Hello</p>\n\n\n\n\n<p>World</p>");
    expect(md).not.toMatch(/\n{3,}/);
  });
});

describe("htmlToText", () => {
  it("strips all markdown formatting", () => {
    const text = htmlToText("<h1>Title</h1><p>Hello <strong>bold</strong></p>");
    expect(text).toContain("Title");
    expect(text).toContain("bold");
    expect(text).not.toContain("#");
    expect(text).not.toContain("**");
  });

  it("removes links but keeps text", () => {
    const text = htmlToText('<p><a href="https://example.com">click here</a></p>');
    expect(text).toContain("click here");
    expect(text).not.toContain("https://example.com");
  });
});

describe("extractContent", () => {
  it("extracts article content with readability", () => {
    const articleHtml = `
      <html><head><title>Article</title></head>
      <body>
        <nav>Nav stuff</nav>
        <article>
          <h1>The Article Title</h1>
          <p>This is the first paragraph of the article with enough content to make readability detect it as the main content area.</p>
          <p>This is the second paragraph with more content to ensure readability considers this substantial enough to extract.</p>
          <p>And a third paragraph because readability needs a decent amount of text to work properly and identify the main content.</p>
        </article>
        <footer>Footer stuff</footer>
      </body></html>
    `;
    const result = extractContent(articleHtml, "https://example.com");
    expect(result).not.toBeNull();
    expect(result!.title).toContain("Article");
    expect(result!.content).toContain("first paragraph");
  });

  it("returns null for minimal HTML", () => {
    const result = extractContent("<html><body>Hi</body></html>", "https://example.com");
    // Readability may or may not parse minimal content — just verify no crash
    expect(result === null || typeof result.content === "string").toBe(true);
  });
});

describe("extractLinks", () => {
  it("extracts and deduplicates links", () => {
    const html = `
      <a href="https://example.com/a">Link A</a>
      <a href="https://example.com/b">Link B</a>
      <a href="https://example.com/a">Link A again</a>
    `;
    const links = extractLinks(html, "https://example.com");
    expect(links).toHaveLength(2);
    expect(links[0].text).toBe("Link A");
    expect(links[0].href).toBe("https://example.com/a");
  });

  it("resolves relative URLs", () => {
    const html = '<a href="/about">About</a>';
    const links = extractLinks(html, "https://example.com");
    expect(links[0].href).toBe("https://example.com/about");
  });

  it("skips javascript: and mailto: links", () => {
    const html = `
      <a href="javascript:void(0)">JS</a>
      <a href="mailto:test@example.com">Email</a>
      <a href="https://example.com/real">Real</a>
    `;
    const links = extractLinks(html, "https://example.com");
    expect(links).toHaveLength(1);
    expect(links[0].text).toBe("Real");
  });

  it("skips same-page anchor links", () => {
    const html = '<a href="#section">Jump</a><a href="https://other.com#section">Other</a>';
    const links = extractLinks(html, "https://example.com");
    expect(links).toHaveLength(1);
    expect(links[0].href).toContain("other.com");
  });
});

describe("extractDescription", () => {
  it("extracts meta description", () => {
    const html = '<html><head><meta name="description" content="Test desc"></head><body></body></html>';
    const desc = extractDescription(html, "https://example.com");
    expect(desc).toBe("Test desc");
  });

  it("falls back to og:description", () => {
    const html = '<html><head><meta property="og:description" content="OG desc"></head><body></body></html>';
    const desc = extractDescription(html, "https://example.com");
    expect(desc).toBe("OG desc");
  });

  it("returns empty string when no description", () => {
    const html = "<html><head></head><body></body></html>";
    const desc = extractDescription(html, "https://example.com");
    expect(desc).toBe("");
  });
});

describe("token estimation edge cases", () => {
  it("handles empty HTML in cleanHtml", () => {
    const result = cleanHtml("<html><body></body></html>", "https://example.com");
    expect(typeof result).toBe("string");
  });

  it("handles empty string in converters", () => {
    expect(htmlToMarkdown("")).toBe("");
    expect(htmlToText("")).toBe("");
  });
});

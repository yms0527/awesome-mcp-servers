import { JSDOM } from "jsdom";

/** Tags that are always removed entirely (including content) */
const REMOVE_TAGS = [
  "script",
  "style",
  "noscript",
  "iframe",
  "object",
  "embed",
  "applet",
  "svg",
  "canvas",
  "video",
  "audio",
  "source",
  "track",
  "map",
  "area",
];

/** Selectors for common non-content elements */
const REMOVE_SELECTORS = [
  "nav",
  "header:not(article header)",
  "footer:not(article footer)",
  "[role='navigation']",
  "[role='banner']",
  "[role='complementary']",
  "[aria-hidden='true']",
  ".ad, .ads, .advertisement, .adsbygoogle",
  ".sidebar, .side-bar",
  ".cookie-banner, .cookie-notice, .cookie-consent",
  ".popup, .modal, .overlay",
  ".social-share, .share-buttons, .social-links",
  ".comments, .comment-section, #comments",
  ".newsletter, .subscribe",
  ".breadcrumb, .breadcrumbs",
  ".pagination",
  ".related-posts, .related-articles",
  ".widget",
  "[data-ad]",
  "[data-tracking]",
];

/** Attributes to strip from all remaining elements */
const STRIP_ATTRIBUTES = [
  "style",
  "class",
  "id",
  "data-*",
  "onclick",
  "onload",
  "onerror",
  "onmouseover",
  "onmouseout",
  "onfocus",
  "onblur",
  "aria-*",
  "role",
  "tabindex",
  "draggable",
  "contenteditable",
];

export function cleanHtml(html: string, url: string): string {
  const dom = new JSDOM(html, { url });
  const document = dom.window.document;

  // Remove unwanted tags entirely
  for (const tag of REMOVE_TAGS) {
    const elements = document.querySelectorAll(tag);
    elements.forEach((el) => el.remove());
  }

  // Remove non-content elements by selector
  for (const selector of REMOVE_SELECTORS) {
    try {
      const elements = document.querySelectorAll(selector);
      elements.forEach((el) => el.remove());
    } catch {
      // Some selectors might fail on malformed HTML — skip
    }
  }

  // Remove hidden elements
  const allElements = document.querySelectorAll("*");
  allElements.forEach((el) => {
    const htmlEl = el as HTMLElement;
    if (
      htmlEl.getAttribute("hidden") !== null ||
      htmlEl.getAttribute("style")?.includes("display:none") ||
      htmlEl.getAttribute("style")?.includes("display: none") ||
      htmlEl.getAttribute("style")?.includes("visibility:hidden") ||
      htmlEl.getAttribute("style")?.includes("visibility: hidden")
    ) {
      el.remove();
    }
  });

  // Strip unnecessary attributes from remaining elements
  const remaining = document.querySelectorAll("*");
  remaining.forEach((el) => {
    const attrs = Array.from(el.attributes);
    for (const attr of attrs) {
      const name = attr.name.toLowerCase();
      if (
        STRIP_ATTRIBUTES.includes(name) ||
        name.startsWith("data-") ||
        name.startsWith("aria-") ||
        name.startsWith("on")
      ) {
        el.removeAttribute(attr.name);
      }
    }
  });

  // Remove empty elements (except self-closing ones like img, br, hr)
  const selfClosing = new Set(["img", "br", "hr", "input", "meta", "link"]);
  const emptyCheck = document.querySelectorAll("*");
  emptyCheck.forEach((el) => {
    if (
      !selfClosing.has(el.tagName.toLowerCase()) &&
      !el.textContent?.trim() &&
      !el.querySelector("img")
    ) {
      el.remove();
    }
  });

  return document.body?.innerHTML || "";
}

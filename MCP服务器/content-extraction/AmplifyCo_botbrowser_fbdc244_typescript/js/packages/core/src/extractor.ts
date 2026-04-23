import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";
import type { ExtractedLink } from "./models.js";

export interface ReadabilityResult {
  title: string;
  content: string;
  textContent: string;
  excerpt: string;
  siteName: string;
}

export function extractContent(
  html: string,
  url: string
): ReadabilityResult | null {
  const dom = new JSDOM(html, { url });
  const reader = new Readability(dom.window.document);
  const article = reader.parse();

  if (!article) {
    return null;
  }

  return {
    title: article.title || "",
    content: article.content || "",
    textContent: article.textContent || "",
    excerpt: article.excerpt || "",
    siteName: article.siteName || "",
  };
}

export function extractLinks(html: string, baseUrl: string): ExtractedLink[] {
  const dom = new JSDOM(html, { url: baseUrl });
  const document = dom.window.document;
  const links: ExtractedLink[] = [];
  const seen = new Set<string>();

  const anchors = document.querySelectorAll("a[href]");
  anchors.forEach((a) => {
    const href = a.getAttribute("href");
    if (!href) return;

    // Resolve relative URLs
    let absoluteUrl: string;
    try {
      absoluteUrl = new URL(href, baseUrl).href;
    } catch {
      return;
    }

    // Skip anchors, javascript:, mailto:, tel:
    if (
      absoluteUrl.startsWith("javascript:") ||
      absoluteUrl.startsWith("mailto:") ||
      absoluteUrl.startsWith("tel:") ||
      (absoluteUrl.includes("#") && new URL(absoluteUrl).origin === new URL(baseUrl).origin && new URL(absoluteUrl).pathname === new URL(baseUrl).pathname)
    ) {
      return;
    }

    // Deduplicate
    if (seen.has(absoluteUrl)) return;
    seen.add(absoluteUrl);

    const text = (a.textContent || "").trim();
    if (text) {
      links.push({ text, href: absoluteUrl });
    }
  });

  return links;
}

export function extractDescription(html: string, url: string): string {
  const dom = new JSDOM(html, { url });
  const document = dom.window.document;

  // Try meta description
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    return metaDesc.getAttribute("content") || "";
  }

  // Try og:description
  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) {
    return ogDesc.getAttribute("content") || "";
  }

  return "";
}

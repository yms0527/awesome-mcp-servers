import { fetchPage } from "./fetcher.js";
import { extractContent, extractLinks, extractDescription } from "./extractor.js";
import { cleanHtml } from "./cleaner.js";
import { htmlToMarkdown, htmlToText } from "./converter.js";
import type { ExtractOptions, BotBrowserResult } from "./models.js";

// Rough token estimation: ~4 chars per token for English text
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

/**
 * Extract clean, token-efficient content from a web page.
 *
 * @example
 * ```ts
 * import { extract } from 'botbrowser';
 * const result = await extract('https://example.com');
 * console.log(result.content); // clean markdown
 * ```
 */
export async function extract(
  urlOrOptions: string | ExtractOptions
): Promise<BotBrowserResult> {
  const options: ExtractOptions =
    typeof urlOrOptions === "string" ? { url: urlOrOptions } : urlOrOptions;

  const {
    url,
    format = "markdown",
    timeout = 15000,
    includeLinks = true,
    headers,
  } = options;

  // Step 1: Fetch the page
  const fetched = await fetchPage(url, { timeout, headers });
  const rawTokenEstimate = estimateTokens(fetched.html);

  // Step 2: Extract description from raw HTML (before readability modifies it)
  const description = extractDescription(fetched.html, fetched.finalUrl);

  // Step 3: Extract main content with Readability
  const extracted = extractContent(fetched.html, fetched.finalUrl);

  if (!extracted) {
    // Fallback: clean HTML directly if Readability can't parse it
    const cleanedHtml = cleanHtml(fetched.html, fetched.finalUrl);
    const content =
      format === "markdown" ? htmlToMarkdown(cleanedHtml) : htmlToText(cleanedHtml);
    const textContent = htmlToText(cleanedHtml);

    return {
      url: fetched.finalUrl,
      title: "",
      description,
      content,
      textContent,
      links: includeLinks ? extractLinks(fetched.html, fetched.finalUrl) : [],
      metadata: {
        rawTokenEstimate,
        cleanTokenEstimate: estimateTokens(content),
        tokenSavingsPercent: rawTokenEstimate > 0
          ? Math.round((1 - estimateTokens(content) / rawTokenEstimate) * 100)
          : 0,
        wordCount: textContent.split(/\s+/).filter(Boolean).length,
        fetchedAt: new Date().toISOString(),
      },
    };
  }

  // Step 4: Clean the extracted HTML further
  const cleanedContent = cleanHtml(extracted.content, fetched.finalUrl);

  // Step 5: Convert to desired format
  const content =
    format === "markdown"
      ? htmlToMarkdown(cleanedContent)
      : htmlToText(cleanedContent);
  const textContent =
    format === "text" ? content : htmlToText(cleanedContent);

  // Step 6: Extract links from cleaned content
  const links = includeLinks
    ? extractLinks(extracted.content, fetched.finalUrl)
    : [];

  const cleanTokenEstimate = estimateTokens(content);

  return {
    url: fetched.finalUrl,
    title: extracted.title,
    description: description || extracted.excerpt,
    content,
    textContent,
    links,
    metadata: {
      rawTokenEstimate,
      cleanTokenEstimate,
      tokenSavingsPercent: rawTokenEstimate > 0
        ? Math.round((1 - cleanTokenEstimate / rawTokenEstimate) * 100)
        : 0,
      wordCount: textContent.split(/\s+/).filter(Boolean).length,
      fetchedAt: new Date().toISOString(),
    },
  };
}

// Re-export types
export type {
  ExtractOptions,
  BotBrowserResult,
  ExtractedLink,
  ExtractionMetadata,
} from "./models.js";

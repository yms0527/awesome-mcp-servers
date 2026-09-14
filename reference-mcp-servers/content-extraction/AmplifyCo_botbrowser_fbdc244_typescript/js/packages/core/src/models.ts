export interface ExtractOptions {
  /** Target URL to extract content from */
  url: string;
  /** Output format: "markdown" (default) or "text" */
  format?: "markdown" | "text";
  /** Request timeout in milliseconds (default: 15000) */
  timeout?: number;
  /** Include extracted links in result (default: true) */
  includeLinks?: boolean;
  /** Custom headers to send with the request */
  headers?: Record<string, string>;
}

export interface ExtractedLink {
  text: string;
  href: string;
}

export interface ExtractionMetadata {
  /** Estimated token count of the raw HTML */
  rawTokenEstimate: number;
  /** Estimated token count of the cleaned output */
  cleanTokenEstimate: number;
  /** Percentage of tokens saved */
  tokenSavingsPercent: number;
  /** Word count of the extracted content */
  wordCount: number;
  /** ISO timestamp of when the extraction was performed */
  fetchedAt: string;
}

export interface BotBrowserResult {
  /** The URL that was extracted */
  url: string;
  /** Page title */
  title: string;
  /** Page meta description */
  description: string;
  /** Cleaned content in markdown format */
  content: string;
  /** Plain text version of the content */
  textContent: string;
  /** Links found in the main content */
  links: ExtractedLink[];
  /** Extraction metadata including token savings */
  metadata: ExtractionMetadata;
}

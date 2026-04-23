const USER_AGENTS = [
  "Mozilla/5.0 (compatible; BotBrowser/0.1; +https://github.com/AmplifyCo/botbrowser)",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
];

export interface FetchResult {
  html: string;
  finalUrl: string;
  statusCode: number;
  contentType: string;
}

export async function fetchPage(
  url: string,
  options: { timeout?: number; headers?: Record<string, string> } = {}
): Promise<FetchResult> {
  const { timeout = 15000, headers = {} } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const userAgent =
      USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": userAgent,
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        ...headers,
      },
      redirect: "follow",
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const contentType = response.headers.get("content-type") || "";
    if (
      !contentType.includes("text/html") &&
      !contentType.includes("application/xhtml")
    ) {
      throw new Error(
        `Unsupported content type: ${contentType}. Only HTML pages are supported.`
      );
    }

    const html = await response.text();

    return {
      html,
      finalUrl: response.url,
      statusCode: response.status,
      contentType,
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

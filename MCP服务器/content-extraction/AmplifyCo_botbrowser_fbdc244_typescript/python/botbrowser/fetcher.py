"""HTTP fetching with smart defaults."""

from __future__ import annotations

import random
from dataclasses import dataclass

import httpx

USER_AGENTS = [
    "Mozilla/5.0 (compatible; BotBrowser/0.1; +https://github.com/AmplifyCo/botbrowser)",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
]


@dataclass
class FetchResult:
    html: str
    final_url: str
    status_code: int
    content_type: str


def fetch_page(
    url: str,
    *,
    timeout: int = 15000,
    headers: dict[str, str] | None = None,
) -> FetchResult:
    """Fetch a web page with smart defaults."""
    user_agent = random.choice(USER_AGENTS)

    default_headers = {
        "User-Agent": user_agent,
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
    }
    if headers:
        default_headers.update(headers)

    timeout_seconds = timeout / 1000

    response = httpx.get(
        url,
        headers=default_headers,
        follow_redirects=True,
        timeout=timeout_seconds,
    )
    response.raise_for_status()

    content_type = response.headers.get("content-type", "")
    if "text/html" not in content_type and "application/xhtml" not in content_type:
        raise ValueError(
            f"Unsupported content type: {content_type}. Only HTML pages are supported."
        )

    return FetchResult(
        html=response.text,
        final_url=str(response.url),
        status_code=response.status_code,
        content_type=content_type,
    )

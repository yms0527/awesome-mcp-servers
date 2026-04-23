"""Core extraction engine — native Python implementation."""

from __future__ import annotations

import math
from datetime import datetime, timezone
from urllib.parse import urljoin, urlparse

from bs4 import BeautifulSoup

from botbrowser.cleaner import clean_html
from botbrowser.converter import html_to_markdown, html_to_text
from botbrowser.fetcher import fetch_page
from botbrowser.models import (
    BotBrowserResult,
    ExtractedLink,
    ExtractionMetadata,
    ExtractOptions,
)

import trafilatura


def _estimate_tokens(text: str) -> int:
    """Rough token estimation: ~4 chars per token for English text."""
    return math.ceil(len(text) / 4)


def _extract_description(html: str) -> str:
    """Extract meta description from HTML."""
    soup = BeautifulSoup(html, "html.parser")

    meta = soup.find("meta", attrs={"name": "description"})
    if meta and meta.get("content"):
        return str(meta["content"])

    og = soup.find("meta", attrs={"property": "og:description"})
    if og and og.get("content"):
        return str(og["content"])

    return ""


def _extract_title(html: str) -> str:
    """Extract page title from HTML."""
    soup = BeautifulSoup(html, "html.parser")
    title_tag = soup.find("title")
    if title_tag and title_tag.string:
        return title_tag.string.strip()

    og_title = soup.find("meta", attrs={"property": "og:title"})
    if og_title and og_title.get("content"):
        return str(og_title["content"])

    return ""


def _extract_links(html: str, base_url: str) -> list[ExtractedLink]:
    """Extract unique links from HTML content."""
    soup = BeautifulSoup(html, "html.parser")
    links: list[ExtractedLink] = []
    seen: set[str] = set()

    for a in soup.find_all("a", href=True):
        href = a["href"]

        # Resolve relative URLs
        try:
            absolute_url = urljoin(base_url, href)
        except Exception:
            continue

        # Skip non-HTTP, anchors, mailto, tel
        parsed = urlparse(absolute_url)
        if parsed.scheme not in ("http", "https"):
            continue
        if parsed.fragment and parsed.path == urlparse(base_url).path:
            continue

        if absolute_url in seen:
            continue
        seen.add(absolute_url)

        text = a.get_text(strip=True)
        if text:
            links.append(ExtractedLink(text=text, href=absolute_url))

    return links


def extract(
    url_or_options: str | ExtractOptions | None = None,
    *,
    url: str | None = None,
    format: str = "markdown",
    timeout: int = 15000,
    include_links: bool = True,
    headers: dict[str, str] | None = None,
) -> BotBrowserResult:
    """
    Extract clean, token-efficient content from a web page.

    Usage:
        result = extract("https://example.com")
        result = extract("https://example.com", format="text")
        result = extract(ExtractOptions(url="https://example.com"))
    """
    # Normalize arguments
    if isinstance(url_or_options, ExtractOptions):
        opts = url_or_options
    elif isinstance(url_or_options, str):
        opts = ExtractOptions(
            url=url_or_options,
            format=format,  # type: ignore[arg-type]
            timeout=timeout,
            include_links=include_links,
            headers=headers,
        )
    elif url is not None:
        opts = ExtractOptions(
            url=url,
            format=format,  # type: ignore[arg-type]
            timeout=timeout,
            include_links=include_links,
            headers=headers,
        )
    else:
        raise ValueError("url is required")

    # Step 1: Fetch the page
    fetched = fetch_page(opts.url, timeout=opts.timeout, headers=opts.headers)
    raw_token_estimate = _estimate_tokens(fetched.html)

    # Step 2: Extract metadata from raw HTML
    title = _extract_title(fetched.html)
    description = _extract_description(fetched.html)

    # Step 3: Extract main content using trafilatura
    main_content_html = trafilatura.extract(
        fetched.html,
        output_format="html",
        include_links=True,
        include_tables=True,
        include_formatting=True,
    )

    # Step 4: Clean HTML
    if main_content_html:
        cleaned_html = clean_html(main_content_html)
    else:
        # Fallback: clean the full page HTML
        cleaned_html = clean_html(fetched.html)

    # Step 5: Convert to desired format
    if opts.format == "markdown":
        content = html_to_markdown(cleaned_html)
    else:
        content = html_to_text(cleaned_html)

    text_content = html_to_text(cleaned_html)

    # Step 6: Extract links from raw HTML (not cleaned — cleaning strips nav links)
    links = _extract_links(fetched.html, fetched.final_url) if opts.include_links else []

    clean_token_estimate = _estimate_tokens(content)
    savings = (
        round((1 - clean_token_estimate / raw_token_estimate) * 100)
        if raw_token_estimate > 0
        else 0
    )

    return BotBrowserResult(
        url=fetched.final_url,
        title=title,
        description=description,
        content=content,
        text_content=text_content,
        links=links,
        metadata=ExtractionMetadata(
            raw_token_estimate=raw_token_estimate,
            clean_token_estimate=clean_token_estimate,
            token_savings_percent=savings,
            word_count=len(text_content.split()),
            fetched_at=datetime.now(timezone.utc).isoformat(),
        ),
    )

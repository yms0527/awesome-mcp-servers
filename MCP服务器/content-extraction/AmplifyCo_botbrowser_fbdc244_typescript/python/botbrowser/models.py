"""Data models for BotBrowser."""

from __future__ import annotations

from typing import Dict, Literal, Optional
from pydantic import BaseModel


class ExtractOptions(BaseModel):
    """Options for content extraction."""

    url: str
    format: Literal["markdown", "text"] = "markdown"
    timeout: int = 15000
    include_links: bool = True
    headers: Optional[Dict[str, str]] = None


class ExtractedLink(BaseModel):
    """A link extracted from page content."""

    text: str
    href: str


class ExtractionMetadata(BaseModel):
    """Metadata about the extraction including token savings."""

    raw_token_estimate: int
    clean_token_estimate: int
    token_savings_percent: int
    word_count: int
    fetched_at: str


class BotBrowserResult(BaseModel):
    """Result of content extraction from a web page."""

    url: str
    title: str
    description: str
    content: str
    text_content: str
    links: list[ExtractedLink]
    metadata: ExtractionMetadata

"""HTML to Markdown/text conversion."""

from __future__ import annotations

import re

from markdownify import markdownify


def html_to_markdown(html: str) -> str:
    """Convert HTML to clean markdown."""
    # Pre-process: remove images with data URIs (bloated base64) but keep normal images
    html = re.sub(r'<img[^>]+src="data:[^"]*"[^>]*/?>', "", html)

    markdown = markdownify(
        html,
        heading_style="ATX",
        bullets="-",
        convert=["a", "p", "h1", "h2", "h3", "h4", "h5", "h6",
                 "ul", "ol", "li", "table", "thead", "tbody", "tr", "th", "td",
                 "blockquote", "pre", "code", "em", "strong", "br", "hr", "img"],
    )

    # Clean up excessive whitespace
    markdown = re.sub(r"\n{3,}", "\n\n", markdown)  # Max 2 consecutive newlines
    markdown = re.sub(r"[ \t]+$", "", markdown, flags=re.MULTILINE)  # Trailing whitespace
    markdown = markdown.strip()

    return markdown


def html_to_text(html: str) -> str:
    """Convert HTML to plain text."""
    markdown = html_to_markdown(html)

    text = markdown
    text = re.sub(r"#{1,6}\s+", "", text)  # Remove heading markers
    text = re.sub(r"\*\*(.+?)\*\*", r"\1", text)  # Remove bold
    text = re.sub(r"\*(.+?)\*", r"\1", text)  # Remove italic
    text = re.sub(r"\[(.+?)\]\(.+?\)", r"\1", text)  # Remove links, keep text
    text = re.sub(r"!\[.*?\]\(.+?\)", "", text)  # Remove images
    text = re.sub(r"`{1,3}[^`]*`{1,3}", lambda m: m.group().strip("`"), text)  # Remove code markers
    text = re.sub(r"^[-*+]\s+", "", text, flags=re.MULTILINE)  # Remove list markers
    text = re.sub(r"^\d+\.\s+", "", text, flags=re.MULTILINE)  # Remove numbered list markers
    text = re.sub(r"^>\s+", "", text, flags=re.MULTILINE)  # Remove blockquote markers
    text = text.replace("---", "")  # Remove horizontal rules
    text = re.sub(r"\n{3,}", "\n\n", text)

    return text.strip()

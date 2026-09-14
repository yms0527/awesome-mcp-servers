"""HTML cleaning pipeline — strips bloat from web pages."""

from __future__ import annotations

from bs4 import BeautifulSoup, Comment, Tag

REMOVE_TAGS = {
    "script", "style", "noscript", "iframe", "object", "embed",
    "applet", "svg", "canvas", "video", "audio", "source", "track",
    "map", "area",
}

REMOVE_SELECTORS = [
    "nav",
    "[role='navigation']",
    "[role='banner']",
    "[role='complementary']",
    "[aria-hidden='true']",
    ".ad", ".ads", ".advertisement", ".adsbygoogle",
    ".sidebar", ".side-bar",
    ".cookie-banner", ".cookie-notice", ".cookie-consent",
    ".popup", ".modal", ".overlay",
    ".social-share", ".share-buttons", ".social-links",
    ".comments", ".comment-section", "#comments",
    ".newsletter", ".subscribe",
    ".breadcrumb", ".breadcrumbs",
    ".pagination",
    ".related-posts", ".related-articles",
    ".widget",
    "[data-ad]",
    "[data-tracking]",
]

STRIP_ATTR_PREFIXES = ("data-", "aria-", "on")

SELF_CLOSING = {"img", "br", "hr", "input", "meta", "link"}


def clean_html(html: str) -> str:
    """Remove non-content elements and unnecessary attributes from HTML."""
    soup = BeautifulSoup(html, "html.parser")

    # Remove HTML comments
    for comment in soup.find_all(string=lambda t: isinstance(t, Comment)):
        comment.extract()

    # Remove unwanted tags entirely
    for tag_name in REMOVE_TAGS:
        for tag in soup.find_all(tag_name):
            tag.decompose()

    # Remove non-content elements by selector
    for selector in REMOVE_SELECTORS:
        try:
            for el in soup.select(selector):
                el.decompose()
        except Exception:
            pass

    # Remove hidden elements
    for el in soup.find_all(True):
        if not isinstance(el, Tag):
            continue
        if el.has_attr("hidden"):
            el.decompose()
            continue
        style = el.get("style", "")
        if isinstance(style, str) and (
            "display:none" in style.replace(" ", "")
            or "visibility:hidden" in style.replace(" ", "")
        ):
            el.decompose()

    # Strip unnecessary attributes
    for el in soup.find_all(True):
        if not isinstance(el, Tag):
            continue
        attrs_to_remove = []
        for attr_name in list(el.attrs.keys()):
            lower = attr_name.lower()
            if lower in ("style", "class", "id", "role", "tabindex", "draggable", "contenteditable"):
                attrs_to_remove.append(attr_name)
            elif any(lower.startswith(p) for p in STRIP_ATTR_PREFIXES):
                attrs_to_remove.append(attr_name)
        for attr_name in attrs_to_remove:
            del el[attr_name]

    # Remove empty elements
    for el in soup.find_all(True):
        if not isinstance(el, Tag):
            continue
        if (
            el.name not in SELF_CLOSING
            and not el.get_text(strip=True)
            and not el.find("img")
        ):
            el.decompose()

    return str(soup)

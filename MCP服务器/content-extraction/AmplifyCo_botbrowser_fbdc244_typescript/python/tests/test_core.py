"""Tests for BotBrowser core extraction."""

from botbrowser.cleaner import clean_html
from botbrowser.converter import html_to_markdown, html_to_text
from botbrowser.models import BotBrowserResult, ExtractOptions, ExtractedLink, ExtractionMetadata
from botbrowser.core import _extract_title, _extract_description, _extract_links, _estimate_tokens


SAMPLE_HTML = """
<html>
<head>
    <title>Test Page</title>
    <meta name="description" content="A test page for BotBrowser">
    <script>console.log('tracking');</script>
    <style>body { color: red; }</style>
</head>
<body>
    <nav><a href="/">Home</a> <a href="/about">About</a></nav>
    <main>
        <h1>Hello World</h1>
        <p>This is the <strong>main content</strong> of the page.</p>
        <p>It has <a href="https://example.com">a link</a> and some text.</p>
        <ul>
            <li>Item one</li>
            <li>Item two</li>
            <li>Item three</li>
        </ul>
    </main>
    <footer>Copyright 2026</footer>
    <div class="cookie-banner">We use cookies</div>
    <div style="display:none">Hidden content</div>
</body>
</html>
"""


# --- Cleaner tests ---

def test_clean_html_removes_scripts():
    result = clean_html(SAMPLE_HTML)
    assert "<script>" not in result
    assert "tracking" not in result


def test_clean_html_removes_styles():
    result = clean_html(SAMPLE_HTML)
    assert "<style>" not in result


def test_clean_html_removes_nav():
    result = clean_html(SAMPLE_HTML)
    assert "<nav>" not in result


def test_clean_html_removes_cookie_banner():
    result = clean_html(SAMPLE_HTML)
    assert "cookie" not in result.lower()


def test_clean_html_removes_hidden():
    result = clean_html(SAMPLE_HTML)
    assert "Hidden content" not in result


def test_clean_html_preserves_main_content():
    result = clean_html(SAMPLE_HTML)
    assert "Hello World" in result
    assert "main content" in result


def test_clean_html_strips_attributes():
    html = '<div class="foo" id="bar" data-track="yes" style="color:red"><p>Text</p></div>'
    result = clean_html(html)
    assert 'class=' not in result
    assert 'id=' not in result
    assert 'data-track' not in result
    assert 'style=' not in result


def test_clean_html_removes_ads():
    html = '<div class="ad">Buy stuff</div><p>Real content</p>'
    result = clean_html(html)
    assert "Buy stuff" not in result
    assert "Real content" in result


def test_clean_html_handles_empty_input():
    result = clean_html("")
    assert isinstance(result, str)


# --- Converter tests ---

def test_html_to_markdown():
    html = "<h1>Title</h1><p>Hello <strong>world</strong></p>"
    md = html_to_markdown(html)
    assert "# Title" in md
    assert "**world**" in md


def test_html_to_markdown_links():
    html = '<p><a href="https://example.com">click</a></p>'
    md = html_to_markdown(html)
    assert "[click](https://example.com)" in md


def test_html_to_markdown_lists():
    html = "<ul><li>One</li><li>Two</li></ul>"
    md = html_to_markdown(html)
    assert "- One" in md
    assert "- Two" in md


def test_html_to_markdown_strips_data_uri_images():
    html = '<img src="data:image/png;base64,abc123" alt="bloat"><p>Text</p>'
    md = html_to_markdown(html)
    assert "data:" not in md
    assert "Text" in md


def test_html_to_markdown_keeps_normal_images():
    html = '<img src="https://example.com/img.png" alt="photo"><p>Text</p>'
    md = html_to_markdown(html)
    assert "![photo](https://example.com/img.png)" in md


def test_html_to_markdown_collapses_whitespace():
    html = "<p>Hello</p>\n\n\n\n\n<p>World</p>"
    md = html_to_markdown(html)
    assert "\n\n\n" not in md


def test_html_to_text():
    html = "<h1>Title</h1><p>Hello <strong>world</strong></p>"
    text = html_to_text(html)
    assert "Title" in text
    assert "world" in text
    assert "#" not in text
    assert "**" not in text


def test_html_to_text_strips_links():
    html = '<p><a href="https://example.com">click here</a></p>'
    text = html_to_text(html)
    assert "click here" in text
    assert "https://example.com" not in text


# --- Extractor helper tests ---

def test_extract_title():
    html = "<html><head><title>My Page</title></head><body></body></html>"
    assert _extract_title(html) == "My Page"


def test_extract_title_og_fallback():
    html = '<html><head><meta property="og:title" content="OG Title"></head><body></body></html>'
    assert _extract_title(html) == "OG Title"


def test_extract_title_empty():
    assert _extract_title("<html><head></head><body></body></html>") == ""


def test_extract_description():
    html = '<html><head><meta name="description" content="Test desc"></head><body></body></html>'
    assert _extract_description(html) == "Test desc"


def test_extract_description_og_fallback():
    html = '<html><head><meta property="og:description" content="OG desc"></head><body></body></html>'
    assert _extract_description(html) == "OG desc"


def test_extract_description_empty():
    assert _extract_description("<html><head></head><body></body></html>") == ""


def test_extract_links():
    html = """
    <a href="https://example.com/a">Link A</a>
    <a href="https://example.com/b">Link B</a>
    <a href="https://example.com/a">Link A again</a>
    """
    links = _extract_links(html, "https://example.com")
    assert len(links) == 2
    assert links[0].text == "Link A"
    assert links[0].href == "https://example.com/a"


def test_extract_links_resolves_relative():
    html = '<a href="/about">About</a>'
    links = _extract_links(html, "https://example.com")
    assert links[0].href == "https://example.com/about"


def test_extract_links_skips_non_http():
    html = """
    <a href="javascript:void(0)">JS</a>
    <a href="mailto:test@example.com">Email</a>
    <a href="https://example.com/real">Real</a>
    """
    links = _extract_links(html, "https://example.com")
    assert len(links) == 1
    assert links[0].text == "Real"


def test_extract_links_skips_same_page_anchors():
    html = '<a href="#section">Jump</a>'
    links = _extract_links(html, "https://example.com")
    assert len(links) == 0


# --- Token estimation ---

def test_estimate_tokens():
    assert _estimate_tokens("") == 0
    assert _estimate_tokens("abcd") == 1
    assert _estimate_tokens("abcdefgh") == 2


# --- Models ---

def test_extract_options_defaults():
    opts = ExtractOptions(url="https://example.com")
    assert opts.format == "markdown"
    assert opts.timeout == 15000
    assert opts.include_links is True
    assert opts.headers is None


def test_botbrowser_result_construction():
    result = BotBrowserResult(
        url="https://example.com",
        title="Test",
        description="Desc",
        content="# Test",
        text_content="Test",
        links=[ExtractedLink(text="link", href="https://example.com")],
        metadata=ExtractionMetadata(
            raw_token_estimate=1000,
            clean_token_estimate=100,
            token_savings_percent=90,
            word_count=50,
            fetched_at="2026-01-01T00:00:00Z",
        ),
    )
    assert result.url == "https://example.com"
    assert result.metadata.token_savings_percent == 90

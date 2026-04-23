"""BotBrowser — Token-efficient web content extraction for LLM agents."""

from botbrowser.core import extract
from botbrowser.client import BotBrowserClient
from botbrowser.models import BotBrowserResult, ExtractOptions, ExtractedLink, ExtractionMetadata

__version__ = "0.1.0"
__all__ = [
    "extract",
    "BotBrowserClient",
    "BotBrowserResult",
    "ExtractOptions",
    "ExtractedLink",
    "ExtractionMetadata",
]

"""HTTP client for BotBrowser REST API server."""

from __future__ import annotations

import httpx

from botbrowser.models import BotBrowserResult


class BotBrowserClient:
    """
    Client for the BotBrowser REST API server.

    Usage:
        client = BotBrowserClient("http://localhost:3000")
        result = client.extract("https://example.com")
        print(result.content)
    """

    def __init__(self, server_url: str = "http://localhost:3000") -> None:
        self.server_url = server_url.rstrip("/")
        self._client = httpx.Client(timeout=30)

    def extract(
        self,
        url: str,
        *,
        format: str = "markdown",
        timeout: int = 15000,
        include_links: bool = True,
    ) -> BotBrowserResult:
        """Extract content via the BotBrowser REST API server."""
        response = self._client.post(
            f"{self.server_url}/extract",
            json={
                "url": url,
                "format": format,
                "timeout": timeout,
                "includeLinks": include_links,
            },
        )
        response.raise_for_status()
        data = response.json()

        # Map camelCase API response to snake_case Python model
        return BotBrowserResult(
            url=data["url"],
            title=data["title"],
            description=data["description"],
            content=data["content"],
            text_content=data.get("textContent", data.get("text_content", "")),
            links=[
                {"text": link["text"], "href": link["href"]}
                for link in data.get("links", [])
            ],
            metadata={
                "raw_token_estimate": data["metadata"].get("rawTokenEstimate", data["metadata"].get("raw_token_estimate", 0)),
                "clean_token_estimate": data["metadata"].get("cleanTokenEstimate", data["metadata"].get("clean_token_estimate", 0)),
                "token_savings_percent": data["metadata"].get("tokenSavingsPercent", data["metadata"].get("token_savings_percent", 0)),
                "word_count": data["metadata"].get("wordCount", data["metadata"].get("word_count", 0)),
                "fetched_at": data["metadata"].get("fetchedAt", data["metadata"].get("fetched_at", "")),
            },
        )

    def health(self) -> dict:
        """Check server health."""
        response = self._client.get(f"{self.server_url}/health")
        response.raise_for_status()
        return response.json()

    def close(self) -> None:
        """Close the HTTP client."""
        self._client.close()

    def __enter__(self) -> BotBrowserClient:
        return self

    def __exit__(self, *args: object) -> None:
        self.close()

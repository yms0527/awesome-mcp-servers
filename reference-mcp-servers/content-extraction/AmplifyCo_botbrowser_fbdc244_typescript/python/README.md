# BotBrowser (Python)

Token-efficient web content extraction for LLM agents.

## Install

```bash
pip install botbrowser
```

## Usage

```python
from botbrowser import extract

result = extract("https://example.com")

print(result.content)                          # clean markdown
print(result.metadata.token_savings_percent)   # e.g. 94
print(result.title)                            # page title
print(result.links)                            # extracted links
```

## Options

```python
result = extract(
    "https://example.com",
    format="text",          # "markdown" (default) or "text"
    timeout=10000,          # request timeout in ms (default: 15000)
    include_links=False,    # extract links (default: True)
)
```

## Client Mode

If you're running the BotBrowser REST API server, you can use the client:

```python
from botbrowser import BotBrowserClient

client = BotBrowserClient("http://localhost:3000")
result = client.extract("https://example.com")
```

## License

MIT

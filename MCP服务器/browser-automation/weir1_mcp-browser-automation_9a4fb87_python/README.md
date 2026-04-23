# MCP Browser Automation Server

A simple but powerful browser automation server that allows you to control browsers, take screenshots, and monitor console logs through a REST API.

## Features

- Create browser sessions
- Navigate to URLs
- Take screenshots (full page or specific elements)
- Click elements
- Fill form inputs
- Monitor console logs in real-time through WebSocket
- Close sessions

## Installation

1. Clone this repository:
```powershell
git clone https://github.com/weir1/mcp-browser-automation.git
cd mcp-browser-automation
```

2. Create a virtual environment and activate it:
```powershell
python -m venv venv
.\venv\Scripts\Activate
```

3. Install dependencies:
```powershell
pip install -r requirements.txt
```

4. Install Playwright browsers:
```powershell
playwright install
```

## Usage

1. Start the server:
```powershell
python server.py
```

The server will start on `http://localhost:8000`

## API Endpoints

### Create a new session
```
POST /session/create
Response: { "session_id": "..." }
```

### Navigate to a URL
```
POST /session/{session_id}/navigate?url=https://example.com
```

### Take a screenshot
```
POST /session/{session_id}/screenshot?name=screenshot1&selector=.my-element
```
If selector is not provided, takes a full page screenshot.

### Click an element
```
POST /session/{session_id}/click?selector=.my-button
```

### Fill an input
```
POST /session/{session_id}/fill?selector=input[name="username"]&value=myuser
```

### Monitor console logs
```
WebSocket /session/{session_id}/console
```

### Close a session
```
POST /session/{session_id}/close
```

## Example Usage with Python

```python
import requests
import websockets
import asyncio
import json

# Create a session
response = requests.post("http://localhost:8000/session/create")
session_id = response.json()["session_id"]

# Navigate to a URL
requests.post(f"http://localhost:8000/session/{session_id}/navigate?url=https://example.com")

# Take a screenshot
response = requests.post(f"http://localhost:8000/session/{session_id}/screenshot?name=example")
with open("screenshot.png", "wb") as f:
    f.write(response.content)

# Monitor console logs
async def monitor_console():
    async with websockets.connect(f"ws://localhost:8000/session/{session_id}/console") as ws:
        while True:
            message = await ws.recv()
            print(json.loads(message))

asyncio.get_event_loop().run_until_complete(monitor_console())
```

## License

MIT
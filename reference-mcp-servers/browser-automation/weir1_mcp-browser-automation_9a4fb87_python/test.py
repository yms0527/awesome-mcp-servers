import requests
import asyncio
import websockets
import json
import os

# Create screenshots directory if it doesn't exist
os.makedirs("screenshots", exist_ok=True)

# Create a new browser session
response = requests.post("http://localhost:8000/session/create")
session_id = response.json()["session_id"]
print(f"Created session: {session_id}")

# Navigate to a website (let's use GitHub as an example)
url = "https://github.com"
print(f"Navigating to {url}")
response = requests.post(f"http://localhost:8000/session/{session_id}/navigate?url={url}")
print("Navigation complete")

# Take a screenshot
print("Taking screenshot...")
response = requests.post(f"http://localhost:8000/session/{session_id}/screenshot?name=github_home")
if response.status_code == 200:
    with open("screenshots/github_home.png", "wb") as f:
        f.write(response.content)
    print("Screenshot saved as github_home.png")

# Monitor console logs
async def monitor_console():
    print("Monitoring console logs (press Ctrl+C to stop)...")
    async with websockets.connect(f"ws://localhost:8000/session/{session_id}/console") as ws:
        while True:
            try:
                message = await ws.recv()
                console_msg = json.loads(message)
                print(f"Console {console_msg['type']}: {console_msg['text']}")
            except KeyboardInterrupt:
                break
            except Exception as e:
                print(f"Error: {e}")
                break

# Run the console monitor
print("Starting console monitoring...")
asyncio.get_event_loop().run_until_complete(monitor_console())
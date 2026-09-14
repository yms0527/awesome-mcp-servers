from fastapi import FastAPI, WebSocket, HTTPException
from fastapi.responses import FileResponse
from playwright.async_api import async_playwright
import asyncio
import os
import json
from datetime import datetime
from typing import Optional, Dict

app = FastAPI()
browser_contexts: Dict[str, dict] = {}

@app.on_event("startup")
async def startup_event():
    os.makedirs("screenshots", exist_ok=True)

@app.post("/session/create")
async def create_session():
    session_id = datetime.now().strftime("%Y%m%d_%H%M%S")
    p = await async_playwright().start()
    browser = await p.chromium.launch()
    context = await browser.new_context()
    page = await context.new_page()
    
    browser_contexts[session_id] = {
        "playwright": p,
        "browser": browser,
        "context": context,
        "page": page
    }
    return {"session_id": session_id}

@app.post("/session/{session_id}/navigate")
async def navigate(session_id: str, url: str):
    if session_id not in browser_contexts:
        raise HTTPException(status_code=404, detail="Session not found")
    
    page = browser_contexts[session_id]["page"]
    await page.goto(url)
    return {"status": "success"}

@app.post("/session/{session_id}/screenshot")
async def take_screenshot(session_id: str, name: str, selector: Optional[str] = None):
    if session_id not in browser_contexts:
        raise HTTPException(status_code=404, detail="Session not found")
    
    page = browser_contexts[session_id]["page"]
    filename = f"screenshots/{name}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.png"
    
    if selector:
        element = await page.wait_for_selector(selector)
        await element.screenshot(path=filename)
    else:
        await page.screenshot(path=filename)
    
    return FileResponse(filename)

@app.post("/session/{session_id}/click")
async def click_element(session_id: str, selector: str):
    if session_id not in browser_contexts:
        raise HTTPException(status_code=404, detail="Session not found")
    
    page = browser_contexts[session_id]["page"]
    await page.click(selector)
    return {"status": "success"}

@app.post("/session/{session_id}/fill")
async def fill_input(session_id: str, selector: str, value: str):
    if session_id not in browser_contexts:
        raise HTTPException(status_code=404, detail="Session not found")
    
    page = browser_contexts[session_id]["page"]
    await page.fill(selector, value)
    return {"status": "success"}

@app.websocket("/session/{session_id}/console")
async def websocket_console(websocket: WebSocket, session_id: str):
    if session_id not in browser_contexts:
        await websocket.close(code=1000, reason="Session not found")
        return
    
    await websocket.accept()
    page = browser_contexts[session_id]["page"]
    
    def handle_console(msg):
        asyncio.create_task(websocket.send_text(json.dumps({
            "type": msg.type,
            "text": msg.text
        })))
    
    page.on("console", handle_console)
    
    try:
        while True:
            await websocket.receive_text()
    except:
        page.remove_listener("console", handle_console)
        await websocket.close()

@app.post("/session/{session_id}/close")
async def close_session(session_id: str):
    if session_id not in browser_contexts:
        raise HTTPException(status_code=404, detail="Session not found")
    
    context = browser_contexts[session_id]
    await context["page"].close()
    await context["context"].close()
    await context["browser"].close()
    await context["playwright"].stop()
    del browser_contexts[session_id]
    return {"status": "success"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
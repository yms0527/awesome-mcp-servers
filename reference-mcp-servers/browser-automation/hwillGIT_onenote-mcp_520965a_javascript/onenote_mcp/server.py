"""
OneNote MCP Server - An MCP implementation for browsing and interacting with OneNote web app.

This MCP server provides the ability to browse and interact with a shared OneNote notebook
via browser-use automation. It allows operations like reading pages, navigating to specific sections,
adding notes, and more.

Usage:
    uvx install-local-mcp-server --path /path/to/this/directory
    
    # Or to run manually:
    uv sync --all-extras
    python -m onenote_mcp
"""

import asyncio
import json
import logging
import os
import sys
from typing import Dict, List, Optional, Any, Tuple, Union
from pathlib import Path

# Import MCP SDK
from mcp.server.fastmcp import FastMCP

# Import browser-use
from browser_use import Agent, Controller
from browser_use.agent.views import ActionResult
from browser_use.browser.browser import Browser, BrowserConfig
from browser_use.browser.context import BrowserContext

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger("onenote-mcp")

# Create MCP server
mcp = FastMCP("onenote_mcp")

# Initialize browser and controller
browser = Browser(
    config=BrowserConfig(
        headless=False,  # Set to True for headless mode in production
    )
)
controller = Controller()

# Global state
active_browser_context = None
active_agent = None
onenote_url = None

class OneNoteState:
    """Store state information about the OneNote session."""
    def __init__(self):
        self.current_notebook = None
        self.current_section = None
        self.current_page = None
        self.all_notebooks = []
        self.all_sections = []
        self.all_pages = []
        self.last_action_result = None
    
    def to_dict(self):
        """Convert state to a dictionary."""
        return {
            "current_notebook": self.current_notebook,
            "current_section": self.current_section,
            "current_page": self.current_page,
            "all_notebooks": self.all_notebooks,
            "all_sections": self.all_sections,
            "all_pages": self.all_pages,
            "last_action_result": self.last_action_result,
        }

# Initialize state
onenote_state = OneNoteState()

async def get_or_create_browser_context() -> BrowserContext:
    """Get existing browser context or create a new one."""
    global active_browser_context
    
    if active_browser_context is None:
        active_browser_context = await browser.new_context()
    
    return active_browser_context

@controller.action("Get all notebooks in the current OneNote")
async def get_notebooks(browser: BrowserContext) -> ActionResult:
    """Get all notebooks in the current OneNote view."""
    notebooks = []
    
    try:
        # Based on your screenshot, we may need to look for different selectors
        # Try multiple possible selectors for notebook names
        # First try the standard selector
        try:
            await browser.session.wait_for_selector(".NotebookName, .Notebook, #NotebooksNavigationContainer li", timeout=5000)
            
            # Try different possible selectors
            for selector in [".NotebookName", ".Notebook", "#NotebooksNavigationContainer li", ".TreeNodeContent"]:
                elements = await browser.session.query_selector_all(selector)
                if elements and len(elements) > 0:
                    for element in elements:
                        text = await element.text_content()
                        if text and text.strip():
                            notebooks.append(text.strip())
                    
                    # If we found notebooks, we can break the loop
                    if notebooks:
                        break
        except Exception as e:
            logger.warning(f"Standard notebook selectors failed: {str(e)}")
            
            # If standard selectors fail, try to get all list items in the navigation area
            # This is a fallback approach
            elements = await browser.session.query_selector_all("li")
            for element in elements:
                text = await element.text_content()
                # Check if this looks like a notebook name (not too long, not empty)
                if text and text.strip() and len(text.strip()) < 50:
                    notebooks.append(text.strip())
        
        # Attempt to filter and deduplicate notebooks
        if notebooks:
            # Remove duplicates
            notebooks = list(dict.fromkeys(notebooks))
            
            result = f"Found notebooks: {', '.join(notebooks)}"
            onenote_state.all_notebooks = notebooks
            return ActionResult(extracted_content=result, include_in_memory=True)
        else:
            logger.warning("No notebooks found with any selector")
            
            # Last resort: take a screenshot to help diagnose the issue
            screenshot_path = "notebooks_view.png"
            
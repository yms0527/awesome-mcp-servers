#! /usr/bin/env python3
"""
This is a MPC server for creating and editing Google Slides presentations.
It can create a new presentation, add text to a slide, and save the current slide as a PNG image.

Author: Shilpaj Bhalerao
Date: Apr 23, 2025
"""
# Standard Library Imports
import time, sys
import logging
import shutil
import os
import subprocess
from pathlib import Path
from typing import List

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Get project root directory (two levels up from this file)
PROJECT_ROOT = Path(__file__).parent.parent.absolute()
logger.info(f"Project root directory: {PROJECT_ROOT}")

# Third Party Imports
try:
    import webbrowser
    from mcp.server.fastmcp import FastMCP
    from mcp.types import TextContent
except Exception as e:
    logger.error(f"Error importing required packages: {e}")
    sys.exit(1)

# Initialize MCP server
try:
    mcp = FastMCP("Slides")
except Exception as e:
    logger.error(f"Error initializing MCP server: {e}")
    sys.exit(1)

def create_text_content(message: str) -> TextContent:
    """Helper function to create properly formatted TextContent objects"""
    return TextContent(type="text", text=message)

def init_display():
    """Initialize X11 display settings"""
    try:
        # Try different display values
        display_options = [':0', ':1', os.environ.get('DISPLAY', '')]
        
        for display in display_options:
            if not display:
                continue
                
            os.environ['DISPLAY'] = display
            try:
                # Try importing display-dependent packages
                import pyautogui
                import screeninfo
                logger.info(f"Successfully initialized display: {display}")
                return True, None
            except Exception:
                continue
        
        raise Exception("Could not initialize any display")
    except Exception as e:
        logger.error(f"Display initialization failed: {e}")
        return False, str(e)

# Try to initialize display
DISPLAY_AVAILABLE, DISPLAY_ERROR = init_display()

@mcp.tool(
    name="create_new_presentation",
    description="Creates a new Google Slides presentation in the browser"
)
async def create_new_presentation() -> List[TextContent]:
    """
    Opens a new Google Slides presentation in the default browser.
    """
    try:
        logger.info("Opening new presentation...")
        webbrowser.open("https://docs.google.com/presentation/u/0/create")
        return [create_text_content("New presentation created successfully")]
    except Exception as e:
        return [create_text_content(f"Error: {str(e)}")]

@mcp.tool(
    name="add_text_to_slide",
    description="Adds text to the current slide. Parameters: text (string) - The text to add, use_secondary_screen (boolean) - If True, use the secondary screen"
)
async def add_text_to_slide(text: str = "Sample Text", use_secondary_screen: bool = True) -> List[TextContent]:
    """
    Adds text directly to the slide.
    :param text: The text to add
    :param use_secondary_screen: If True, use the secondary screen (with larger x-coordinate)
    """
    if not DISPLAY_AVAILABLE:
        return [create_text_content(f"Display not available: {DISPLAY_ERROR}")]
        
    try:
        import pyautogui
        import screeninfo
        
        # Configure pyautogui settings
        pyautogui.PAUSE = 1.5
        pyautogui.FAILSAFE = True
        
        # Get screen information
        screens = screeninfo.get_monitors()
        if not screens:
            return [create_text_content("No screens detected!")]
            
        # Use primary screen if secondary not available
        target_screen = screens[-1] if use_secondary_screen and len(screens) > 1 else screens[0]
        
        # Calculate center position
        center_x = target_screen.x + (target_screen.width // 2)
        center_y = target_screen.y + (target_screen.height // 2)
        
        # Move to center and click to ensure focus
        pyautogui.moveTo(center_x, center_y)
        pyautogui.click()
        time.sleep(2)
        
        # Click on "Click to add title"
        title_y = center_y - 100
        pyautogui.moveTo(center_x, title_y)
        pyautogui.click()
        time.sleep(1)
        
        # Type the text
        pyautogui.write(text, interval=0.1)
        time.sleep(1)
        
        # Press Esc to finish editing
        pyautogui.press('esc')
        
        return [create_text_content(f"Successfully added text: {text}")]
        
    except Exception as e:
        return [create_text_content(f"Error adding text: {str(e)}")]

@mcp.tool(
    name="save_slide_as_png",
    description="Saves the current slide as a PNG image and moves it to PROJECT_ROOT/content/slide.png"
)
async def save_slide_as_png(use_secondary_screen: bool = True) -> List[TextContent]:
    """
    Saves the current slide as a PNG image and moves it to PROJECT_ROOT/content/slide.png.
    :param use_secondary_screen: If True, use the secondary screen (with larger x-coordinate)
    """
    if not DISPLAY_AVAILABLE:
        return [create_text_content(f"Display not available: {DISPLAY_ERROR}")]
        
    try:
        import pyautogui
        import screeninfo
        
        # Configure pyautogui settings
        pyautogui.PAUSE = 2.5
        pyautogui.FAILSAFE = True
        
        # Get screen information
        screens = screeninfo.get_monitors()
        if not screens:
            return [create_text_content("No screens detected!")]
            
        # Use primary screen if secondary not available
        target_screen = screens[-1] if use_secondary_screen and len(screens) > 1 else screens[0]
        
        # Calculate center position
        center_x = target_screen.x + (target_screen.width // 2)
        center_y = target_screen.y + (target_screen.height // 2)
        
        # Click to ensure focus
        pyautogui.moveTo(center_x, center_y)
        pyautogui.click()
        time.sleep(2)
        
        # Open File menu using Alt+F
        pyautogui.hotkey('alt', 'f')
        time.sleep(2)
        
        # Press 'D' for Download submenu
        pyautogui.press('d')
        time.sleep(2)
        
        # Press 'N' for PNG Image option
        pyautogui.press('N')
        time.sleep(2)
        
        # Get paths
        home = Path.home()
        downloads_dir = home / "Downloads"
        default_download = downloads_dir / "Untitled presentation.png"
        
        # Wait for file to be downloaded
        logger.info(f"Waiting for download at: {default_download}")
        timeout = 10  # Wait up to 10 seconds
        while timeout > 0 and not default_download.exists():
            time.sleep(1)
            timeout -= 1
            
        if not default_download.exists():
            return [create_text_content("Error: Download timeout - file not found")]
            
        # Create content directory in project root if it doesn't exist
        content_dir = PROJECT_ROOT / "content"
        content_dir.mkdir(parents=True, exist_ok=True)
        logger.info(f"Content directory: {content_dir}")
        
        # Move and rename the file
        target_path = content_dir / "slide.png"
        try:
            # Wait a bit to ensure file is fully written
            time.sleep(2)
            shutil.move(str(default_download), str(target_path))
            logger.info(f"Moved file to: {target_path}")
            return [create_text_content(f"Slide saved and moved to {target_path}")]
        except Exception as move_error:
            return [create_text_content(f"Error moving file: {str(move_error)}")]
        
    except Exception as e:
        return [create_text_content(f"Error saving slide as PNG: {str(e)}")]

if __name__ == "__main__":
    try:
        logger.info("Starting MCP Slides server...")
        mcp.run()
    except Exception as e:
        logger.error(f"Error running slides server: {e}")
        sys.exit(1)

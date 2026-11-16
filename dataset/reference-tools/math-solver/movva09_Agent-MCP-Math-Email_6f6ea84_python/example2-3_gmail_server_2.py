# basic import 
from mcp.server.fastmcp import FastMCP, Image
from mcp.server.fastmcp.prompts import base
from mcp.types import TextContent
from mcp import types
from PIL import Image as PILImage
import math
import sys
from pywinauto.application import Application
import win32gui
import win32con
import time
from win32api import GetSystemMetrics

from typing import Any
import argparse
import os
import asyncio
import logging
import base64
from email.message import EmailMessage
from email.header import decode_header
from base64 import urlsafe_b64decode
from email import message_from_bytes
import webbrowser

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# instantiate an MCP server client
mcp = FastMCP("CalculatorEmail")

# DEFINE TOOLS
#send email tool
@mcp.tool()
async def send_email(subject: str, message: str, recipient_id: str) -> dict:
    """Creates and sends an email message to me"""
    try:
        # Initialize GmailService with proper paths
        recipient_id = "xxxxxxxxx@gmail.com"
        creds_file_path = os.path.join(".google", "client_creds.json")
        token_path = os.path.join(".google", "token.json")
        scopes = ['https://www.googleapis.com/auth/gmail.modify']
        
        logger.info(f"Initializing GmailService with creds file: {creds_file_path}")
        
        # Get or refresh token
        token = None
        if os.path.exists(token_path):
            logger.info('Loading token from file')
            token = Credentials.from_authorized_user_file(token_path, scopes)

        if not token or not token.valid:
            if token and token.expired and token.refresh_token:
                logger.info('Refreshing token')
                token.refresh(Request())
            else:
                logger.info('Fetching new token')
                flow = InstalledAppFlow.from_client_secrets_file(creds_file_path, scopes)
                token = flow.run_local_server(port=0)

            with open(token_path, 'w') as token_file:
                token_file.write(token.to_json())
                logger.info(f'Token saved to {token_path}')

        # Initialize Gmail API service
        service = build('gmail', 'v1', credentials=token)
        
        # Get user email address
        profile = service.users().getProfile(userId='me').execute()
        user_email = profile.get('emailAddress', '')
        logger.info(f"User email retrieved: {user_email}")

        # Create and send email message
        message_obj = EmailMessage()
        message_obj.set_content(message)
        message_obj['To'] = recipient_id
        message_obj['From'] = user_email
        message_obj['Subject'] = subject

        encoded_message = base64.urlsafe_b64encode(message_obj.as_bytes()).decode()
        create_message = {'raw': encoded_message}
        
        send_message = await asyncio.to_thread(
            service.users().messages().send(userId="me", body=create_message).execute
        )
        logger.info(f"Message sent: {send_message['id']}")

        return {
            "content": [
                TextContent(
                    type="text",
                    text=f"Sucessfully sent email to {recipient_id[:-13]+'xxx.@gmail.com'} \
                    status: success, message_id: {send_message['id']}"
                )
            ]
        }
    except Exception as e:
        logger.error(f"Error sending email: {str(e)}")
        return {
            "content": [
                TextContent(
                    type="text",
                    text=f"Error sending email: \
                    status: error, error_message: {str(e)}"
                )
            ]
        }


@mcp.tool()
def add(a: int, b: int) -> int:
    """Add two numbers"""
    print("CALLED: add(a: int, b: int) -> int:")
    return int(a + b)

@mcp.tool()
def add_list(l: list) -> int:
    """Add all numbers in a list"""
    print("CALLED: add(l: list) -> int:")
    return sum(l)

# subtraction tool
@mcp.tool()
def subtract(a: int, b: int) -> int:
    """Subtract two numbers"""
    print("CALLED: subtract(a: int, b: int) -> int:")
    return int(a - b)

# multiplication tool
@mcp.tool()
def multiply(a: int, b: int) -> int:
    """Multiply two numbers"""
    print("CALLED: multiply(a: int, b: int) -> int:")
    return int(a * b)

#  division tool
@mcp.tool() 
def divide(a: int, b: int) -> float:
    """Divide two numbers"""
    print("CALLED: divide(a: int, b: int) -> float:")
    return float(a / b)

# power tool
@mcp.tool()
def power(a: int, b: int) -> int:
    """Power of two numbers"""
    print("CALLED: power(a: int, b: int) -> int:")
    return int(a ** b)

# square root tool
@mcp.tool()
def sqrt(a: int) -> float:
    """Square root of a number"""
    print("CALLED: sqrt(a: int) -> float:")
    return float(a ** 0.5)

# cube root tool
@mcp.tool()
def cbrt(a: int) -> float:
    """Cube root of a number"""
    print("CALLED: cbrt(a: int) -> float:")
    return float(a ** (1/3))

# factorial tool
@mcp.tool()
def factorial(a: int) -> int:
    """factorial of a number"""
    print("CALLED: factorial(a: int) -> int:")
    return int(math.factorial(a))

# log tool
@mcp.tool()
def log(a: int) -> float:
    """log of a number"""
    print("CALLED: log(a: int) -> float:")
    return float(math.log(a))

# remainder tool
@mcp.tool()
def remainder(a: int, b: int) -> int:
    """remainder of two numbers divison"""
    print("CALLED: remainder(a: int, b: int) -> int:")
    return int(a % b)

# sin tool
@mcp.tool()
def sin(a: int) -> float:
    """sin of a number"""
    print("CALLED: sin(a: int) -> float:")
    return float(math.sin(a))

# cos tool
@mcp.tool()
def cos(a: int) -> float:
    """cos of a number"""
    print("CALLED: cos(a: int) -> float:")
    return float(math.cos(a))

# tan tool
@mcp.tool()
def tan(a: int) -> float:
    """tan of a number"""
    print("CALLED: tan(a: int) -> float:")
    return float(math.tan(a))

# mine tool
@mcp.tool()
def mine(a: int, b: int) -> int:
    """special mining tool"""
    print("CALLED: mine(a: int, b: int) -> int:")
    return int(a - b - b)

@mcp.tool()
def create_thumbnail(image_path: str) -> Image:
    """Create a thumbnail from an image"""
    print("CALLED: create_thumbnail(image_path: str) -> Image:")
    img = PILImage.open(image_path)
    img.thumbnail((100, 100))
    return Image(data=img.tobytes(), format="png")

@mcp.tool()
def strings_to_chars_to_int(string: str) -> list[int]:
    """Return the ASCII values of the characters in a word"""
    print("CALLED: strings_to_chars_to_int(string: str) -> list[int]:")
    return [int(ord(char)) for char in string]

@mcp.tool()
def int_list_to_exponential_sum(int_list: list) -> float:
    """Return sum of exponentials of numbers in a list"""
    print("CALLED: int_list_to_exponential_sum(int_list: list) -> float:")
    return sum(math.exp(i) for i in int_list)

@mcp.tool()
def fibonacci_numbers(n: int) -> list:
    """Return the first n Fibonacci Numbers"""
    print("CALLED: fibonacci_numbers(n: int) -> list:")
    if n <= 0:
        return []
    fib_sequence = [0, 1]
    for _ in range(2, n):
        fib_sequence.append(fib_sequence[-1] + fib_sequence[-2])
    return fib_sequence[:n]


@mcp.tool()
async def draw_rectangle(x1: int, y1: int, x2: int, y2: int) -> dict:
    """Draw a rectangle in Paint from (x1,y1) to (x2,y2)"""
    global paint_app
    try:
        if not paint_app:
            return {
                "content": [
                    TextContent(
                        type="text",
                        text="Paint is not open. Please call open_paint first."
                    )
                ]
            }
        
        # Get the Paint window
        paint_window = paint_app.window(class_name='MSPaintApp')
        
        # Get primary monitor width to adjust coordinates
        primary_width = GetSystemMetrics(0)
        primary_height = GetSystemMetrics(1)
        print(f"Primary Monitor Width: {primary_width}, Primary Monitor Height: {primary_height}", flush=True)
        
        # Ensure Paint window is active
        if not paint_window.has_focus():
            paint_window.set_focus()
            time.sleep(0.2)
        
        # Click on the Rectangle tool using the correct coordinates for primary screen
        paint_window.click_input(coords=(800, 128))  # Rectangle tool coordinates
        time.sleep(0.2)
        
        # Get the canvas area
        canvas = paint_window.child_window(class_name='MSPaintView')
        
        # Ensure canvas is ready
        canvas.wait('ready', timeout=10)
        
        # Move to starting point
        canvas.move_mouse_input(coords=(x1, y1))
        time.sleep(0.2)
        
        # Press left mouse button
        canvas.press_mouse_input(coords=(x1, y1), button='left')
        time.sleep(0.2)
        
        # Drag to end point
        canvas.drag_mouse_input(src=(x1, y1), dst=(x2, y2), button='left')
        time.sleep(0.2)
        
        # Release mouse button
        canvas.release_mouse_input(coords=(x2+2, y2+2), button='left')
        time.sleep(0.2)
        
        return {
            "content": [
                TextContent(
                    type="text",
                    text=f"Rectangle drawn from ({x1},{y1}) to ({x2},{y2})"
                )
            ]
        }
    except Exception as e:
        return {
            "content": [
                TextContent(
                    type="text",
                    text=f"Error drawing rectangle: {str(e)}"
                )
            ]
        }

@mcp.tool()
async def add_text_in_paint(text: str) -> dict:
    """Add text in Paint"""
    global paint_app
    try:
        if not paint_app:
            return {
                "content": [
                    TextContent(
                        type="text",
                        text="Paint is not open. Please call open_paint first."
                    )
                ]
            }
        
        # Get the Paint window
        paint_window = paint_app.window(class_name='MSPaintApp')
        
        # Ensure Paint window is active
        if not paint_window.has_focus():
            paint_window.set_focus()  # Set focus to Paint window
            time.sleep(0.2)
        
        # Click on the Text tool
        #paint_window.type_keys('t',set_foreground=False)
        paint_window.click_input(coords=(516, 138))  # Text tool coordinates
        time.sleep(0.2)
        
        # Get the canvas area
        canvas = paint_window.child_window(class_name='MSPaintView')
        
        # Click where to start typing
        #canvas.click_input(coords=(620, 420),button='left')
        canvas.press_mouse_input(coords=(620, 420),button='left')
        time.sleep(0.2)
        # Drag to end point
        canvas.drag_mouse_input(src=(620, 420), dst=(940, 570), button='left')
        time.sleep(0.2)
        # Type the text directly at cursor location without keyboard shortcuts
        canvas.type_keys(text,with_spaces=True,with_tabs=True,with_newlines=True)
    
        # Wait a bit after typing
        time.sleep(0.2)
        
        # Click select tool to exit text mode (any point outside text box)
        paint_window.click_input(coords=(70, 150))  # Text tool coordinates
        time.sleep(0.2)
        
        return {
            "content": [
                TextContent(
                    type="text",
                    text=f"Text:'{text}' added successfully"
                )
            ]
        }
    except Exception as e:
        return {
            "content": [
                TextContent(
                    type="text",
                    text=f"Error adding text: {str(e)}"
                )
            ]
        }

@mcp.tool()
async def open_paint() -> dict:
    """Open Microsoft Paint maximized on Current monitor"""
    global paint_app
    try:
        paint_app = Application().start('mspaint.exe')
        time.sleep(0.2)
        
        # Get the Paint window
        paint_window = paint_app.window(class_name='MSPaintApp')
        
        # Get primary monitor width
        primary_width = GetSystemMetrics(0)
        
        # First move to primary monitor without specifying size
        win32gui.SetWindowPos(
            paint_window.handle,
            win32con.HWND_TOP,
            1, 0,  # Position it on curent monitor itself
            1920, 1080,  # Let Windows handle the size
            win32con.SWP_NOSIZE  # Don't change the size
        )
        
        # Now maximize the window
        win32gui.ShowWindow(paint_window.handle, win32con.SW_MAXIMIZE)
        time.sleep(0.2)
        
        return {
            "content": [
                TextContent(
                    type="text",
                    text="Paint opened successfully on primary monitor and maximized"
                )
            ]
        }
    except Exception as e:
        return {
            "content": [
                TextContent(
                    type="text",
                    text=f"Error opening Paint: {str(e)}"
                )
            ]
        }

# DEFINE RESOURCES

# Add a dynamic greeting resource
@mcp.resource("greeting://{name}")
def get_greeting(name: str) -> str:
    """Get a personalized greeting"""
    print("CALLED: get_greeting(name: str) -> str:")
    return f"Hello, {name}!"


# DEFINE AVAILABLE PROMPTS
@mcp.prompt()
def review_code(code: str) -> str:
    """Review the provided code and provide feedback"""
    print("CALLED: review_code(code: str) -> str:")
    return f"Please review this code:\n\n{code}"


@mcp.prompt()
def debug_error(error: str) -> list[base.Message]:
    return [
        base.UserMessage("I'm seeing this error:"),
        base.UserMessage(error),
        base.AssistantMessage("I'll help debug that. What have you tried so far?"),
    ]

if __name__ == "__main__":
    try:
        # Check if running with mcp dev command
        print("STARTING SERVER")
        if len(sys.argv) > 1 and sys.argv[1] == "dev":
            mcp.run()  # Run without transport for dev server
        else:
            mcp.run(transport="stdio")  # Run with stdio for direct execution
    except Exception as e:
        logger.error(f"Error starting server: {str(e)}")
        sys.exit(1)


#!/usr/bin/env python3
"""
MCP Server for image manipulation
This wraps around our command-line tool to provide an MCP interface
"""

import os
import sys
import asyncio
import subprocess
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import io

from mcp.server.fastmcp import FastMCP
from mcp.types import TextContent

# Initialize MCP server
mcp = FastMCP("ImageEditor")

def create_image_with_rectangle_and_text(
    output_path: str,
    width: int = 800,
    height: int = 600,
    bg_color: str = "white",
    rect_x1: int = 100,
    rect_y1: int = 100,
    rect_x2: int = 300,
    rect_y2: int = 200,
    rect_color: str = "black",
    text: str = "Hello, world!",
    text_x: int = 150,
    text_y: int = 250,
    text_color: str = "black",
    text_size: int = 24
):
    """Create an image with a rectangle and text
    output_path: str - The path to save the image
    width: int - The width of the image
    height: int - The height of the image
    bg_color: str - The background color of the image
    rect_x1: int - The x coordinate of the top left corner of the rectangle
    rect_y1: int - The y coordinate of the top left corner of the rectangle
    """
    try:
        # Create a new image
        print(f"Creating image: {width}x{height}")
        img = Image.new("RGB", (width, height), bg_color)
        draw = ImageDraw.Draw(img)
        
        # Draw rectangle
        print(f"Drawing rectangle from ({rect_x1}, {rect_y1}) to ({rect_x2}, {rect_y2})")
        draw.rectangle([(rect_x1, rect_y1), (rect_x2, rect_y2)], outline=rect_color, width=2)
        
        # Try to load a font, fall back to default if not available
        try:
            # Try to find a system font
            font_options = [
                "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
                "/usr/share/fonts/TTF/DejaVuSans.ttf",
                "/usr/share/fonts/truetype/freefont/FreeSans.ttf",
                "/usr/share/fonts/liberation/LiberationSans-Regular.ttf"
            ]
            
            font = None
            for font_path in font_options:
                if os.path.exists(font_path):
                    font = ImageFont.truetype(font_path, text_size)
                    break
                    
            if font is None:
                # Fall back to default
                font = ImageFont.load_default()
                
        except Exception:
            # If font loading fails, use default
            font = ImageFont.load_default()
        
        # Draw text
        print(f"Adding text '{text}' at position ({text_x}, {text_y})")
        draw.text((text_x, text_y), text, fill=text_color, font=font)
        
        # Ensure output directory exists
        output_dir = os.path.dirname(output_path)
        if output_dir and not os.path.exists(output_dir):
            os.makedirs(output_dir)
            
        # Save image
        print(f"Saving image to {output_path}")
        img.save(output_path)
        
        print(f"Image created successfully at {output_path}")
        return True
        
    except Exception as e:
        print(f"Error creating image: {e}")
        return False

@mcp.tool()
async def create_image_with_rectangle_and_text_tool(
    output_path: str,
    width: int = 800,
    height: int = 600,
    bg_color: str = "white",
    rect_x1: int = 100,
    rect_y1: int = 100,
    rect_x2: int = 300,
    rect_y2: int = 200,
    rect_color: str = "black",
    text: str = "Hello, world!",
    text_x: int = 150,
    text_y: int = 250,
    text_color: str = "black",
    text_size: int = 24
) -> dict:
    """
    Create an image with a rectangle and text
    output_path: str - The path to save the image
    width: int - The width of the image
    height: int - The height of the image
    bg_color: str - The background color of the image
    rect_x1: int - The x coordinate of the top left corner of the rectangle
    rect_y1: int - The y coordinate of the top left corner of the rectangle
    rect_x2: int - The x coordinate of the bottom right corner of the rectangle
    rect_y2: int - The y coordinate of the bottom right corner of the rectangle
    rect_color: str - The color of the rectangle
    text: str - The text to display on the image
    text_x: int - The x coordinate of the text
    text_y: int - The y coordinate of the text
    text_color: str - The color of the text
    text_size: int - The size of the text
    """
    try:
        # Print debug info for parameters
        print(f"DEBUG: Received parameters for image creation:")
        print(f"  output_path: {output_path}")
        print(f"  width: {width}")
        print(f"  height: {height}")
        print(f"  bg_color: {bg_color}")
        print(f"  rect_x1: {rect_x1}")
        print(f"  rect_y1: {rect_y1}")
        print(f"  rect_x2: {rect_x2}")
        print(f"  rect_y2: {rect_y2}")
        print(f"  rect_color: {rect_color}")
        print(f"  text: {text}")
        print(f"  text_x: {text_x}")
        print(f"  text_y: {text_y}")
        print(f"  text_color: {text_color}")
        print(f"  text_size: {text_size}")
        
        # Fix common parameter issues
        param_names = ['output_path', 'bg_color', 'rect_color', 'text_color']
        
        # If output_path is literally the string "output_path", use a default
        if output_path == "output_path":
            output_path = "output.png"
            print(f"WARNING: Parameter output_path was passed as string 'output_path', using {output_path} instead")
            
        # Handle bg_color
        if bg_color == "bg_color":
            bg_color = "white"
            print(f"WARNING: Parameter bg_color was passed as string 'bg_color', using {bg_color} instead")
            
        # Handle rect_color
        if rect_color == "rect_color":
            rect_color = "black" 
            print(f"WARNING: Parameter rect_color was passed as string 'rect_color', using {rect_color} instead")
            
        # Handle text_color
        if text_color == "text_color":
            text_color = "black"
            print(f"WARNING: Parameter text_color was passed as string 'text_color', using {text_color} instead")
        
        # Handle default values if parameters seem to be swapped
        if not os.path.dirname(output_path) and output_path.isdigit():
            print("WARNING: output_path appears to be a number, using default path")
            output_path = "result_image.png"
            
        if isinstance(bg_color, int) or (isinstance(bg_color, str) and bg_color.isdigit()):
            print("WARNING: bg_color appears to be a number, using default color")
            bg_color = "white"
            
        if isinstance(rect_color, int) or (isinstance(rect_color, str) and rect_color.isdigit()):
            print("WARNING: rect_color appears to be a number, using default color")
            rect_color = "black"
            
        if isinstance(text_color, int) or (isinstance(text_color, str) and text_color.isdigit()):
            print("WARNING: text_color appears to be a number, using default color")
            text_color = "black"
        
        # Call the integrated function directly
        success = create_image_with_rectangle_and_text(
            output_path=output_path,
            width=width,
            height=height,
            bg_color=bg_color,
            rect_x1=rect_x1,
            rect_y1=rect_y1,
            rect_x2=rect_x2,
            rect_y2=rect_y2,
            rect_color=rect_color,
            text=text,
            text_x=text_x,
            text_y=text_y,
            text_color=text_color,
            text_size=text_size
        )
        
        if success:
            return {
                "content": [
                    TextContent(
                        type="text",
                        text=f"Image created successfully at {output_path}"
                    )
                ]
            }
        else:
            return {
                "content": [
                    TextContent(
                        type="text",
                        text=f"Failed to create image"
                    )
                ]
            }
    except Exception as e:
        print(f"Error creating image: {e}")
        # Try with default parameters as fallback
        try:
            print("Attempting to create image with default parameters...")
            output_path = "fallback_image.png" if not isinstance(output_path, str) else output_path
            if output_path == "output_path":
                output_path = "output.png"
            
            success = create_image_with_rectangle_and_text(
                output_path=output_path,
                width=800,
                height=600,
                bg_color="white",
                rect_x1=100,
                rect_y1=100,
                rect_x2=300,
                rect_y2=200,
                rect_color="black",
                text=text if isinstance(text, str) else "Failed to get proper parameters",
                text_x=150,
                text_y=150,
                text_color="black",
                text_size=24
            )
            
            if success:
                return {
                    "content": [
                        TextContent(
                            type="text",
                            text=f"Image created with fallback parameters at {output_path}"
                        )
                    ]
                }
        except Exception as fallback_e:
            print(f"Fallback also failed: {fallback_e}")
            
        return {
            "content": [
                TextContent(
                    type="text",
                    text=f"Error creating image: {str(e)}"
                )
            ]
        }

@mcp.tool()
async def create_thumbnail(image_path: str):
    """Create a thumbnail of an image
    image_path: str - The path to the image file
    """
    try:
        # Check if file exists
        if not os.path.exists(image_path):
            return {
                "content": [
                    TextContent(
                        type="text",
                        text=f"Image file '{image_path}' does not exist"
                    )
                ]
            }
        
        # Open the image and create a thumbnail
        img = Image.open(image_path)
        img.thumbnail((100, 100))
        
        # Save to memory
        buffer = io.BytesIO()
        img.save(buffer, format="PNG")
        
        # Return as data
        return {"data": buffer.getvalue(), "mime_type": "image/png"}
    except Exception as e:
        print(f"Error creating thumbnail: {e}")
        return {
            "content": [
                TextContent(
                    type="text",
                    text=f"Error creating thumbnail: {str(e)}"
                )
            ]
        }

if __name__ == "__main__":
    try:
        print("Starting MCP Image server...")
        mcp.run()
    except Exception as e:
        print(f"Error running image server: {e}")

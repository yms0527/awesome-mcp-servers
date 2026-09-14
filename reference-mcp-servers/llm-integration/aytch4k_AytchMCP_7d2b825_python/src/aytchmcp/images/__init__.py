"""
Images module for AytchMCP.

This module provides functionality for handling image data.
"""

import base64
import io
import os
from pathlib import Path
from typing import Optional, Union, List, Dict, Any

from loguru import logger
from pydantic import BaseModel, Field


class Image(BaseModel):
    """
    Image class for handling image data.
    
    This class provides functionality for working with images in various formats.
    """
    
    content: Optional[bytes] = Field(
        default=None,
        description="Raw image content as bytes",
    )
    base64_content: Optional[str] = Field(
        default=None,
        description="Base64-encoded image content",
    )
    url: Optional[str] = Field(
        default=None,
        description="URL to the image",
    )
    path: Optional[str] = Field(
        default=None,
        description="Path to the image file",
    )
    mime_type: Optional[str] = Field(
        default=None,
        description="MIME type of the image",
    )
    metadata: Dict[str, Any] = Field(
        default_factory=dict,
        description="Additional metadata for the image",
    )
    
    class Config:
        """Pydantic model configuration."""
        
        arbitrary_types_allowed = True
    
    @classmethod
    def from_bytes(cls, content: bytes, mime_type: Optional[str] = None, **kwargs) -> "Image":
        """
        Create an Image from bytes.
        
        Args:
            content: The image content as bytes.
            mime_type: The MIME type of the image.
            **kwargs: Additional metadata.
            
        Returns:
            An Image instance.
        """
        return cls(
            content=content,
            mime_type=mime_type or "application/octet-stream",
            metadata=kwargs,
        )
    
    @classmethod
    def from_base64(cls, base64_content: str, mime_type: Optional[str] = None, **kwargs) -> "Image":
        """
        Create an Image from base64-encoded content.
        
        Args:
            base64_content: The base64-encoded image content.
            mime_type: The MIME type of the image.
            **kwargs: Additional metadata.
            
        Returns:
            An Image instance.
        """
        # Remove data URL prefix if present
        if base64_content.startswith("data:"):
            # Extract MIME type from data URL
            if mime_type is None and ";" in base64_content:
                mime_type = base64_content.split(";")[0].split(":")[1]
            
            # Remove prefix
            base64_content = base64_content.split(",", 1)[1]
        
        return cls(
            base64_content=base64_content,
            mime_type=mime_type,
            metadata=kwargs,
        )
    
    @classmethod
    def from_url(cls, url: str, **kwargs) -> "Image":
        """
        Create an Image from a URL.
        
        Args:
            url: The URL to the image.
            **kwargs: Additional metadata.
            
        Returns:
            An Image instance.
        """
        return cls(
            url=url,
            metadata=kwargs,
        )
    
    @classmethod
    def from_path(cls, path: Union[str, Path], **kwargs) -> "Image":
        """
        Create an Image from a file path.
        
        Args:
            path: The path to the image file.
            **kwargs: Additional metadata.
            
        Returns:
            An Image instance.
        """
        path_str = str(path)
        return cls(
            path=path_str,
            metadata=kwargs,
        )
    
    def to_bytes(self) -> bytes:
        """
        Get the image content as bytes.
        
        Returns:
            The image content as bytes.
        """
        if self.content is not None:
            return self.content
        
        if self.base64_content is not None:
            return base64.b64decode(self.base64_content)
        
        if self.path is not None:
            with open(self.path, "rb") as f:
                return f.read()
        
        if self.url is not None:
            import httpx
            
            response = httpx.get(self.url)
            response.raise_for_status()
            return response.content
        
        raise ValueError("No image content available")
    
    def to_base64(self) -> str:
        """
        Get the image content as base64-encoded string.
        
        Returns:
            The base64-encoded image content.
        """
        if self.base64_content is not None:
            return self.base64_content
        
        return base64.b64encode(self.to_bytes()).decode("utf-8")
    
    def to_data_url(self) -> str:
        """
        Get the image as a data URL.
        
        Returns:
            The image as a data URL.
        """
        mime_type = self.mime_type or "application/octet-stream"
        return f"data:{mime_type};base64,{self.to_base64()}"
    
    def save(self, path: Union[str, Path]) -> str:
        """
        Save the image to a file.
        
        Args:
            path: The path to save the image to.
            
        Returns:
            The path to the saved image.
        """
        path_obj = Path(path)
        
        # Create directory if it doesn't exist
        path_obj.parent.mkdir(parents=True, exist_ok=True)
        
        # Save image
        with open(path_obj, "wb") as f:
            f.write(self.to_bytes())
        
        # Update path
        self.path = str(path_obj)
        
        return self.path
    
    def get_pil_image(self):
        """
        Get the image as a PIL Image.
        
        Returns:
            The image as a PIL Image.
        """
        try:
            from PIL import Image as PILImage
            
            return PILImage.open(io.BytesIO(self.to_bytes()))
        except ImportError:
            logger.error("PIL not installed. Install with 'pip install pillow'")
            raise ImportError("PIL not installed. Install with 'pip install pillow'")
    
    def resize(self, width: int, height: int) -> "Image":
        """
        Resize the image.
        
        Args:
            width: The new width.
            height: The new height.
            
        Returns:
            The resized image.
        """
        pil_image = self.get_pil_image()
        resized_image = pil_image.resize((width, height))
        
        # Convert back to bytes
        buffer = io.BytesIO()
        resized_image.save(buffer, format=pil_image.format or "PNG")
        
        return Image.from_bytes(
            buffer.getvalue(),
            mime_type=self.mime_type,
            **self.metadata,
        )
    
    def crop(self, x: int, y: int, width: int, height: int) -> "Image":
        """
        Crop the image.
        
        Args:
            x: The x coordinate of the top-left corner.
            y: The y coordinate of the top-left corner.
            width: The width of the crop.
            height: The height of the crop.
            
        Returns:
            The cropped image.
        """
        pil_image = self.get_pil_image()
        cropped_image = pil_image.crop((x, y, x + width, y + height))
        
        # Convert back to bytes
        buffer = io.BytesIO()
        cropped_image.save(buffer, format=pil_image.format or "PNG")
        
        return Image.from_bytes(
            buffer.getvalue(),
            mime_type=self.mime_type,
            **self.metadata,
        )
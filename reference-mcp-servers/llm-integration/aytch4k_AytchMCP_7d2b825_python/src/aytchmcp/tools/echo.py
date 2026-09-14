"""
Echo Tool for AytchMCP.

This tool simply echoes back the input, useful for testing.
"""

from typing import Dict, Any, Optional
from datetime import datetime

from pydantic import BaseModel, Field


class EchoInput(BaseModel):
    """Echo tool input model."""
    
    message: str = Field(
        description="The message to echo back"
    )
    prefix: Optional[str] = Field(
        default=None,
        description="Optional prefix to add to the echoed message"
    )
    uppercase: bool = Field(
        default=False,
        description="Whether to convert the message to uppercase"
    )


class EchoOutput(BaseModel):
    """Echo tool output model."""
    
    message: str = Field(
        description="The echoed message"
    )
    timestamp: str = Field(
        description="The timestamp when the message was echoed"
    )


async def echo_tool(input_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Echo tool that echoes back the input message.
    
    Args:
        input_data: The input data.
        
    Returns:
        The echoed message.
    """
    # Parse input
    parsed_input = EchoInput(**input_data)
    
    # Get the message
    message = parsed_input.message
    
    # Apply uppercase if requested
    if parsed_input.uppercase:
        message = message.upper()
    
    # Add prefix if provided
    if parsed_input.prefix:
        message = f"{parsed_input.prefix}: {message}"
    
    # Get timestamp
    timestamp = datetime.now().isoformat()
    
    # Create output
    output = EchoOutput(
        message=message,
        timestamp=timestamp,
    )
    
    return output.dict()
"""
System Information Resource for AytchMCP.

This resource provides system information to LLMs.
"""

import os
import platform
import socket
import sys
from datetime import datetime
from typing import Dict, Any

from fastmcp.resources import Resource
from pydantic import BaseModel, Field

from aytchmcp.context import Context


class SystemInfo(BaseModel):
    """System information model."""
    
    hostname: str = Field(description="The hostname of the system")
    platform: str = Field(description="The platform/OS name")
    platform_version: str = Field(description="The platform/OS version")
    python_version: str = Field(description="The Python version")
    cpu_count: int = Field(description="The number of CPU cores")
    memory_info: Dict[str, Any] = Field(description="Memory information")
    current_time: str = Field(description="The current time")
    uptime: str = Field(description="The system uptime")
    environment_variables: Dict[str, str] = Field(
        description="Selected environment variables"
    )


class SystemInfoResource(Resource):
    """Resource that provides system information."""
    
    name: str = "system_info"
    description: str = "Provides information about the system running the MCP server"
    response_model: type[SystemInfo] = SystemInfo
    uri: str = "system://info"
    
    async def read(self, context: Context) -> SystemInfo:
        """
        Fetch system information.
        
        Args:
            context: The context object.
            
        Returns:
            System information.
        """
        # Get basic system information
        hostname = socket.gethostname()
        platform_name = platform.system()
        platform_version = platform.version()
        python_version = sys.version
        
        # Get CPU count
        try:
            import multiprocessing
            cpu_count = multiprocessing.cpu_count()
        except (ImportError, NotImplementedError):
            cpu_count = 0
        
        # Get memory information
        memory_info = self._get_memory_info()
        
        # Get current time
        current_time = datetime.now().isoformat()
        
        # Get uptime
        uptime = self._get_uptime()
        
        # Get selected environment variables
        env_vars = {
            "PATH": os.environ.get("PATH", ""),
            "PYTHONPATH": os.environ.get("PYTHONPATH", ""),
            "LANG": os.environ.get("LANG", ""),
            "USER": os.environ.get("USER", ""),
            "HOME": os.environ.get("HOME", ""),
        }
        
        return SystemInfo(
            hostname=hostname,
            platform=platform_name,
            platform_version=platform_version,
            python_version=python_version,
            cpu_count=cpu_count,
            memory_info=memory_info,
            current_time=current_time,
            uptime=uptime,
            environment_variables=env_vars,
        )
    
    def _get_memory_info(self) -> Dict[str, Any]:
        """
        Get memory information.
        
        Returns:
            Memory information.
        """
        memory_info = {}
        
        try:
            import psutil
            
            # Get virtual memory
            virtual_memory = psutil.virtual_memory()
            memory_info["total"] = virtual_memory.total
            memory_info["available"] = virtual_memory.available
            memory_info["used"] = virtual_memory.used
            memory_info["percent"] = virtual_memory.percent
            
            # Get swap memory
            swap_memory = psutil.swap_memory()
            memory_info["swap_total"] = swap_memory.total
            memory_info["swap_used"] = swap_memory.used
            memory_info["swap_free"] = swap_memory.free
            memory_info["swap_percent"] = swap_memory.percent
        except ImportError:
            memory_info["error"] = "psutil not available"
        
        return memory_info
    
    def _get_uptime(self) -> str:
        """
        Get system uptime.
        
        Returns:
            System uptime as a string.
        """
        try:
            import psutil
            
            # Get boot time
            boot_time = datetime.fromtimestamp(psutil.boot_time())
            uptime = datetime.now() - boot_time
            
            # Format uptime
            days = uptime.days
            hours, remainder = divmod(uptime.seconds, 3600)
            minutes, seconds = divmod(remainder, 60)
            
            return f"{days} days, {hours} hours, {minutes} minutes, {seconds} seconds"
        except ImportError:
            return "Unknown (psutil not available)"
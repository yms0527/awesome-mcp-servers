import asyncio
from typing import List, Dict, Any, Optional, Callable, Union, Type, ClassVar, Sequence
from pydantic import BaseModel, Field, model_validator
import json

# MCP imports
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client
from mcp.types import Tool, ListToolsResult, CallToolResult, TextContent

# LangChain imports
from langchain.tools import BaseTool
from langchain.callbacks.manager import CallbackManagerForToolRun, AsyncCallbackManagerForToolRun

class MCPAdapter:
    """
    Adapter for connecting to an MCP server and converting its tools to LangChain tools.
    """
    
    def __init__(self, server_script_path: str, env: Dict[str, str] = None):
        """
        Initialize the MCP adapter.
        
        Args:
            server_script_path: Path to the MCP server script to run
            env: Optional environment variables for the server process
        """
        self.server_script_path = server_script_path
        self.env = env
        self.mcp_tools: List[Dict[str, Any]] = []
        self.langchain_tools: List[BaseTool] = []
        self.initialized: bool = False
    
    async def _initialize_async(self) -> None:
        """Initialize the connection to the MCP server asynchronously."""
        if self.initialized:
            return
            
        # Set up parameters for connecting to the MCP server
        server_params = StdioServerParameters(
            command="python",
            args=[self.server_script_path],
            env=self.env
        )
        
        # Use both stdio_client and ClientSession as context managers
        async with stdio_client(server_params) as (read, write):
            async with ClientSession(read, write) as session:
                await session.initialize()
                
                # Get the list of tools from the server
                tools_response: ListToolsResult = await session.list_tools()
                
                # Store the MCP tools
                self.mcp_tools = [
                    {
                        "name": tool.name,
                        "description": tool.description or f"MCP tool: {tool.name}",
                        "input_schema": tool.inputSchema if hasattr(tool, 'inputSchema') else None
                    }
                    for tool in tools_response.tools
                ]
        
        # After exiting the context managers, convert to LangChain tools
        # We don't need the session after getting the tool definitions
        self.langchain_tools = self._convert_to_langchain_tools()
        self.initialized = True
    
    def initialize(self) -> None:
        """Initialize the connection to the MCP server synchronously."""
        asyncio.run(self._initialize_async())
    
    def _convert_to_langchain_tools(self) -> List[BaseTool]:
        """Convert MCP tools to LangChain tools."""
        langchain_tools: List[BaseTool] = []
        
        for tool_def in self.mcp_tools:
            # Get the input schema
            input_schema = tool_def.get("input_schema")
            
            # Create a schema model if needed
            args_schema = None
            if input_schema and isinstance(input_schema, dict):
                schema_properties = input_schema.get("properties", {})
                schema_required = input_schema.get("required", [])
                
                # Create a dynamic schema class
                tool_name = tool_def["name"]
                schema_class_name = f"{tool_name.title().replace('_', '')}Schema"
                
                # Create field definitions
                field_definitions = {}
                annotations = {}
                
                for param_name, param_info in schema_properties.items():
                    param_type = param_info.get("type", "string")
                    param_desc = param_info.get("description", "")
                    is_required = param_name in schema_required
                    
                    # Map JSON schema types to Python types
                    type_mapping = {
                        "string": str,
                        "integer": int,
                        "number": float,
                        "boolean": bool,
                        "array": list,
                        "object": dict
                    }
                    
                    python_type = type_mapping.get(param_type, Any)
                    
                    # Define the field with proper typing
                    annotations[param_name] = Optional[python_type] if not is_required else python_type
                    field_definitions[param_name] = Field(
                        default=None if not is_required else ...,
                        description=param_desc
                    )
                
                # Create a model class dictionary
                model_dict = {
                    "__annotations__": annotations,
                    "model_config": {"extra": "forbid"},
                }
                
                # Add field definitions
                model_dict.update(field_definitions)
                
                # Create the schema model dynamically
                args_schema = type(
                    schema_class_name,
                    (BaseModel,),
                    model_dict
                )
            
            # Create the tool wrapper
            mcp_tool = MCPToolWrapper(
                name=tool_def["name"],
                description=tool_def["description"],
                server_script_path=self.server_script_path,
                env=self.env,
                args_schema=args_schema
            )
            langchain_tools.append(mcp_tool)
            
        return langchain_tools
    
    def get_tools(self) -> List[BaseTool]:
        """
        Get LangChain tools from the MCP server.
        
        Returns:
            List of LangChain tools
        """
        if not self.initialized:
            self.initialize()
        
        return self.langchain_tools
    
    def get_tool_names(self) -> List[str]:
        """
        Get the names of all available tools.
        
        Returns:
            List of tool names
        """
        if not self.initialized:
            self.initialize()
            
        return [tool["name"] for tool in self.mcp_tools]
    
    def get_tool_by_name(self, name: str) -> Optional[BaseTool]:
        """
        Get a specific LangChain tool by name.
        
        Args:
            name: Name of the tool
            
        Returns:
            LangChain tool if found, None otherwise
        """
        if not self.initialized:
            self.initialize()
            
        for tool in self.langchain_tools:
            if tool.name == name:
                return tool
                
        return None
    
    async def close(self) -> None:
        """Clean up resources."""
        # We no longer keep a session open after initialization,
        # so there's nothing to clean up
        self.initialized = False
    
    def __del__(self) -> None:
        """Ensure resources are cleaned up when the adapter is deleted."""
        # No need to run async cleanup since we don't keep session open
        self.initialized = False


class MCPToolWrapper(BaseTool):
    """Wrapper for MCP tools that makes them usable within LangChain."""
    
    # Tool properties
    name: str
    description: str
    server_script_path: str = Field(description="Path to the MCP server script")
    env: Optional[Dict[str, str]] = Field(default=None, description="Environment variables for the server process")
    args_schema: Optional[Type[BaseModel]] = None
    return_direct: bool = False
    
    @classmethod
    @model_validator(mode='before')
    def validate_tool(cls, data: Dict[str, Any]) -> Dict[str, Any]:
        """Validate tool configuration."""
        # Check required properties
        if "name" not in data:
            raise ValueError("Tool must have a name")
        if "description" not in data:
            raise ValueError("Tool must have a description")
        if "server_script_path" not in data:
            raise ValueError("Tool must have a server_script_path")
        return data
    
    def _run(self, *args: Any, **kwargs: Any) -> str:
        """Run the tool synchronously.
        
        Args:
            *args: The positional arguments to the tool.
            **kwargs: The keyword arguments to the tool.
            
        Returns:
            The tool's output.
        """
        # Extract tool_input and run_manager from kwargs
        run_manager = kwargs.pop("run_manager", None)
        
        # Get the tool input from args or kwargs
        if len(args) == 1:
            tool_input = args[0]
        else:
            tool_input = kwargs
        
        return asyncio.run(self._arun(tool_input, run_manager=run_manager, **kwargs))
    
    async def _arun(self, *args: Any, **kwargs: Any) -> str:
        """Run the tool asynchronously.
        
        Args:
            *args: The positional arguments to the tool.
            **kwargs: The keyword arguments to the tool.
            
        Returns:
            The tool's output.
        """
        # Extract tool_input and run_manager from kwargs  
        run_manager = kwargs.pop("run_manager", None)
        
        # Get the tool input from args or kwargs
        if len(args) == 1:
            tool_input = args[0]
        else:
            tool_input = kwargs
            
        try:
            # Handle different input types
            if isinstance(tool_input, str):
                # Try to parse JSON if it's a string
                try:
                    parsed_input = json.loads(tool_input)
                    if isinstance(parsed_input, dict):
                        tool_input = parsed_input
                except json.JSONDecodeError:
                    # Keep it as a string if not valid JSON
                    pass
            
            # Set up parameters for connecting to the MCP server
            server_params = StdioServerParameters(
                command="python",
                args=[self.server_script_path],
                env=self.env
            )
            
            # Use context managers to handle connections properly
            async with stdio_client(server_params) as (read, write):
                async with ClientSession(read, write) as session:
                    # Initialize the connection
                    await session.initialize()
                    
                    # Call the MCP tool
                    result: CallToolResult = await session.call_tool(self.name, tool_input)
                    
                    # Extract text content from the response
                    if hasattr(result, 'content') and result.content:
                        # Process the content list and extract text
                        texts: List[str] = []
                        for item in result.content:
                            if hasattr(item, 'text'):
                                texts.append(item.text)
                        return "\n".join(texts)
            
            return "No content returned from tool"
        except Exception as e:
            # Handle errors properly
            if run_manager:
                await run_manager.on_tool_error(e)
            return f"Error calling MCP tool '{self.name}': {str(e)}"


# Convenience functions

def get_langchain_tools(server_script_path: str, env: Dict[str, str] = None) -> List[BaseTool]:
    """
    Get LangChain tools from an MCP server.
    
    Args:
        server_script_path: Path to the MCP server script
        env: Optional environment variables for the server process
        
    Returns:
        List of LangChain tools
    """
    _mcp_adapter = MCPAdapter(server_script_path, env)
    return _mcp_adapter.get_tools()


# Example usage
if __name__ == "__main__":
    # Example: create an adapter and get LangChain tools
    mcp_adapter = MCPAdapter("simple_server.py")
    tool_list = mcp_adapter.get_tools()
    
    print(f"Found {len(tool_list)} tools:")
    for tool_item in tool_list:
        print(f"- {tool_item.name}: {tool_item.description}")
        if hasattr(tool_item, 'args_schema') and tool_item.args_schema:
            print("  Parameters:")
            schema_fields = tool_item.args_schema.__annotations__
            for field_name, field_type in schema_fields.items():
                # Check if field is optional
                is_optional = str(field_type).startswith("typing.Optional") or str(field_type).startswith("typing.Union")
                required = "Optional" if is_optional else "Required"
                # Get field description if available
                field_desc = ""
                if hasattr(tool_item.args_schema, "model_fields") and field_name in tool_item.args_schema.model_fields:
                    field_desc = tool_item.args_schema.model_fields[field_name].description
                print(f"  - {field_name}: {field_type} ({required})")
                if field_desc:
                    print(f"    Description: {field_desc}")
    
    # Example: use a tool
    add_tool = mcp_adapter.get_tool_by_name("add")
    if add_tool:
        # For BaseTool.run(), we need to provide a single tool_input parameter
        add_input = {"a": 5, "b": 7}
        add_result = add_tool.run(add_input)
        print(f"\nResult of add(5, 7): {add_result}")
    
    weather_tool = mcp_adapter.get_tool_by_name("get_weather")
    if weather_tool:
        weather_input = {"city": "London"}
        weather_result = weather_tool.run(weather_input)
        print(f"\nResult of get_weather('London'): {weather_result}") 
#!/usr/bin/env python3
"""
This is the agentic MCP client.
"""
# Standard Library Imports
import json
import os
from dotenv import load_dotenv
import asyncio
import logging

# Third Party Imports
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

# Local Imports
from prompt import create_system_prompt, create_query_prompt
from ai import generate_with_timeout, parse_llm_response

# Setup logging with more detailed format
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Get the project root directory (current directory)
PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))

# Server configurations
SERVER_CONFIGS = {
    'math': {
        'command': 'python',
        'args': ['mcp_servers/math_server.py'],  # Path needs to be relative to project root
        'cwd': PROJECT_ROOT  # Set working directory to project root
    },
    'slides': {
        'command': 'python',
        'args': ['mcp_servers/slides_server.py'],  # Updated to use our integrated image server
        'cwd': PROJECT_ROOT  # Set working directory to project root
    },
    'gmail': {
        'command': 'python',
        'args': ['mcp_servers/gmail_server.py'],  # Simplified as credentials are handled in the server
        'cwd': PROJECT_ROOT
    }
}

async def create_server_session(server_name: str) -> tuple:
    """Create a session with a server"""
    try:
        print(f"{'='*10} Starting Server: {server_name} {'='*10}")
        server_config = SERVER_CONFIGS[server_name]
        
        # Set up environment variables for Gmail server
        if server_name == 'gmail':
            os.environ['PYTHONUNBUFFERED'] = '1'
            os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'
            print("\nStarting Gmail authorization process. Please wait for the authorization URL...")
            
            # Additional environment variables for Gmail
            os.environ['PYTHONIOENCODING'] = 'utf-8'
            os.environ['PYTHONLEGACYWINDOWSSTDIO'] = 'utf-8'
        
        server_params = StdioServerParameters(
            command=server_config['command'],
            args=server_config['args'],
            cwd=server_config.get('cwd'),
            env={
                'PYTHONUNBUFFERED': '1',
                'PYTHONIOENCODING': 'utf-8',
                'OAUTHLIB_INSECURE_TRANSPORT': '1'
            }
        )
        context_manager = stdio_client(server_params)
        return context_manager, None
    except Exception as e:
        logger.error(f"Error creating server session: {e}")
        raise

async def get_server_tools(session: ClientSession) -> dict:
    """Get available tools from a server"""
    try:
        tools_result = await session.list_tools()
        tools_dict = {}
        for tool in tools_result.tools:
            tools_dict[tool.name] = tool
        return tools_dict
    except Exception as e:
        logger.error(f"Error getting server tools: {e}")
        raise

async def process_query(query: str) -> str:
    """Process a user query"""
    # Dictionary to track context managers and sessions
    server_contexts = {}
    server_sessions = {}
    all_tools = {}
    
    try:
        # Initialize connections to all servers
        logger.info("Establishing connections to MCP servers...")
        
        # First create context managers without entering them
        for server_name in ['math', 'slides', 'gmail']:
            try:
                context_manager, _ = await create_server_session(server_name)
                server_contexts[server_name] = context_manager
            except Exception as e:
                logger.error(f"Error creating context for {server_name} server: {e}")
        
        if not server_contexts:
            return "Failed to connect to any servers. Please check server configurations."
        
        # Setup tasks to keep connections open
        tasks = []
        for server_name, context in server_contexts.items():
            task = asyncio.create_task(
                process_with_server(server_name, context, server_sessions, all_tools)
            )
            tasks.append(task)
        
        # Wait longer for connections to initialize (especially Gmail which needs authentication)
        print("Waiting for all servers to initialize (this may take a moment for Gmail authorization)...")
        for i in range(10):  # Wait up to 10 seconds with status updates
            await asyncio.sleep(1)
            if 'gmail' in server_sessions:
                print("Gmail server connected successfully!")
                break
            print(f"Still waiting for servers... ({i+1}/10)")
        
        # Additional check for Gmail specifically
        if 'gmail' not in server_sessions:
            print("WARNING: Gmail server did not connect in time. Email functionality may not be available.")
            print("If you need to send emails, please check Gmail authorization and try again.")
        
        # Create tools description for the prompt
        tools_description = []
        for name, tool in all_tools.items():
            params = tool.inputSchema
            desc = getattr(tool, 'description', 'No description available')
            
            if 'properties' in params:
                param_details = []
                for param_name, param_info in params['properties'].items():
                    param_type = param_info.get('type', 'unknown')
                    param_details.append(f"{param_name}: {param_type}")
                params_str = ', '.join(param_details)
            else:
                params_str = 'no parameters'
            
            tools_description.append(f"{name}({params_str}) - {desc}")
        
        tools_description = "\n".join(tools_description)
        print(f"Tools description: {tools_description}")
        
        # Initialize iteration tracking
        iteration = 0
        max_iterations = 7
        iteration_responses = []
        last_response = None
        
        while iteration < max_iterations:
            iteration += 1
            print(f"\n--- Iteration {iteration}/{max_iterations} ---")
            
            # Create prompts
            system_prompt = create_system_prompt(tools_description)
            query_prompt = create_query_prompt(query, iteration_responses)
            
            # Generate response from LLM
            try:
                print("Preparing to generate LLM response...")
                response = await generate_with_timeout(system_prompt + "\n" + query_prompt)
                print(f"LLM Response: {response}")
            except Exception as e:
                logger.error(f"LLM generation failed: {e}")
                return f"Error: LLM generation failed - {str(e)}"
            
            # Parse the response
            parsed_response = parse_llm_response(response)
            
            if not parsed_response:
                logger.error("Failed to parse LLM response")
                continue
                
            if parsed_response["type"] == "function_call":
                function_name = parsed_response["name"]
                parameters = parsed_response["parameters"]
                
                print(f"\nDEBUG: Function name: {function_name}")
                print(f"DEBUG: Raw parameters: {parameters}")
                
                if function_name not in all_tools:
                    logger.error(f"Unknown tool: {function_name}")
                    continue
                
                # Find which server has this tool
                server_name = None
                for server, info in server_sessions.items():
                    if function_name in info['tools']:
                        server_name = server
                        break
                
                if not server_name:
                    logger.error(f"Could not find server for tool: {function_name}")
                    continue
                    
                # Get the tool and its schema
                tool = all_tools[function_name]
                schema_properties = tool.inputSchema.get('properties', {})
                
                # Convert parameters according to schema
                arguments = {}
                try:
                    # Handle parameters as a dictionary instead of positional args
                    if isinstance(parameters, dict):
                        # If parameters are already a dictionary, use them directly
                        arguments = parameters
                    else:
                        # If parameters are a list, convert to dictionary based on schema
                        param_index = 0
                        for param_name, param_info in schema_properties.items():
                            if param_index >= len(parameters):
                                logger.error(f"Not enough parameters for {function_name}")
                                break

                            value = parameters[param_index]
                            param_index += 1
                            param_type = param_info.get('type', 'string')
                            
                            if param_type == 'integer':
                                arguments[param_name] = int(value)
                            elif param_type == 'number':
                                arguments[param_name] = float(value)
                            elif param_type == 'array':
                                if isinstance(value, str):
                                    value = value.strip('[]').split(',')
                                arguments[param_name] = [int(x.strip()) if x.strip().isdigit() else x.strip() for x in value]
                            else:
                                arguments[param_name] = str(value)
                except (ValueError, IndexError) as e:
                    logger.error(f"Error converting parameters: {e}")
                    iteration_responses.append(f"Error in iteration {iteration}: {str(e)}")
                    continue
                
                try:
                    # Call the function on the appropriate server
                    session = server_sessions[server_name]['session']
                    print(f"DEBUG: Calling tool {function_name} with arguments: {arguments}")
                    result = await session.call_tool(function_name, arguments=arguments)
                    print(f"DEBUG: Raw result: {result}")
                    
                    # Process the result
                    if hasattr(result, 'content'):
                        print("DEBUG: Result has content attribute")
                        if isinstance(result.content, list):
                            iteration_result = [
                                item.text if hasattr(item, 'text') else str(item)
                                for item in result.content
                            ]
                        else:
                            iteration_result = str(result.content)
                    else:
                        print("DEBUG: Result has no content attribute")
                        iteration_result = str(result)
                    
                    print(f"DEBUG: Final iteration result: {iteration_result}")
                    
                    # Format the response based on result type
                    if isinstance(iteration_result, list):
                        result_str = f"[{', '.join(iteration_result)}]"
                    else:
                        result_str = str(iteration_result)
                    
                    iteration_responses.append(
                        f"In iteration {iteration} you called {function_name} with {arguments} parameters, "
                        f"and the function returned {result_str}."
                    )
                    last_response = iteration_result
                    
                except Exception as e:
                    import traceback
                    error_traceback = traceback.format_exc()
                    logger.error(f"Error calling tool {function_name}: {e}")
                    logger.error(f"Detailed traceback: {error_traceback}")
                    iteration_responses.append(f"Error in iteration {iteration}: {str(e)}")
                    continue  # Continue to next iteration instead of breaking out of the loop
                    
            elif parsed_response["type"] == "final_answer":
                print("\n=== Agent Execution Complete ===")
                # Cancel all server tasks before returning
                for task in tasks:
                    task.cancel()
                return parsed_response["value"]
        
        # Cancel all server tasks before returning
        for task in tasks:
            task.cancel()
        
        return "Maximum iterations reached without finding a final answer."
    
    except Exception as e:
        logger.error(f"Error in main execution: {e}")
        return f"Error: {str(e)}"
    
    finally:
        # Clean up any remaining contexts
        for context in server_contexts.values():
            try:
                if hasattr(context, '_exit_stack') and context._exit_stack:
                    await context.__aexit__(None, None, None)
            except Exception as e:
                logger.error(f"Error closing context: {e}")

async def process_with_server(server_name, context, server_sessions, all_tools):
    """Process a server connection and keep it open"""
    async with context as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()
            logger.info(f"Connected to {server_name} server")
            
            # Get available tools
            tools = await get_server_tools(session)
            logger.info(f"Retrieved {len(tools)} tools from {server_name} server")
            
            # Store session and tools
            server_sessions[server_name] = {
                'session': session,
                'tools': tools
            }
            all_tools.update(tools)
            
            # Keep this task alive until the query processing completes
            while True:
                await asyncio.sleep(0.1)

async def main():
    """Main function to handle user queries"""
    print("Welcome to the MCP-Powered Multi-Service AI Assistant! Type 'exit' to quit.")
    
    while True:
        try:
            query = input("\nEnter your query: ").strip()
            if query.lower() == 'exit':
                print("Goodbye!")
                break
            if not query:
                print("Please enter a valid query.")
                continue
                
            result = await process_query(query)
            print("\nFinal Result:", result)
            
        except KeyboardInterrupt:
            print("\nGoodbye!")
            break
        except Exception as e:
            logger.error(f"Error: {str(e)}")
            print(f"\nError: {str(e)}")
            print("Please try again or type 'exit' to quit.")

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\nGoodbye!")
    except Exception as e:
        logger.error(f"Fatal error: {e}")
        print(f"Fatal error: {e}")
    
    

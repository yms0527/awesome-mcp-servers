# Create server parameters for multiple MCP servers
from langchain_mcp_adapters.client import MultiServerMCPClient
from langgraph.prebuilt import create_react_agent

from langchain_openai import ChatOpenAI
import asyncio
import os
import time
from dotenv import load_dotenv
import subprocess
import signal

# Load environment variables from .env file if it exists
load_dotenv()

async def start_weather_server(weather_server_path):
    """Start the weather server as a separate process and return the process object."""
    print("Starting weather server...")
    # Start the weather server as a separate process
    process = subprocess.Popen(
        ["python3", weather_server_path],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )
    
    # Give the server some time to start up
    print("Waiting for weather server to start...")
    time.sleep(3)
    
    # Check if the process is still running
    if process.poll() is not None:
        stdout, stderr = process.communicate()
        print(f"Weather server failed to start: {stderr}")
        return None
    
    print("Weather server started successfully.")
    return process

def stop_weather_server(process):
    """Stop the weather server process."""
    if process and process.poll() is None:
        print("Stopping weather server...")
        process.terminate()
        try:
            process.wait(timeout=5)
        except subprocess.TimeoutExpired:
            process.kill()
        print("Weather server stopped.")

async def main():
    # Get OpenAI API key from environment variable
    openai_api_key = os.getenv("OPENAI_API_KEY")
    if not openai_api_key:
        print("Error: OPENAI_API_KEY environment variable is not set.")
        print("Please set your OpenAI API key using: export OPENAI_API_KEY='your-api-key'")
        print("Or create a .env file with OPENAI_API_KEY=your-api-key")
        return

    model = ChatOpenAI(model="gpt-4o", api_key=openai_api_key)

    # Get the absolute path to math_server.py and weather_server.py in the same directory as this file
    current_dir = os.path.dirname(os.path.abspath(__file__))
    math_server_path = os.path.join(current_dir, "math_server.py")
    weather_server_path = os.path.join(current_dir, "weather_server.py")

    # Start the weather server
    weather_process = await start_weather_server(weather_server_path)
    if not weather_process:
        print("Failed to start weather server. Exiting.")
        return
    
    try:
        async with MultiServerMCPClient(
            {
                "math": {
                    "command": "python3",
                    "args": [math_server_path],
                    "transport": "stdio",
                },
                "weather": {
                    # Weather server runs on port 8000 by default
                    "url": "http://localhost:8000/sse",
                    "transport": "sse",
                }
            }
        ) as client:
            # Get tools from all servers
            tools = client.get_tools()
            
            # Create the agent
            agent = create_react_agent(model, tools)
            
            # Test math functionality
            print("\nTesting math functionality...")
            math_response = await agent.ainvoke({"messages": [{"role": "user", "content": "what's (3 + 5) x 12?"}]})
            print(f"Math response: {math_response}")
            
            # Test weather functionality
            print("\nTesting weather functionality...")
            weather_response = await agent.ainvoke({"messages": [{"role": "user", "content": "what is the weather in nyc?"}]})
            print(f"Weather response: {weather_response}")
            
    finally:
        # Clean up: terminate the weather server process
        stop_weather_server(weather_process)

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\nProgram interrupted by user. Cleaning up...")
    except Exception as e:
        print(f"An error occurred: {e}")
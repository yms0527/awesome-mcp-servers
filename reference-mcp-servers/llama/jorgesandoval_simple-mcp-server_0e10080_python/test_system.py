#!/usr/bin/env python3
import requests
import subprocess
import time
import json
import sys
import os
from colorama import Fore, Style, init

# Initialize colorama
init()

# Constants
MCP_SERVER_URL = "http://localhost:3000"
TEST_SESSION_ID = "test_session_" + str(int(time.time()))

def print_header(title):
    """Print a formatted header."""
    print(f"\n{Fore.CYAN}{'=' * 50}{Style.RESET_ALL}")
    print(f"{Fore.CYAN}  {title}{Style.RESET_ALL}")
    print(f"{Fore.CYAN}{'=' * 50}{Style.RESET_ALL}")

def print_success(message):
    """Print a success message."""
    print(f"{Fore.GREEN}✓ {message}{Style.RESET_ALL}")

def print_error(message):
    """Print an error message."""
    print(f"{Fore.RED}✗ {message}{Style.RESET_ALL}")

def print_info(message):
    """Print an info message."""
    print(f"{Fore.YELLOW}➤ {message}{Style.RESET_ALL}")

def check_containers():
    """Check if Docker containers are running."""
    print_header("Checking Docker Containers")
    
    try:
        # Get running containers
        result = subprocess.run(
            ["docker", "ps", "--format", "{{.Names}}"],
            capture_output=True,
            text=True,
            check=True
        )
        
        containers = result.stdout.strip().split("\n")
        
        # Check if our container is in the list
        mcp_server_running = any("mcp-server" in container for container in containers)
        
        if mcp_server_running:
            print_success("MCP Server container is running")
        else:
            print_error("MCP Server container is not running")
            return False
        
        return mcp_server_running
    
    except subprocess.CalledProcessError as e:
        print_error(f"Failed to check containers: {e}")
        return False

def test_mcp_server():
    """Test MCP Server endpoints."""
    print_header("Testing MCP Server")
    success = True
    
    # Test JSON-RPC endpoint
    try:
        print_info("Testing MCP Server via HTTP SSE...")
        response = requests.post(
            MCP_SERVER_URL,
            json={
                "jsonrpc": "2.0",
                "id": 1,
                "method": "initialize",
                "params": {
                    "protocol_version": "2024-03-26",
                    "client_info": {
                        "name": "test-client",
                        "version": "1.0.0"
                    },
                    "capabilities": {}
                }
            }
        )
        
        if response.status_code == 200:
            print_success("MCP Server is accessible")
            print_info("Server response:")
            print(json.dumps(response.json(), indent=2))
        else:
            print_error(f"MCP Server failed: {response.status_code} {response.text}")
            success = False
    
    except requests.RequestException as e:
        print_error(f"Request to MCP Server failed: {e}")
        return False
    
    # Test tools/list endpoint
    try:
        print_info("Testing tools/list endpoint...")
        response = requests.post(
            MCP_SERVER_URL,
            json={
                "jsonrpc": "2.0",
                "id": 2,
                "method": "tools/list"
            }
        )
        
        if response.status_code == 200:
            tools_data = response.json()
            if "result" in tools_data and "tools" in tools_data["result"]:
                print_success(f"Retrieved {len(tools_data['result']['tools'])} tools")
                print_info("Available tools:")
                for tool in tools_data["result"]["tools"]:
                    print(f"  - {tool['name']}: {tool.get('description', 'No description')}")
            else:
                print_error("No tools found in response")
                success = False
        else:
            print_error(f"Tools list failed: {response.status_code} {response.text}")
            success = False
    
    except requests.RequestException as e:
        print_error(f"Request to list tools failed: {e}")
        success = False
    
    return success

def run_all_tests():
    """Run all tests sequentially."""
    print_header("Anthropic MCP System Test")
    
    # Step 1: Check containers
    containers_ok = check_containers()
    if not containers_ok:
        print_error("Container check failed. Please ensure the MCP server container is running.")
        sys.exit(1)
    
    # Step 2: Test MCP Server
    mcp_ok = test_mcp_server()
    if not mcp_ok:
        print_error("MCP Server tests failed.")
        sys.exit(1)
    
    # All tests passed
    print_header("Test Results")
    print_success("All tests passed! The Anthropic MCP Server is functioning correctly.")

if __name__ == "__main__":
    run_all_tests() 
#!/bin/bash

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Constants
MCP_SERVER_URL="http://localhost:3000"
TEST_SESSION_ID="test_session_$(date +%s)"

# Print header
print_header() {
  echo -e "\n${CYAN}=================================================${NC}"
  echo -e "${CYAN}  $1${NC}"
  echo -e "${CYAN}=================================================${NC}"
}

# Print success message
print_success() {
  echo -e "${GREEN}✓ $1${NC}"
}

# Print error message
print_error() {
  echo -e "${RED}✗ $1${NC}"
}

# Print info message
print_info() {
  echo -e "${YELLOW}➤ $1${NC}"
}

# Check if a command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Check required tools
check_requirements() {
  print_header "Checking Requirements"
  
  if ! command_exists curl; then
    print_error "curl is not installed. Please install it to run the tests."
    exit 1
  else
    print_success "curl is installed"
  fi
  
  if ! command_exists docker; then
    print_error "docker is not installed. Please install it to run the tests."
    exit 1
  else
    print_success "docker is installed"
  fi
  
  if ! command_exists jq; then
    print_info "jq is not installed. Some test output will not be formatted nicely."
  else
    print_success "jq is installed"
  fi
}

# Check if Docker containers are running
check_containers() {
  print_header "Checking Docker Containers"
  
  # Check MCP Server container
  if docker ps | grep -q "mcp-server"; then
    print_success "MCP Server container is running"
  else
    print_error "MCP Server container is not running"
    return 1
  fi
  
  return 0
}

# Test MCP Protocol Server
test_mcp_protocol() {
  print_header "Testing Anthropic MCP Protocol Server (Port 3000)"
  local success=true
  
  # Test MCP Server health endpoint
  print_info "Testing MCP Server health endpoint..."
  local response=$(curl -s -o /dev/null -w "%{http_code}" "${MCP_SERVER_URL}/health")
  
  if [ "$response" == "200" ]; then
    print_success "MCP Server is accessible"
  else
    print_error "MCP Server health check failed: $response"
    success=false
  fi
  
  # Test tools/list endpoint
  print_info "Testing tools/list endpoint..."
  local tools_response=$(curl -s -X POST \
    -H "Content-Type: application/json" \
    -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' \
    "${MCP_SERVER_URL}")
  
  local tools_status=$?
  
  if [ $tools_status -eq 0 ] && [ ! -z "$tools_response" ]; then
    print_success "Tools list retrieved successfully"
    
    if command_exists jq; then
      echo "$tools_response" | jq
    fi
  else
    print_error "Tools list failed"
    success=false
  fi
  
  return $([ "$success" == "true" ])
}

# Run all tests
run_all_tests() {
  print_header "Anthropic MCP Server Test"
  
  # Check requirements
  check_requirements
  
  # Check if containers are running
  check_containers
  if [ $? -ne 0 ]; then
    print_error "Container check failed. Please ensure the MCP server container is running."
    exit 1
  fi
  
  # Test MCP Protocol Server
  test_mcp_protocol
  if [ $? -ne 0 ]; then
    print_error "MCP Protocol Server tests failed."
    exit 1
  fi
  
  # All tests passed
  print_header "Test Results"
  print_success "All tests passed! The Anthropic MCP Server is functioning correctly."
}

# Run tests
run_all_tests 
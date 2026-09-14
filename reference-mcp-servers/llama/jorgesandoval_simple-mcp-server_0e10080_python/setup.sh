#!/bin/bash

# Print with colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}====== Anthropic MCP Server with Ollama Integration Setup ======${NC}"

# Step 1: Check if Docker is installed and running
echo -e "${YELLOW}Checking if Docker is installed...${NC}"
if ! [ -x "$(command -v docker)" ]; then
  echo -e "${RED}Error: Docker is not installed.${NC}" >&2
  echo -e "Please install Docker: https://docs.docker.com/get-docker/"
  exit 1
fi

echo -e "${YELLOW}Checking if Docker is running...${NC}"
if ! docker info > /dev/null 2>&1; then
  echo -e "${RED}Error: Docker is not running.${NC}" >&2
  echo -e "Please start Docker and try again."
  exit 1
fi

# Step 2: Check if Ollama is installed and running
echo -e "${YELLOW}Checking if Ollama is installed...${NC}"
if ! [ -x "$(command -v ollama)" ]; then
  echo -e "${YELLOW}Warning: Ollama is not installed.${NC}" >&2
  echo -e "Please install Ollama: https://github.com/ollama/ollama"
  echo -e "The middleware will try to connect to Ollama on port 11434 by default."
else
  echo -e "${GREEN}Ollama is installed.${NC}"
  
  # Check if Ollama is running
  echo -e "${YELLOW}Checking if Ollama is running...${NC}"
  if ! curl -s http://localhost:11434/api/tags > /dev/null; then
    echo -e "${YELLOW}Warning: Ollama is not running.${NC}" >&2
    echo -e "Please start Ollama with 'ollama serve' and then pull the Gemma model with 'ollama pull gemma3:4b'."
  else
    echo -e "${GREEN}Ollama is running.${NC}"
    
    # Check if Gemma model is available
    echo -e "${YELLOW}Checking if Gemma model is available...${NC}"
    if ! curl -s http://localhost:11434/api/tags | grep -q "gemma3:4b"; then
      echo -e "${YELLOW}Warning: Gemma model not found.${NC}" >&2
      echo -e "Would you like to pull the Gemma 4B model now? (y/n)"
      read -r response
      if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        echo -e "${YELLOW}Pulling Gemma 4B model...${NC}"
        ollama pull gemma3:4b
      else
        echo -e "${YELLOW}Skipping Gemma model download. You will need to pull it manually.${NC}"
      fi
    else
      echo -e "${GREEN}Gemma model is available.${NC}"
    fi
  fi
fi

# Step 3: Stop and remove all containers
echo -e "${YELLOW}Stopping and removing all Docker containers...${NC}"
docker stop $(docker ps -aq) 2>/dev/null || true
docker rm $(docker ps -aq) 2>/dev/null || true
echo -e "${GREEN}All containers removed.${NC}"

# Step 4: Create data directory for the database
echo -e "${YELLOW}Creating data directory...${NC}"
mkdir -p data

# Step 5: Ensure all required files are in the correct locations
echo -e "${YELLOW}Checking project structure...${NC}"
if [ ! -f "mcp-server/Dockerfile" ]; then
  echo -e "${RED}Error: mcp-server/Dockerfile not found.${NC}" >&2
  exit 1
fi

if [ ! -f "middleware/Dockerfile" ]; then
  echo -e "${RED}Error: middleware/Dockerfile not found.${NC}" >&2
  exit 1
fi

# Check for required Python files
if [ ! -f "mcp-server/anthropic_mcp_server.py" ]; then
  echo -e "${RED}Error: mcp-server/anthropic_mcp_server.py not found.${NC}" >&2
  exit 1
fi

if [ ! -f "middleware/main.py" ]; then
  echo -e "${RED}Error: middleware/main.py not found.${NC}" >&2
  exit 1
fi

if [ ! -f "middleware/anthropic_mcp_client.py" ]; then
  echo -e "${RED}Error: middleware/anthropic_mcp_client.py not found.${NC}" >&2
  exit 1
fi

# Step 6: Build and start the Docker containers
echo -e "${YELLOW}Building and starting Docker containers...${NC}"
docker-compose build --no-cache
docker-compose up -d

# Step 7: Check if containers are running
echo -e "${YELLOW}Checking if containers are running...${NC}"
sleep 5 # Wait for containers to start

if [ "$(docker ps -q -f name=mcp-server-container)" ] && [ "$(docker ps -q -f name=mcp-middleware-container)" ]; then
  echo -e "${GREEN}Setup completed successfully!${NC}"
  echo -e "${GREEN}MCP Server is running at: http://localhost:3000${NC}"
  echo -e "${GREEN}Middleware is running at: http://localhost:8080${NC}"
  echo -e "${GREEN}Try the API with:${NC}"
  echo -e "curl -X POST http://localhost:8080/infer -H \"Content-Type: application/json\" -d '{\"session_id\": \"user123\", \"content\": \"Hello, how are you today?\"}'"
else
  echo -e "${RED}Setup failed. Some containers are not running.${NC}"
  echo -e "${YELLOW}Check the logs with: docker-compose logs${NC}"
fi 
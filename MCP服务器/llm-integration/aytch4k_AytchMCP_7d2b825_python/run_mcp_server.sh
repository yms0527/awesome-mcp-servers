#!/bin/bash
# Script to run the AytchMCP server in WSL Ubuntu

# Set environment variables
export MCP_HOST=0.0.0.0
export MCP_PORT=8808
export LOG_LEVEL=INFO
export DEBUG=false

# Check if .env file exists and source it
if [ -f ./.env ]; then
    echo "Loading environment variables from .env file..."
    set -a
    source ./.env
    set +a
fi

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        echo "Docker is not running. Please start Docker and try again."
        exit 1
    fi
}

# Function to build the Docker images
build_images() {
    echo "Building Docker images..."
    docker-compose build
}

# Function to run the MCP server
run_server() {
    echo "Starting AytchMCP server..."
    docker-compose up -d
    
    # Wait for the server to start
    echo "Waiting for server to start..."
    sleep 5
    
    # Check if the server is running
    if docker-compose ps | grep -q "aytchmcp-server"; then
        echo "AytchMCP server is running."
        echo "Access the server at http://localhost:$MCP_PORT"
        echo "Access the API documentation at http://localhost:$MCP_PORT/docs"
    else
        echo "Failed to start AytchMCP server. Check the logs with 'docker-compose logs'."
    fi
}

# Function to stop the MCP server
stop_server() {
    echo "Stopping AytchMCP server..."
    docker-compose down
}

# Function to show the logs
show_logs() {
    echo "Showing logs for AytchMCP server..."
    docker-compose logs -f
}

# Function to initialize the configuration
init_config() {
    echo "Initializing configuration..."
    docker-compose run --rm mcp-server aytchmcp init
}

# Parse command line arguments
case "$1" in
    build)
        check_docker
        build_images
        ;;
    start)
        check_docker
        run_server
        ;;
    stop)
        check_docker
        stop_server
        ;;
    restart)
        check_docker
        stop_server
        run_server
        ;;
    logs)
        check_docker
        show_logs
        ;;
    init)
        check_docker
        init_config
        ;;
    *)
        echo "Usage: $0 {build|start|stop|restart|logs|init}"
        echo "  build   - Build the Docker images"
        echo "  start   - Start the MCP server"
        echo "  stop    - Stop the MCP server"
        echo "  restart - Restart the MCP server"
        echo "  logs    - Show the server logs"
        echo "  init    - Initialize the configuration"
        exit 1
        ;;
esac

exit 0
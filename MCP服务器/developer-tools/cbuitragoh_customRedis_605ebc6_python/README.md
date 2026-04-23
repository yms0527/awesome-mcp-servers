# Redis MCP Server

A professional implementation of a Redis server with MCP (Model Control Protocol) integration, containerized with Docker.

## Features

- Redis server with persistence
- MCP server integration for Redis operations
- Docker and Docker Compose support
- Comprehensive error handling and logging
- Environment-based configuration
- Health checks for Redis service

## Prerequisites

- Docker
- Docker Compose

## Quick Start

1. Clone the repository:
```bash
git clone https://github.com/cbuitragoh/customRedis.git
cd customredis
```

2. Start the services:
```bash
docker-compose up -d
```

3. Check the logs:
```bash
docker-compose logs -f
```

## Available Redis Operations

The MCP server provides the following Redis operations:

- `set_redis_key(key: str, value: str)`: Set a key-value pair
- `get_redis_key(key: str)`: Retrieve a value by key
- `delete_redis_key(key: str)`: Delete a key
- `list_redis_keys(pattern: str = '*')`: List all keys matching a pattern

## Configuration

The application can be configured through environment variables:

- `REDIS_HOST`: Redis server host (default: redis)
- `REDIS_PORT`: Redis server port (default: 6379)
- `REDIS_DB`: Redis database number (default: 0)
- `LOG_LEVEL`: Logging level (default: INFO)

## Development

### Local Development

1. Create a virtual environment:
```bash
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the server:
```bash
python src/server.py
```

### Docker Development

1. Build the image:
```bash
docker-compose build
```

2. Run the services:
```bash
docker-compose up
```

## Project Structure

```
.
├── src/
│   └── server.py      # Main server implementation
├── Dockerfile         # Docker configuration
├── docker-compose.yml # Docker Compose configuration
├── requirements.txt   # Python dependencies
├── .env              # Environment variables
└── README.md         # This file
```

## Error Handling

The application includes comprehensive error handling:
- Connection errors
- Redis operation errors
- Server startup/shutdown errors
- Graceful shutdown on keyboard interrupt

## Logging

The application uses Python's logging module with the following features:
- Timestamp-based log entries
- Different log levels (INFO, WARNING, ERROR)
- Detailed error messages
- Operation success/failure logging

## Using with Claude Desktop

To use this Redis MCP server with Claude Desktop, add the following configuration to your Claude Desktop settings:

```json
{
  "mcpServers": {
    "redis": {
            "command": "docker",
            "args": [
                "run", 
                "-i",
                "--rm",
                "--network",
                "customredis_redis-network",
                "customredis-mcp-server"]
    }
  }
}
```

This configuration:
- Uses Docker to run the Redis MCP server
- Connects to Redis using the host machine's Redis instance
- Runs in interactive mode (-i)
- Removes the container after use (--rm)
- Connect the MCP server to same network to Redis container

Make sure:
1. Redis is running in container from docker-compose redis service
2. The Redis port (6379) is accessible
3. Docker is running on your system

## License

MIT License

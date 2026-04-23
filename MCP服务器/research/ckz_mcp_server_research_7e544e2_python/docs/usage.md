# MCP Server Demo - Usage Guide

This guide explains how to use the MCP Server Demo implementation.

## Starting the Server

To start the MCP server:

```bash
cd src/demo
python simple_mcp_server.py
```

The server will run on port 5000 by default. You can change this by setting the `PORT` environment variable.

## Web Dashboard

Once the server is running, you can access the web dashboard at:

```
http://localhost:5000/
```

The dashboard provides:
- A list of connected clients
- Message history
- Real-time monitoring of the server

## API Endpoints

### Register a Client
```
POST /api/register
```

Example payload:
```json
{
  "client_id": "client-123",
  "capabilities": ["messaging", "heartbeat"]
}
```

### Send a Message
```
POST /api/message
```

Example payload:
```json
{
  "sender": "client-123",
  "recipient": "broadcast",
  "message_type": "data",
  "content": {
    "key": "value",
    "sensor_reading": 23.5
  }
}
```

### Get Client List
```
GET /api/clients
```

### Get Message History
```
GET /api/messages
```

## Running the Client Demo

To run the client demo:

```bash
cd src/demo
python client_demo.py --server http://localhost:5000 --duration 120 --interval 5
```

Options:
- `--server` or `-s`: The MCP server URL (default: http://localhost:5000)
- `--duration` or `-d`: Duration to run the demo in seconds (default: 60)
- `--interval` or `-i`: Interval between messages in seconds (default: 5)

## Message Types

The MCP protocol supports the following message types:

### Heartbeat
Regular status updates from clients.

### Data
Messages containing sensor or application data.

### Command
Messages that request specific actions be performed.

## Client Authentication

The current demo implementation uses simple client IDs without authentication. In a production environment, you would implement proper authentication and authorization.
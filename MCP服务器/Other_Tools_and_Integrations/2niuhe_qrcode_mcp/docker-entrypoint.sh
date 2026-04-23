#!/bin/bash

# 设置默认值
TRANSPORT_MODE=${TRANSPORT_MODE:-sse}
HOST=${HOST:-0.0.0.0}
PORT=${PORT:-8008}

echo "Starting QR Code MCP Server with transport mode: $TRANSPORT_MODE"
echo "Host: $HOST, Port: $PORT"

# 根据TRANSPORT_MODE环境变量启动不同模式的服务器
case "$TRANSPORT_MODE" in
    "http")
        echo "Starting HTTP transport mode..."
        exec python qrcode_mcp_server.py --http --host "$HOST" --port "$PORT"
        ;;
    "sse")
        echo "Starting SSE transport mode..."
        exec python qrcode_mcp_server.py --sse --host "$HOST" --port "$PORT"
        ;;
    "stdio")
        echo "Starting STDIO transport mode..."
        exec python qrcode_mcp_server.py
        ;;
    *)
        echo "Unknown transport mode: $TRANSPORT_MODE"
        echo "Supported modes: http, sse, stdio"
        echo "Defaulting to SSE mode..."
        exec python qrcode_mcp_server.py --sse --host "$HOST" --port "$PORT"
        ;;
esac 
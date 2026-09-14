#!/bin/bash

# Start script for workspace container
# Runs rsync daemon, file watcher, and MCP server

echo "🚀 Starting Workspace Container..."

# Start rsync daemon
echo "📡 Starting rsync daemon..."
rsync --daemon --config=/etc/rsyncd.conf

# Wait for rsync to start
sleep 2

# Check if rsync is running
if pgrep rsync > /dev/null; then
    echo "✅ Rsync daemon started on port 873"
else
    echo "❌ Failed to start rsync daemon"
    exit 1
fi

# Start file watcher in background
if [ "$SYNC_ENABLED" = "true" ]; then
    echo "👀 Starting file watcher..."
    /app/scripts/sync-watcher.sh &
    WATCHER_PID=$!
    echo "✅ File watcher started (PID: $WATCHER_PID)"
fi

# Start MCP server
echo "🤖 Starting MCP server..."
cd /app
npm run mcp

# Keep container running
wait
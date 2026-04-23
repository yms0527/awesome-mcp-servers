#!/bin/bash

# Backup script for Knowledge Graph MCP service data

set -e

# Get current timestamp
timestamp=$(date +%Y%m%d_%H%M%S)

# Create backups directory if it doesn't exist
mkdir -p backups

# Check storage type from environment or use default
STORAGE_TYPE=${KNOWLEDGEGRAPH_STORAGE_TYPE:-sqlite}
CONNECTION_STRING=${KNOWLEDGEGRAPH_CONNECTION_STRING:-sqlite://~/.knowledge-graph/knowledgegraph.db}

echo "🔄 Creating backup for $STORAGE_TYPE storage..."

if [ "$STORAGE_TYPE" = "postgresql" ]; then
    backup_file="backups/backup_${timestamp}.sql"
    pg_dump "$CONNECTION_STRING" > "$backup_file"
    echo "✅ PostgreSQL backup saved to $backup_file"
elif [ "$STORAGE_TYPE" = "sqlite" ]; then
    # Extract database path from connection string
    db_path=$(echo "$CONNECTION_STRING" | sed 's/sqlite:\/\///')

    if [ "$db_path" = ":memory:" ]; then
        echo "⚠️  Cannot backup in-memory SQLite database"
        exit 1
    fi

    if [ -f "$db_path" ]; then
        backup_file="backups/backup_${timestamp}.db"
        cp "$db_path" "$backup_file"
        echo "✅ SQLite backup saved to $backup_file"
    else
        echo "⚠️  SQLite database file not found: $db_path"
        exit 1
    fi
else
    echo "❌ Unknown storage type: $STORAGE_TYPE"
    exit 1
fi

echo "📊 Backup completed successfully!"

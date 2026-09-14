#!/bin/bash

# List available backups script

echo "📋 Available backups:"
if [ -d "backups" ] && [ "$(ls -A backups 2>/dev/null)" ]; then
    ls -la backups/
    echo ""
    echo "💡 To restore a backup:"
    echo "   PostgreSQL: psql [connection_string] < backups/backup_YYYYMMDD_HHMMSS.sql"
    echo "   SQLite: cp backups/backup_YYYYMMDD_HHMMSS.db [your_database_path]"
else
    echo "❌ No backups found"
    echo "💡 Create a backup with: task backup:data"
fi

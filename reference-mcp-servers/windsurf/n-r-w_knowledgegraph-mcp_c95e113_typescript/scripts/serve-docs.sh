#!/bin/bash

# Documentation server script

if [ -d "docs/api" ]; then
    echo "📚 Starting documentation server on http://localhost:8080"
    cd docs/api && python3 -m http.server 8080
else
    echo "❌ Documentation not found. Run 'task docs:generate' first."
    exit 1
fi

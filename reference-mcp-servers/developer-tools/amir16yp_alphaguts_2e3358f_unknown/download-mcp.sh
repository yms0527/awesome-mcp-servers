#!/bin/bash

# Check if curl is installed
if ! command -v curl &> /dev/null
then
    echo "Error: curl is not installed. Please install curl and try again."
    exit 1
fi

# URL of the MCP jar
MCP_URL="https://github.com/MCPHackers/RetroMCP-Java/releases/download/v1.0/RetroMCP-Java-CLI.jar"
OUTPUT_FILE="mcp.jar"

# Download the MCP jar
echo "Downloading RetroMCP-Java-CLI.jar..."
curl -fSL "$MCP_URL" -o "$OUTPUT_FILE"

# Check if the download was successful
if [ $? -ne 0 ]; then
    echo "Error: Failed to download $MCP_URL"
    exit 1
fi

chmod +x $OUTPUT_FILE
echo "Download complete. Saved as $OUTPUT_FILE."


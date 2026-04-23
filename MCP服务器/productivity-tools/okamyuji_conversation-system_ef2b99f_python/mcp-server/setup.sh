#!/bin/bash
set -e

echo "🚀 Setting up MCP Server for Conversation System..."

# Get the absolute path of the current directory
MCP_SERVER_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MAIN_DIR="$(dirname "$MCP_SERVER_DIR")"

echo "📁 MCP Server directory: $MCP_SERVER_DIR"

# Install Python dependencies
echo "📦 Installing MCP server dependencies..."
if command -v uv &> /dev/null; then
    echo "Using uv for faster package installation..."
    cd "$MCP_SERVER_DIR" && uv pip install --system -r requirements.txt
else
    cd "$MCP_SERVER_DIR" && pip install -r requirements.txt
fi

# Setup Claude Desktop configuration
echo "⚙️  Setting up Claude Desktop configuration..."

# Determine Claude Desktop config path based on OS
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    CLAUDE_CONFIG_DIR="$HOME/Library/Application Support/Claude"
    CLAUDE_CONFIG_FILE="$CLAUDE_CONFIG_DIR/claude_desktop_config.json"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    CLAUDE_CONFIG_DIR="$HOME/.config/Claude"
    CLAUDE_CONFIG_FILE="$CLAUDE_CONFIG_DIR/claude_desktop_config.json"
else
    # Windows (in WSL or Git Bash)
    CLAUDE_CONFIG_DIR="$HOME/AppData/Roaming/Claude"
    CLAUDE_CONFIG_FILE="$CLAUDE_CONFIG_DIR/claude_desktop_config.json"
fi

# Create Claude config directory if it doesn't exist
mkdir -p "$CLAUDE_CONFIG_DIR"

# Update the config template with the actual path
echo "📝 Creating Claude Desktop configuration..."
cat > "$MCP_SERVER_DIR/claude_desktop_config.json" << EOF
{
  "mcpServers": {
    "conversation-system": {
      "command": "python",
      "args": ["$MCP_SERVER_DIR/main.py"],
      "env": {
        "CONVERSATION_API_URL": "http://localhost:8000"
      }
    }
  }
}
EOF

# Backup existing config if it exists
if [ -f "$CLAUDE_CONFIG_FILE" ]; then
    echo "💾 Backing up existing Claude Desktop config..."
    cp "$CLAUDE_CONFIG_FILE" "$CLAUDE_CONFIG_FILE.backup.$(date +%Y%m%d_%H%M%S)"
    
    # Merge with existing config if possible
    echo "🔄 Merging with existing configuration..."
    python3 << EOF
import json
import sys

try:
    # Load existing config
    with open('$CLAUDE_CONFIG_FILE', 'r') as f:
        existing_config = json.load(f)
    
    # Load new config
    with open('$MCP_SERVER_DIR/claude_desktop_config.json', 'r') as f:
        new_config = json.load(f)
    
    # Merge mcpServers
    if 'mcpServers' not in existing_config:
        existing_config['mcpServers'] = {}
    
    existing_config['mcpServers'].update(new_config['mcpServers'])
    
    # Write merged config
    with open('$CLAUDE_CONFIG_FILE', 'w') as f:
        json.dump(existing_config, f, indent=2)
    
    print("✅ Configuration merged successfully")
    
except Exception as e:
    print(f"⚠️  Could not merge configurations: {e}")
    print("📄 Please manually add the MCP server configuration")
    sys.exit(1)
EOF
else
    # No existing config, create new one
    echo "📄 Creating new Claude Desktop configuration..."
    cp "$MCP_SERVER_DIR/claude_desktop_config.json" "$CLAUDE_CONFIG_FILE"
fi

# Make the main.py executable
chmod +x "$MCP_SERVER_DIR/main.py"

# Test the MCP server setup
echo "🧪 Testing MCP server setup..."
if ! python3 -c "import mcp; print('MCP library installed successfully')"; then
    echo "❌ MCP library not properly installed"
    echo "Please install it manually: pip install mcp"
    exit 1
fi

echo ""
echo "✅ MCP Server setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Ensure your conversation system is running:"
echo "   cd $MAIN_DIR && ./scripts/start.sh"
echo ""
echo "2. Restart Claude Desktop to load the new MCP server"
echo ""
echo "3. In Claude Desktop, you can now use commands like:"
echo "   • 'Record this conversation'"
echo "   • 'Show my conversation history'"
echo "   • 'Search for conversations about Redis'"
echo ""
echo "📁 Configuration files:"
echo "   Claude Desktop config: $CLAUDE_CONFIG_FILE"
echo "   MCP Server: $MCP_SERVER_DIR/main.py"
echo ""
echo "🔧 Troubleshooting:"
echo "   • Check logs: tail -f $MCP_SERVER_DIR/mcp_server.log"
echo "   • Test API: curl http://localhost:8000/health"
echo ""

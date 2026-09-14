#!/bin/bash
set -e

# Parse command line arguments
MANUAL_TEST=false
for arg in "$@"; do
  case $arg in
    --test)
      MANUAL_TEST=true
      shift # Remove --test from processing
      ;;
    --help|-h)
      echo ""
      echo "Usage: ./$(basename "$0") [options]"
      echo ""
      echo "Options:"
      echo "  --test    Start a test server for manual testing after update"
      echo "  --help    Display this help message"
      echo ""
      echo "Examples:"
      echo "  ./$(basename "$0")         # Update the service"
      echo "  ./$(basename "$0") --test  # Update and start a test server"
      exit 0
      ;;
  esac
done

echo "🔄 Updating mcp-yahoo-finance service using uv..."

# Ensure we are in the correct directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"
echo "📂 Current working directory: $(pwd)"

# 1. Stop all currently related processes
echo "🛑 Stopping existing processes..."
pkill -f "uvx mcp-yahoo-finance" || echo "No uvx process found."
pkill -f "/bin/mcp-yahoo-finance" || echo "No mcp-yahoo-finance binary process found."
pkill -f "python -m mcp_yahoo_finance" || echo "No mcp_yahoo_finance python process found."
pkill -f "start_server.py" || echo "No start_server.py process found."
sleep 1 # Give processes some time to terminate

# 2. Thoroughly clean up all old versions (using uv)
echo "🧹 Cleaning up old uv installations..."

# Clean up uvx tool directory
echo "🔧 Cleaning up uvx tool directory..."
if command -v uv &> /dev/null; then
  uv tool uninstall mcp-yahoo-finance || echo "mcp-yahoo-finance not found in uvx tools."
else
  echo "❌ Error: 'uv' command not found. Cannot proceed with uv-based installation."
  exit 1
fi

# Manually delete uvx tool directory (in case uv tool uninstall is incomplete)
echo "🗑️ Manually deleting uvx tool directory..."
rm -rf ~/.local/share/uv/tools/mcp-yahoo-finance || echo "uvx tool directory not found."

# Delete executable link
echo "🔗 Deleting executable link..."
rm -f ~/.local/bin/mcp-yahoo-finance || echo "Executable link not found."

# Clean up relevant uv caches
echo "🧽 Cleaning up relevant uv caches..."
find ~/.cache/uv -name "*mcp-yahoo-finance*" -type d -o -name "*mcp-yahoo-finance*" -type f | xargs rm -rf 2>/dev/null || echo "Cache files not found."

# 3. Reinstall mcp-yahoo-finance from the local development directory using uvx
echo "📦 Reinstalling mcp-yahoo-finance into uvx from local directory..."
if [ ! -f "setup.py" ] && [ ! -f "pyproject.toml" ]; then
 echo "❌ Error: Current directory is not a valid Python package directory. Check for setup.py or pyproject.toml."
 exit 1
fi

PYTHON_PATH=$(which python)
echo "🐍 Using Python for installation context (if needed by uv): $PYTHON_PATH"

# Ensure all dependencies are correctly installed in the uvx environment
echo "🔍 Ensuring all dependencies are correctly installed via uv tool install..."
# The `-e .` tells uv to install the current directory in editable mode
# uv tool install -e . || {
# Use a regular install instead of editable
uv tool install . --force --reinstall || { # Add --reinstall
  echo "❌ uvx installation failed. Please check uv logs."
  exit 1
}
# echo "✅ Successfully installed mcp-yahoo-finance using uv tool install -e ."
echo "✅ Successfully installed mcp-yahoo-finance using uv tool install ."


# 4. Verify installed version
echo "🔍 Verifying installed version..."
# Use importlib.metadata via uvx run to check the tool's environment
# PACKAGE_VERSION=$(uvx run -- python -c "import importlib.metadata; print(importlib.metadata.version('mcp-yahoo-finance'))" 2>/dev/null || echo "Could not get package version via uvx run")
# echo "📦 Package version (in uvx env): $PACKAGE_VERSION"

# Check if correctly listed in uvx tools
echo "🔍 Checking uvx tool list:"
uv tool list | grep mcp-yahoo-finance || echo "mcp-yahoo-finance not listed in uvx tools (unexpected)."
# Confirm the executable link exists
if [ -f ~/.local/bin/mcp-yahoo-finance ]; then
    echo "✅ Executable link ~/.local/bin/mcp-yahoo-finance found."
else
    echo "⚠️ Executable link ~/.local/bin/mcp-yahoo-finance NOT found."
fi

# 5. Add extra verification step to confirm mcp modules are correctly installed within uvx
# echo "🔍 Verifying mcp modules are correctly installed within uvx..."
# # Create a temporary test script
# TEMP_SCRIPT=$(mktemp)
# cat > "$TEMP_SCRIPT" << EOL
# import sys
# try:
#     import mcp
#     print(f"✅ mcp module found at: {mcp.__file__}")
#     import mcp.server
#     print(f"✅ mcp.server module found at: {mcp.server.__file__}")
#     import mcp_yahoo_finance
#     print(f"✅ mcp_yahoo_finance module found at: {mcp_yahoo_finance.__file__}")
#     print(f"   Version: {mcp_yahoo_finance.__version__}")
#     # Add a basic server import test
#     from mcp_yahoo_finance.server import YahooFinance, serve
#     print("✅ mcp_yahoo_finance.server components imported successfully.")
# except ImportError as e:
#     print(f"❌ Error importing module: {e}")
#     print("Python Path:", sys.path)
#     exit(1)
# except AttributeError as e:
#     print(f"❌ Error accessing attribute (likely version): {e}")
#     exit(1)
# except Exception as e:
#     print(f"❌ An unexpected error occurred: {e}")
#     exit(1)
# print("✅ All required modules seem accessible within the environment.")
# EOL

# # Test the uvx environment directly
# echo "Testing uvx environment:"
# # Use the corrected syntax `uvx -- python ...`
# uvx -- python "$TEMP_SCRIPT" || {
#     echo "❌ uvx environment module verification failed."
#     rm "$TEMP_SCRIPT" # Clean up even on failure
#     exit 1
# }

# # Clean up temporary file
# rm "$TEMP_SCRIPT"

# 6. Test installation functionality using uvx run
# echo "⚙️ Testing core functionality using uvx run..."
# echo "Testing basic stock price retrieval..."
# TEST_CMD="from mcp_yahoo_finance.server import YahooFinance; yf = YahooFinance(); price = yf.get_current_stock_price('AAPL'); print(f'🍏 Apple stock price: {price}')"
# uvx -- python -c "$TEST_CMD" || {
#   echo "❌ Error: Basic functionality test failed in uvx environment."
#   exit 1
# }


# echo "Testing visualization module import..."
# VIZ_TEST_CMD="from mcp_yahoo_finance.visualization import generate_stock_analysis; print('✅ Visualization module imported successfully.')"
# uvx -- python -c "$VIZ_TEST_CMD" || {
#   echo "❌ Error: Visualization functionality test failed in uvx environment."
#   exit 1
# }

# 7. Restart MCP Service (if not manual test)
echo "🚀 Handling MCP service..."

if [ "$MANUAL_TEST" = true ]; then
  echo ""
  echo "✅ Update complete. Manual test mode enabled."
  echo "🧪 To start the server for testing, run:"
  echo "    uvx mcp-yahoo-finance"
  echo "   or for more control/debugging:"
  echo "    uvx run -- python -m mcp_yahoo_finance.server"
  echo ""

# Check if Cursor MCP config exists and we are NOT in manual test mode
elif [ -f ~/.cursor/mcp.json ] && grep -q '"command": *"uvx"' ~/.cursor/mcp.json && grep -q '"args": *\[ *"mcp-yahoo-finance" *\]' ~/.cursor/mcp.json; then
  echo "📝 Detected Cursor MCP configuration for 'uvx mcp-yahoo-finance'."
  echo "✅ MCP service will be automatically started by Cursor."
  echo "👉 Please restart Cursor or open a new chat to apply changes."
else
  echo "📝 No automatic Cursor config detected or not using 'uvx mcp-yahoo-finance', attempting to start standalone service..."
  LOG_FILE="mcp_yahoo_finance.log"
  echo "📝 Attempting to start service using 'uvx mcp-yahoo-finance'..."
  nohup uvx mcp-yahoo-finance > "$LOG_FILE" 2>&1 &
  UVX_PID=$!
  sleep 2 # Give it time to start or fail

  # Check if the process started successfully
  if ps -p $UVX_PID > /dev/null; then
    echo "✅ MCP service started successfully via uvx, PID: $UVX_PID. Log: $LOG_FILE"
  else
    echo "⚠️ uvx start failed. Trying direct Python execution via uvx run..."
    # Attempt direct execution via uvx run (more reliable for module execution)
    nohup uvx run -- python -m mcp_yahoo_finance.server > "$LOG_FILE" 2>&1 &
    PY_PID=$!
    sleep 2

    if ps -p $PY_PID > /dev/null; then
       echo "✅ MCP service started successfully via uvx run, PID: $PY_PID. Log: $LOG_FILE"
    else
       echo "❌ Error: MCP service failed to start using both methods. Check log: $LOG_FILE"
       cat "$LOG_FILE"
       exit 1
    fi
  fi
fi

echo ""
echo "✅ Update process finished!"
if [ "$MANUAL_TEST" = false ]; then
  echo "📝 Service status can be checked with: ps aux | grep mcp-yahoo-finance"
  echo "🔍 Currently running related processes:"
  ps aux | grep "mcp-yahoo-finance\\|mcp_yahoo_finance" | grep -v grep || echo "No related processes seem to be running."
else
    echo "➡️ Remember to start the server manually for testing if needed (see instructions above)."
fi 
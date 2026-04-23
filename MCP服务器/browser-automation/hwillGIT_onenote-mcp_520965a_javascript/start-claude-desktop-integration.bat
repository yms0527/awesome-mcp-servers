@echo off
echo Starting OneNote MCP integration with Claude Desktop
echo ===================================================
echo.

:: Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Error: Node.js is not installed or not in the PATH.
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

:: Create directories if they don't exist
if not exist screenshots (
    echo Creating screenshots directory...
    mkdir screenshots
)

if not exist logs (
    echo Creating logs directory...
    mkdir logs
)

if not exist cache (
    echo Creating cache directory...
    mkdir cache
)

:: Check if dependencies are installed
if not exist node_modules\express (
    echo Installing required dependencies...
    call npm install express cors
)

if not exist node_modules\playwright (
    echo Installing Playwright...
    call npm install playwright
)

:: Start the MCP server
echo Starting OneNote MCP server...
start /B node mcp-server.js > logs\server-output.log 2>&1

:: Wait for the server to start
echo Waiting for the server to start...
timeout /t 3 > nul

:: Check if server is running
curl -s http://localhost:3030/health > nul
if %ERRORLEVEL% neq 0 (
    echo Error: Failed to start the MCP server.
    echo Please check the logs in logs\server-output.log
    pause
    exit /b 1
)

:: Open the OneNote notebook in a browser
echo Opening OneNote notebook...
start "" "https://1drv.ms/o/c/8255fc51ed471d07/EgcdR-1R_FUggIKOAAAAAAABG7lbVxX_BAJcuuZRXKhUdg?e=XSDLoz"

:: Notify about Claude Desktop integration
echo.
echo ==============================================
echo  OneNote MCP Server Running Successfully!
echo ==============================================
echo.
echo The OneNote MCP server is now running at:
echo http://localhost:3030
echo.
echo To integrate with Claude Desktop:
echo 1. Open Claude Desktop
echo 2. Go to Settings
echo 3. Select "Extensions" or "Plugins"
echo 4. Click "Add Local Extension"
echo 5. Browse to and select:
echo    D:\fetch-mcp\onenote-mcp\claude-desktop-plugin.json
echo.
echo After adding the plugin to Claude Desktop, you can use
echo commands like:
echo - "Read from OneNote context [contextName]"
echo - "Store this information in OneNote as entity [entityName]"
echo - "Search OneNote for [query]"
echo.
echo This command window keeps the server running.
echo DO NOT CLOSE THIS WINDOW while using the MCP integration.
echo.
echo Press Ctrl+C to stop the server when you're done.
echo ==============================================

:: Keep the window open
pause > nul

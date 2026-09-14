@echo off
REM Script to run the AytchMCP server in WSL Ubuntu

setlocal enabledelayedexpansion

REM Check if WSL is installed
wsl -l >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo WSL is not installed. Please install WSL and Ubuntu.
    exit /b 1
)

REM Check if Ubuntu-24.04 is installed
wsl -l | findstr "Ubuntu-24.04" >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Ubuntu-24.04 is not installed in WSL. Please install it.
    exit /b 1
)

REM Get the current directory path
set "CURRENT_DIR=%CD%"
set "WSL_PATH=/mnt/%CURRENT_DIR:~0,1%/%CURRENT_DIR:~3%"
set "WSL_PATH=!WSL_PATH:\=/!"

REM Parse command line arguments
if "%1"=="" (
    echo Usage: %0 {build^|start^|stop^|restart^|logs^|init}
    echo   build   - Build the Docker images
    echo   start   - Start the MCP server
    echo   stop    - Stop the MCP server
    echo   restart - Restart the MCP server
    echo   logs    - Show the server logs
    echo   init    - Initialize the configuration
    exit /b 1
)

REM Execute the command in WSL
if "%1"=="build" (
    echo Building Docker images...
    wsl -d Ubuntu-24.04 bash -c "cd %WSL_PATH% && chmod +x run_mcp_server.sh && ./run_mcp_server.sh build"
) else if "%1"=="start" (
    echo Starting AytchMCP server...
    wsl -d Ubuntu-24.04 bash -c "cd %WSL_PATH% && chmod +x run_mcp_server.sh && ./run_mcp_server.sh start"
) else if "%1"=="stop" (
    echo Stopping AytchMCP server...
    wsl -d Ubuntu-24.04 bash -c "cd %WSL_PATH% && chmod +x run_mcp_server.sh && ./run_mcp_server.sh stop"
) else if "%1"=="restart" (
    echo Restarting AytchMCP server...
    wsl -d Ubuntu-24.04 bash -c "cd %WSL_PATH% && chmod +x run_mcp_server.sh && ./run_mcp_server.sh restart"
) else if "%1"=="logs" (
    echo Showing logs for AytchMCP server...
    wsl -d Ubuntu-24.04 bash -c "cd %WSL_PATH% && chmod +x run_mcp_server.sh && ./run_mcp_server.sh logs"
) else if "%1"=="init" (
    echo Initializing configuration...
    wsl -d Ubuntu-24.04 bash -c "cd %WSL_PATH% && chmod +x run_mcp_server.sh && ./run_mcp_server.sh init"
) else (
    echo Unknown command: %1
    echo Usage: %0 {build^|start^|stop^|restart^|logs^|init}
    exit /b 1
)

exit /b 0
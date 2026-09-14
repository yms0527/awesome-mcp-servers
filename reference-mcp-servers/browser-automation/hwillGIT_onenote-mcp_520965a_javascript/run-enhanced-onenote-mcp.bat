@echo off
echo Enhanced OneNote Model Context Protocol (MCP) Tool
echo =================================================
echo.
echo This script runs the enhanced OneNote MCP integration using browser automation.
echo.

rem Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Error: Node.js is not installed or not in the PATH.
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

rem Check if directories exist
if not exist screenshots (
    echo Creating screenshots directory...
    mkdir screenshots
)

if not exist cache (
    echo Creating cache directory...
    mkdir cache
)

rem Check if Playwright is installed
if not exist node_modules\playwright (
    echo Installing Playwright...
    call npm install playwright
)

echo.
echo Select an option:
echo 1. Run OneNote MCP Test
echo 2. Start Browser Automation Test
echo 3. Clean Cache Directory
echo 4. Update Notebook Link in Configuration
echo 5. Exit
echo.

set /p choice=Enter your choice (1-5): 

if "%choice%"=="1" (
    echo.
    echo Running OneNote MCP Test...
    echo.
    node test-onenote-mcp.js
) else if "%choice%"=="2" (
    echo.
    echo Starting Browser Automation Test...
    echo.
    node --experimental-modules browser-automation-example.js
) else if "%choice%"=="3" (
    echo.
    echo Cleaning cache directory...
    if exist cache\*.* (
        del /Q cache\*.*
        echo Cache directory cleaned.
    ) else (
        echo Cache directory is already empty.
    )
) else if "%choice%"=="4" (
    echo.
    echo Current notebook link:
    findstr "notebookLink" onenote-browser-automation.js
    echo.
    echo Enter new notebook link:
    set /p newlink=
    echo.
    echo Updating notebook link in configuration files...
    
    rem Use a temporary file to store the updated content
    type onenote-browser-automation.js | find /v "notebookLink" > temp.js
    echo   notebookLink: '%newlink%', >> temp.js
    move /y temp.js onenote-browser-automation.js
    
    echo Notebook link updated in onenote-browser-automation.js.
    echo.
    echo Also updating direct-link-access.js...
    type direct-link-access.js | find /v "notebookLink" > temp.js
    echo   notebookLink: '%newlink%', >> temp.js
    move /y temp.js direct-link-access.js
    echo Notebook link updated in direct-link-access.js.
) else if "%choice%"=="5" (
    echo Exiting...
    exit /b 0
) else (
    echo Invalid choice. Please try again.
)

echo.
pause

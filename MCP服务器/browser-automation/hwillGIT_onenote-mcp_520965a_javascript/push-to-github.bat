@echo off
:: Script to help push the OneNote MCP to GitHub for Windows users

:: Check if git is installed
where git >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Error: git is not installed. Please install git and try again.
    exit /b 1
)

:: Check if the directory is a git repository
if not exist ".git" (
    echo Initializing git repository...
    git init
)

:: Add all files to the repository
echo Adding files to the repository...
git add .

:: Commit changes
echo Committing changes...
git commit -m "Initial commit of OneNote MCP"

:: Add remote and push
echo.
echo Please manually complete these steps:
echo.
echo 1. Create a repository on GitHub named "onenote-mcp"
echo 2. Run the following commands:
echo    git remote add origin https://github.com/YOURUSERNAME/onenote-mcp.git
echo    git push -u origin master
echo.
echo Replace YOURUSERNAME with your GitHub username
echo.

pause

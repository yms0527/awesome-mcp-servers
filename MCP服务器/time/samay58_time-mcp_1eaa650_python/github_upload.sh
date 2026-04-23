#!/bin/bash
# Script to initialize git and upload to GitHub

# Initialize git repository
git init

# Add all files
git add .

# Make initial commit
git commit -m "Initial commit"

# Create repository on GitHub first (manually)
# Then add the remote and push
echo "Now run these commands after creating your GitHub repository:"
echo "git remote add origin https://github.com/YOUR_USERNAME/time-mcp.git"
echo "git branch -M main"
echo "git push -u origin main"
#!/bin/bash

# Script to publish the package to npm
# This script builds the package, runs tests, and publishes it to npm

echo "Building the package..."
npm run build

echo "Running tests..."
node test-server.js --test-version

echo "Publishing to npm..."
echo "You will need to be logged in to npm to publish the package."
echo "If you're not logged in, run 'npm login' first."
echo ""
echo "Press Enter to continue or Ctrl+C to cancel..."
read

npm publish --access public

echo "Package published successfully!"

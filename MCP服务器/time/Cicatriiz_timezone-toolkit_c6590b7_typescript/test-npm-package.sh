#!/bin/bash

# Test script for the npm package
# This script creates a tarball of the package and tests it locally.

echo "Creating tarball of the package..."
npm pack

# Get the package name and version from package.json
PACKAGE_NAME=$(node -e "console.log(require('./package.json').name.replace('@', '').replace('/', '-'))")
PACKAGE_VERSION=$(node -e "console.log(require('./package.json').version)")
TARBALL="${PACKAGE_NAME}-${PACKAGE_VERSION}.tgz"

echo "Testing the package locally..."
echo "Version flag test:"
node dist/index.js --version

echo "Running test-server.js..."
node test-server.js --test-version

echo "Cleaning up..."
rm "./${TARBALL}"

echo "Test completed!"

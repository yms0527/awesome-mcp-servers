# Publishing TimezoneToolkit to npm

This guide provides step-by-step instructions for publishing the TimezoneToolkit MCP server to npm.

## Prerequisites

- Node.js 18.x or higher
- npm account (create one at https://www.npmjs.com/signup if you don't have one)
- npm CLI logged in to your account

## Steps to Publish

### 1. Login to npm

```bash
npm login
```

Enter your npm username, password, and email when prompted.

### 2. Build the Project

Make sure the project is built before publishing:

```bash
npm run build
```

### 3. Test the Package Locally (Optional)

You can test the package locally before publishing using the included test script:

```bash
# Test the local build
node test-server.js

# Test a specific tool
node test-server.js --tool=calculate_sunrise_sunset

# List all available tools
node test-server.js --list

# Test the version flag
node test-server.js --test-version
```

After publishing, you can test the npm package directly:

```bash
# Test the published npm package
node test-server.js --npm
```

You can also create a local tarball and install it for testing:

```bash
# Create a tarball of the package
npm pack

# Install the package globally
npm install -g ./cicatriz-timezone-toolkit-1.0.0.tgz

# Test the package
timezone-toolkit --version

# Uninstall the package
npm uninstall -g @cicatriz/timezone-toolkit
```

### 4. Publish to npm

```bash
npm publish
```

If this is your first time publishing this package, you might need to use:

```bash
npm publish --access public
```

### 5. Verify the Publication

After publishing, verify that your package is available on npm:

```bash
npm view @cicatriz/timezone-toolkit
```

You can also check the npm website: https://www.npmjs.com/package/@cicatriz/timezone-toolkit

## Updating the Package

To update the package:

1. Update the version in package.json
2. Make your changes
3. Build the project
4. Publish to npm

```bash
# Update version (choose one)
npm version patch  # for bug fixes
npm version minor  # for new features
npm version major  # for breaking changes

# Build
npm run build

# Publish
npm publish
```

## Using the Published Package

Once published, users can install your package using:

```bash
# Global installation
npm install -g @cicatriz/timezone-toolkit

# Run the MCP server
timezone-toolkit

# Or using npx (no installation required)
npx -y @cicatriz/timezone-toolkit@latest
```

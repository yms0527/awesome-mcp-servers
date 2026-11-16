# MCP Password Generator

A Model Context Protocol (MCP) server that generates random passwords with different character sets.

## Features

- Generate random passwords with different character sets:
  - `all`: Includes letters, numbers, and special characters
  - `alpha`: Alphanumeric characters (letters and numbers)
  - `numbers`: Only numbers
  - `letters`: Only letters (uppercase and lowercase)

## Prerequisites

- Node.js (v16 or higher)
- npm

## Installation

1. Clone the repository:
```bash
git clone git@github.com:acidkeyxyz/mcp-pwd-generator.git
cd mcp-pwd-generator
```

2. Install dependencies:
```bash
npm install
```

## Running with Inspector

To run the MCP server with the inspector, you'll need to:

1. Install the MCP Inspector globally:
```bash
npm install -g @modelcontextprotocol/inspector
```

2. Run the server:
```bash
npx tsx index.ts
```

3. In a separate terminal, run the inspector:
```bash
mcp-inspector
```

## Usage

Once the server is running with the inspector, you can use the `generate-password` tool with the following parameters:

- `count`: Number of passwords to generate
- `length`: Length of each password
- `type`: Password character set type (optional, defaults to "all")
  - `all`: All characters (letters, numbers, special characters)
  - `alpha`: Alphanumeric characters
  - `numbers`: Only numbers
  - `letters`: Only letters

Example request in the inspector:
```json
{
  "name": "generate-password",
  "parameters": {
    "count": 1,
    "length": 12,
    "type": "all"
  }
}
```

## License

ISC

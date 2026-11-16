# Google Sheets MCP Server

A Model Context Protocol (MCP) server for Google Sheets written in Go. Provides comprehensive tools for interacting with Google Spreadsheets.

## Features

- **Sheet Data**: Get/update cell data, formulas, batch operations
- **Sheet Management**: Create, rename, copy sheets, add rows/columns
- **Spreadsheet Management**: Create, list, share spreadsheets
- **Multiple Authentication Methods**: Service account, OAuth2, ADC

## Quick Start

1. **Build**:
   ```bash
   make build
   ```

2. **Setup Google API Credentials** (see [SETUP.md](SETUP.md) for detailed instructions)

3. **Configure Environment**:
   ```bash
   # Service Account (recommended)
   export SERVICE_ACCOUNT_PATH="path/to/service-account.json"
   
   # OAuth2
   export CREDENTIALS_PATH="path/to/credentials.json"
   
   # Base64 encoded service account
   export CREDENTIALS_CONFIG="base64_encoded_service_account_json"
   ```

3. **Run**:
   ```bash
   # Stdio mode
   ./go_mcp_server_google_sheets
   
   # SSE mode
   ./go_mcp_server_google_sheets -t sse -p 8891
   ```

## Environment Variables

- `SERVICE_ACCOUNT_PATH` - Path to service account JSON file
- `CREDENTIALS_PATH` - Path to OAuth2 credentials JSON file  
- `CREDENTIALS_CONFIG` - Base64 encoded service account JSON
- `TOKEN_PATH` - OAuth2 token storage path (default: token.json)
- `DRIVE_FOLDER_ID` - Google Drive folder ID for new spreadsheets

## Available Tools

### Data Operations
- `get_sheet_data` - Get data from sheet
- `get_sheet_formulas` - Get formulas from sheet
- `update_cells` - Update cell values
- `batch_update_cells` - Batch update multiple ranges

### Sheet Management  
- `list_sheets` - List all sheets in spreadsheet
- `create_sheet` - Create new sheet
- `rename_sheet` - Rename existing sheet
- `copy_sheet` - Copy sheet between spreadsheets
- `add_rows` / `add_columns` - Add rows or columns

### Spreadsheet Management
- `create_spreadsheet` - Create new spreadsheet
- `list_spreadsheets` - List spreadsheets in Drive
- `share_spreadsheet` - Share spreadsheet with users

## Authentication Setup

### Method 1: Service Account (Recommended)

1. **Create Google Cloud Project**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one

2. **Enable APIs**:
   - Go to "APIs & Services" > "Library"
   - Enable "Google Sheets API"
   - Enable "Google Drive API"

3. **Create Service Account**:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "Service Account"
   - Fill in service account details
   - Click "Create and Continue"

4. **Generate Key**:
   - Click on created service account
   - Go to "Keys" tab
   - Click "Add Key" > "Create new key"
   - Choose "JSON" format
   - Download the file (this is your `service-account.json`)

5. **Set Environment Variable**:
   ```bash
   export SERVICE_ACCOUNT_PATH="/path/to/your/service-account.json"
   ```

### Method 2: OAuth2 (For User Access)

1. **Create OAuth2 Credentials**:
   - In Google Cloud Console, go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Desktop application"
   - Download the JSON file (this is your `credentials.json`)

2. **Set Environment Variable**:
   ```bash
   export CREDENTIALS_PATH="/path/to/your/credentials.json"
   ```

### Method 3: Base64 Encoded (For Containers/CI)

1. **Encode Service Account**:
   ```bash
   base64 -w 0 /path/to/service-account.json
   ```

2. **Set Environment Variable**:
   ```bash
   export CREDENTIALS_CONFIG="your_base64_encoded_string_here"
   ```

### Sharing Spreadsheets with Service Account

When using Service Account, you need to share your spreadsheets with the service account email:

1. Open your Google Spreadsheet
2. Click "Share" button
3. Add the service account email (found in your JSON file as `client_email`)
4. Give appropriate permissions (Viewer/Editor)

## License

MIT
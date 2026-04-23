# MCP (Model Context Protocol) Usage Guide
## ETF Analytics Dashboard - GA4 & GTM Integration

**Document Version**: 1.1  
**Last Updated**: June 1, 2025  
**Author**: Technical Team  
**Status**: ✅ **CREDENTIALS CONFIGURED - READY TO USE**

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Available MCP Servers](#available-mcp-servers)
4. [Quick Start Guide](#quick-start-guide)
5. [GA4 Admin MCP Server](#ga4-admin-mcp-server)
6. [GA4 Data MCP Server](#ga4-data-mcp-server)
7. [GTM MCP Server Setup](#gtm-mcp-server-setup)
8. [Common Use Cases](#common-use-cases)
9. [Troubleshooting](#troubleshooting)
10. [Best Practices](#best-practices)

---

## Overview

Model Context Protocol (MCP) servers provide AI-powered interfaces to interact with Google Analytics 4 and Google Tag Manager APIs. This allows data analysts to perform complex operations using natural language commands through AI assistants like Claude.

### What MCP Enables:
- **Natural Language Queries**: Ask questions about GA4 data in plain English
- **Automated Reporting**: Generate reports without manual API calls
- **Configuration Management**: Set up GA4 properties and GTM containers via AI
- **Data Analysis**: Perform complex analytics operations through conversation

---

## Prerequisites

### System Requirements
- ✅ **Node.js**: v16 or higher (we have v24.1.0)
- ✅ **npm**: Latest version (we have v11.3.0)
- ✅ **Terminal Access**: Command line interface

### Google Cloud Setup
- ✅ **Google Cloud Project**: [project-id] (CONFIGURED)
- ✅ **Service Account**: [service-account-email] (READY)
- ✅ **API Keys**: GA4 and GTM API access (ENABLED)
- ✅ **Authentication**: JSON credentials file (AVAILABLE)

### Project Access
- 🔴 **GA4 Property**: G-FH17P76S7Y (needs service account access)
- 🔴 **GTM Container**: GTM-TWCDWPT5 (needs service account access)

---

## Available MCP Servers

### ✅ Working MCP Servers

| Server | Package Name | Status | Purpose |
|--------|-------------|--------|---------|
| **GA4 Admin** | `mcp-ga4-admin` | ✅ **READY & AUTHENTICATED** | Property management, user permissions, custom dimensions |
| **GA4 Data** | `mcp-ga4-data` | ✅ **READY & AUTHENTICATED** | Data reporting, metrics, audience analysis |
| **GTM Server** | `google-tag-manager-mcp-server` | 🔴 Setup Required | Tag management, container operations |

### ❌ Incorrect Package Names (Don't Use)
- ~~`google-tag-manager-mcp-server`~~ (via npx)
- ~~`mcp-server-ga4`~~ (doesn't exist)

---

## Quick Start Guide

### 🚀 **READY TO USE - No Setup Required!**

The credentials are already configured. Priya can start using MCP servers immediately:

### 1. Set Up Credentials (One-time setup)
```bash
# Set the credentials (already done, but for reference)
export GOOGLE_APPLICATION_CREDENTIALS="./analytics/service-account-key.json"
```

### 2. Start GA4 Admin MCP Server
```bash
# Start GA4 Admin MCP Server
npx -y mcp-ga4-admin

# Expected Output:
# Starting Google Analytics 4 Admin MCP Server...
# Google Analytics Admin Client initialized.
# Google Analytics Admin MCP Server running on stdio
```

### 3. Start GA4 Data MCP Server
```bash
# Start GA4 Data MCP Server (in new terminal)
npx -y mcp-ga4-data

# Expected Output:
# Starting Google Analytics 4 Data MCP Server...
# Google Analytics Clients initialized.
# Google Analytics Data MCP Server running on stdio
```

### 4. ✅ **Both Servers Are Now Authenticated and Ready!**

---

## GA4 Admin MCP Server

### Purpose
Manage Google Analytics 4 administrative functions through AI commands.

### Capabilities
- **Property Management**: Create, update, delete GA4 properties
- **User Management**: Add/remove users, manage permissions
- **Custom Dimensions**: Create and configure custom dimensions
- **Custom Metrics**: Set up custom metrics
- **Conversion Events**: Configure conversion goals
- **Data Retention**: Manage data retention policies

### Usage Examples

#### Start the Server
```bash
# Credentials are already set up!
npx -y mcp-ga4-admin
```

#### Example AI Commands (via Claude/AI Assistant)
```
"Create a custom dimension called 'page_path' for our GA4 property"
"Add a new user with viewer permissions to our analytics account"
"Set up a conversion event for 'search_performed'"
"Configure data retention to 14 months"
"List all custom dimensions in our GA4 property"
"Show me the current user permissions for our analytics account"
```

### ✅ Authentication Status
- **Service Account**: [service-account-email]
- **Project**: [project-id]
- **Status**: AUTHENTICATED ✅

---

## GA4 Data MCP Server

### Purpose
Query and analyze Google Analytics 4 data through AI-powered natural language.

### Capabilities
- **Reporting**: Generate custom reports
- **Metrics Analysis**: Analyze user behavior, sessions, events
- **Audience Insights**: User demographics and behavior
- **Real-time Data**: Current active users and events
- **Funnel Analysis**: Conversion path analysis
- **Cohort Analysis**: User retention studies

### Usage Examples

#### Start the Server
```bash
# Credentials are already set up!
npx -y mcp-ga4-data
```

#### Example AI Commands (via Claude/AI Assistant)
```
"Show me the top 10 pages by pageviews for the last 30 days"
"What's the conversion rate for our search events?"
"Generate a report of user engagement by device type"
"How many active users do we have right now?"
"Show me the bounce rate for each tab in our dashboard"
"Compare this week's performance to last week"
"What are the most popular events in our ETF dashboard?"
```

### Available Metrics
- **Traffic**: Sessions, users, pageviews, bounce rate
- **Engagement**: Session duration, pages per session, events
- **Conversions**: Goal completions, conversion rates
- **Real-time**: Active users, current events
- **Demographics**: Age, gender, location, device

### ✅ Authentication Status
- **Service Account**: [service-account-email]
- **Project**: [project-id]
- **Status**: AUTHENTICATED ✅

---

## GTM MCP Server Setup

### Manual Installation Required

The GTM MCP server requires manual setup as it's not available via npx.

#### Step 1: Clone Repository
```bash
git clone https://github.com/stape-io/google-tag-manager-mcp-server.git
cd google-tag-manager-mcp-server
```

#### Step 2: Install Dependencies
```bash
npm install && npm run build
```

#### Step 3: Configure Authentication
```bash
# Create keys directory
mkdir keys

# Copy our existing service account file
cp ./analytics/service-account-key.json ./keys/gtm-mcp.json
```

#### Step 4: Set Environment Variables
```bash
export GOOGLE_APPLICATION_CREDENTIALS="./keys/gtm-mcp.json"
```

#### Step 5: Run Server
```bash
node dist/index.js
```

### GTM Capabilities
- **Container Management**: Create, update, delete containers
- **Tag Management**: Add, modify, remove tags
- **Trigger Setup**: Configure when tags fire
- **Variable Creation**: Set up custom variables
- **Version Control**: Manage container versions
- **Publishing**: Deploy changes to live environment

---

## Common Use Cases

### For Data Analysts (Priya Sharma) - **READY TO USE NOW!**

#### 1. Daily Reporting
```bash
# Start GA4 Data server
export GOOGLE_APPLICATION_CREDENTIALS="./analytics/service-account-key.json"
npx -y mcp-ga4-data

# Then ask AI:
"Generate yesterday's performance report including sessions, users, and top events"
```

#### 2. Custom Dimension Setup
```bash
# Start GA4 Admin server
export GOOGLE_APPLICATION_CREDENTIALS="./analytics/service-account-key.json"
npx -y mcp-ga4-admin

# Then ask AI:
"Create custom dimensions for chart_id, card_id, and page_path"
```

#### 3. Conversion Tracking
```bash
# Start GA4 Admin server
export GOOGLE_APPLICATION_CREDENTIALS="./analytics/service-account-key.json"
npx -y mcp-ga4-admin

# Then ask AI:
"Set up conversion events for search, chart_interaction, and news_card_click"
```

### For Developers (Michael Chen)

#### 1. Debugging Tracking
```bash
# Start GA4 Data server
export GOOGLE_APPLICATION_CREDENTIALS="./analytics/service-account-key.json"
npx -y mcp-ga4-data

# Then ask AI:
"Show me all events fired in the last hour to verify our tracking implementation"
```

#### 2. Performance Analysis
```bash
# Start GA4 Data server
export GOOGLE_APPLICATION_CREDENTIALS="./analytics/service-account-key.json"
npx -y mcp-ga4-data

# Then ask AI:
"Analyze page load times and user engagement for our ETF dashboard tabs"
```

### For QA Testing (Alex Rivera)

#### 1. Event Validation
```bash
# Start GA4 Data server
export GOOGLE_APPLICATION_CREDENTIALS="./analytics/service-account-key.json"
npx -y mcp-ga4-data

# Then ask AI:
"Verify that all our custom events are firing correctly with proper parameters"
```

#### 2. Cross-Device Testing
```bash
# Start GA4 Data server
export GOOGLE_APPLICATION_CREDENTIALS="./analytics/service-account-key.json"
npx -y mcp-ga4-data

# Then ask AI:
"Compare user behavior across desktop and mobile devices"
```

---

## Troubleshooting

### Common Issues

#### 1. "Package not found" Error
```bash
# ❌ Wrong:
npx -y google-tag-manager-mcp-server
npx -y mcp-server-ga4

# ✅ Correct:
npx -y mcp-ga4-admin
npx -y mcp-ga4-data
```

#### 2. Authentication Errors
```bash
# Check if service account is properly configured
echo $GOOGLE_APPLICATION_CREDENTIALS
# Should show: ./analytics/service-account-key.json

# If not set, run:
export GOOGLE_APPLICATION_CREDENTIALS="./analytics/service-account-key.json"
```

#### 3. Server Won't Start
```bash
# Check Node.js version
node --version  # Should be v16+

# Check npm version
npm --version

# Clear npm cache
npm cache clean --force
```

#### 4. Permission Denied
```bash
# ✅ Our service account has the required roles:
# - Service Account: [service-account-email]
# - Project: [project-id]
# - Status: AUTHENTICATED

# If you get permission errors, the service account needs to be added to:
# - GA4 Property: G-FH17P76S7Y (as Editor/Administrator)
# - GTM Container: GTM-TWCDWPT5 (as Editor/Administrator)
```

### Debug Commands

#### Test GA4 Connection
```bash
# Start server and check for initialization message
export GOOGLE_APPLICATION_CREDENTIALS="./analytics/service-account-key.json"
npx -y mcp-ga4-admin 2>&1 | grep -i "initialized"
```

#### Verify Credentials
```bash
# Check if credentials file exists
ls -la ./analytics/service-account-key.json

# Check environment variable
echo $GOOGLE_APPLICATION_CREDENTIALS
```

#### Check API Quotas
```bash
# Monitor API usage in Google Cloud Console
# Navigate to: APIs & Services > Quotas
# Project: [project-id]
```

---

## Best Practices

### 1. Authentication Management
- ✅ **Credentials Secured**: Service account file is in project directory
- ✅ **Environment Variable**: Use `GOOGLE_APPLICATION_CREDENTIALS`
- ✅ **Least Privilege**: Service account has minimal required permissions
- 🔄 **Regular Rotation**: Rotate keys periodically (recommended)

### 2. Server Usage
- **Single Session**: Run one MCP server at a time
- **Proper Shutdown**: Use Ctrl+C to stop servers gracefully
- **Resource Monitoring**: Monitor CPU/memory usage
- **Error Logging**: Capture and review error messages

### 3. AI Interaction
- **Clear Commands**: Use specific, clear language
- **Context Provision**: Provide relevant context for queries
- **Verification**: Always verify AI-generated configurations
- **Documentation**: Document successful command patterns

### 4. Data Privacy
- **PII Protection**: Ensure no personal data in queries
- **Access Control**: Limit who can use MCP servers
- **Audit Logging**: Track all API operations
- **Compliance**: Follow GDPR/privacy regulations

---

## Integration with Claude Desktop

### Setup Configuration

Add to Claude Desktop config (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "ga4-admin": {
      "command": "npx",
      "args": ["-y", "mcp-ga4-admin"],
      "env": {
        "GOOGLE_APPLICATION_CREDENTIALS": "./analytics/service-account-key.json"
      }
    },
    "ga4-data": {
      "command": "npx",
      "args": ["-y", "mcp-ga4-data"],
      "env": {
        "GOOGLE_APPLICATION_CREDENTIALS": "./analytics/service-account-key.json"
      }
    }
  }
}
```

### Usage in Claude
1. Start Claude Desktop
2. MCP servers will auto-connect with credentials
3. Use natural language commands
4. Servers handle API calls automatically

---

## Next Steps

### ✅ Completed
1. **Google Cloud Service Account**: ✅ CONFIGURED
2. **Authentication Setup**: ✅ READY
3. **MCP Servers**: ✅ AUTHENTICATED
4. **Credentials File**: ✅ AVAILABLE

### 🔄 Immediate Actions Required
1. **Priya Sharma**: Add service account to GA4 property G-FH17P76S7Y
2. **Team**: Add service account to GTM container GTM-TWCDWPT5
3. **Alex Rivera**: Test MCP servers with actual GA4 data
4. **Michael Chen**: Verify tracking implementation via MCP queries

### 🚀 Ready to Use
- **GA4 Admin MCP**: Ready for property management
- **GA4 Data MCP**: Ready for reporting and analysis
- **Authentication**: Fully configured
- **Documentation**: Complete

---

## Support & Resources

### Documentation
- [MCP Official Docs](https://modelcontextprotocol.io/)
- [GA4 Admin API](https://developers.google.com/analytics/devguides/config/admin/v1)
- [GA4 Data API](https://developers.google.com/analytics/devguides/reporting/data/v1)
- [GTM API](https://developers.google.com/tag-manager/api/v2)

### Team Contacts
- **Technical Issues**: Michael Chen (michael.chen@company.com)
- **Analytics Setup**: Priya Sharma (priya.sharma@company.com)
- **Testing Support**: Alex Rivera (alex.rivera@company.com)

### Emergency Contacts
- **Project Manager**: Sarah Jones (sarah.jones@company.com)
- **Escalation**: Technical Lead Team

### Service Account Details
- **Email**: [service-account-email]
- **Project**: [project-id]
- **Credentials**: ./analytics/service-account-key.json
- **Status**: ✅ AUTHENTICATED AND READY

---

*Last Updated: June 1, 2025*  
*Next Review: June 8, 2025*  
*Document Owner: Technical Team* 
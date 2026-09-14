# 🚀 CloudBase AI Toolkit v2.3.0

## 🎉 What's New

### ✨ Features

* **New IDE Support**: 
  - **Google Antigravity**: Add full support for Google Antigravity IDE with workspace rules integration
  - **Qoder**: Add complete Qoder IDE support with MCP configuration and rules directory sync
  
* **Enhanced Rules Directory Sync**: 
  - Support rules directory synchronization for multiple IDEs (Antigravity, Qoder, Cursor, Trae, WindSurf, Cline)
  - Automatic `.md` to `.mdc` conversion for Cursor and Antigravity
  - Maintain directory structure and file relationships via hard links

* **Documentation UI Enhancements**:
  - Add card-style layout for templates and tutorials pages
  - Enhance IDE icon grid with better visual presentation
  - Improve user experience with modern UI components

* **VSCode Integration**:
  - Add one-click install support for VSCode
  - Rename Visual Studio Code to VSCode for consistency

* **CodeBuddy Improvements**:
  - Add CodeBuddy Code support
  - Fix CodeBuddy skills linking issues
  - Improve CodeBuddy manual configuration

### 🐛 Bug Fixes

* Fix IDE detection from environment variables
* Fix CodeBuddy skills linking
* Remove default test configurations
* Improve IDE selector documentation

### 🔧 Improvements

* Update CloudBase Manager Node to latest version
* Enhance setup tool with directory-based file mappings
* Improve hardlink script for better rules synchronization
* Refactor IDE selector component for better maintainability

### 📚 Documentation

* Add comprehensive setup guides for Antigravity and Qoder IDEs
* Update IDE configuration documentation
* Enhance user guides with better examples

---

## 📋 Full Changelog

**Full Changelog**: [v2.1.0...v2.3.0](https://github.com/TencentCloudBase/CloudBase-AI-ToolKit/compare/v2.1.0...v2.3.0)

---

## 🚀 Upgrade Guide

### Update MCP Tool

**Method 1: Auto Update (Recommended)**
In your AI development tool's MCP list, find cloudbase and re-enable or refresh the MCP list to automatically install the latest version.

**Method 2: Manual Update**
If auto-update doesn't work, disable and re-enable cloudbase, or restart your AI IDE.

**Method 3: Use Latest Version**

```json
{
  "mcpServers": {
    "cloudbase": {
      "command": "npx",
      "args": ["@cloudbase/cloudbase-mcp@latest"],
      "env": {
        "INTEGRATION_IDE": "YourIDE"
      }
    }
  }
}
```

### Update Project Rules

In your project, tell AI:

```
在当前项目中下载云开发 AI 规则，并强制覆盖
```

Or specify a specific IDE:

```
在当前项目中下载云开发 AI 规则，只包含 Cursor 配置，并强制覆盖
```

---

## 🙏 Acknowledgments

Thanks to all contributors who made this release possible!

Special thanks to the community for feedback and suggestions that help us continuously improve the toolkit.

---

## 📞 Get Help

* 📖 [Full Documentation](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit)
* 💬 [Community Discussions](https://github.com/TencentCloudBase/CloudBase-AI-ToolKit/discussions)
* 🐛 [Report Issues](https://github.com/TencentCloudBase/CloudBase-AI-ToolKit/issues)

---

**⭐ If this project helps you, please give us a Star!**










# @orchestro/init

> One-command installer for Orchestro - Your AI Development Conductor

## Usage

Install Orchestro globally with a single command:

```bash
npx @orchestro/init
```

This will:
1. ✅ Check prerequisites (Node.js 18+, Git, Claude Code)
2. 📦 Clone the latest Orchestro version
3. 📦 Install dependencies
4. 🔨 Build the TypeScript project
5. ⚙️  Create `.env` configuration
6. 🔧 Auto-configure Claude Code
7. 🗄️  Run database migrations
8. 🎉 Ready to use!

## Requirements

- **Node.js 18+**: [Download](https://nodejs.org/)
- **Git**: [Download](https://git-scm.com/)
- **Claude Code**: [Download](https://claude.ai/download)
- **Supabase Database**: [Create free project](https://supabase.com/)

## Interactive Prompts

The installer will ask you for:

1. **Installation directory** (default: `./orchestro`)
2. **Supabase Database URL** (pooler connection string)
3. **Project name** (default: "My Project")

## What Gets Configured

### 1. Orchestro Installation
- Clones latest version from GitHub
- Installs npm dependencies
- Builds TypeScript to `dist/`

### 2. Environment Configuration
- Creates `.env` file with your settings
- Stores database URL and project name

### 3. Claude Code Integration
- Adds Orchestro to `claude_desktop_config.json`
- Configures with absolute paths
- Preserves existing MCP servers

### 4. Database Setup
- Runs all required migrations
- Creates tables and triggers
- Initializes pattern tracking

## Platform Support

- ✅ macOS
- ✅ Windows
- ✅ Linux

Config paths auto-detected:
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%/Claude/claude_desktop_config.json`
- Linux: `~/.config/Claude/claude_desktop_config.json`

## Example Output

```bash
$ npx @orchestro/init

🎭 Orchestro Installation
   Your AI Development Conductor

🔍 Checking prerequisites...
✓ Node.js: v20.11.0
✓ Git: Installed
✓ Claude Code: Installed

📝 Configuration
? Where to install Orchestro? (./orchestro)
? Supabase Database URL (pooler connection): postgresql://...
? Project name: (My Project) My Awesome Project

📦 Installing Orchestro...
Cloning repository...
✓ Repository cloned
Installing dependencies...
✓ Dependencies installed
Building TypeScript...
✓ Build completed

⚙️  Creating .env file...
✓ .env file created

🔧 Configuring Claude Code...
✓ Claude Code configured

🗄️  Running database migrations...
✓ Migrations completed

============================================================
🎉 Orchestro installed successfully!
============================================================

📍 Installation location:
   /Users/you/orchestro

🚀 Next steps:
   1. Restart Claude Code
   2. Open your project in Claude Code
   3. Start using Orchestro tools!

📊 Optional: Start the dashboard
   cd orchestro
   npm run dashboard

🎭 Happy orchestrating!
```

## After Installation

1. **Restart Claude Code** to load the MCP server
2. **Open any project** in Claude Code
3. **Use Orchestro tools**:
   - `create_task` - Create new tasks
   - `decompose_story` - Break down user stories
   - `list_tasks` - View all tasks
   - `prepare_task_for_execution` - Get execution context
   - And 23 more tools!

## Troubleshooting

### "Claude Code config not found"
Install Claude Code first: https://claude.ai/download

### "Node.js 18+ required"
Update Node.js: https://nodejs.org/

### "Failed to clone repository"
Check your internet connection and Git installation

### "Migration failed"
You can run migrations manually later:
```bash
cd orchestro
npm run migrate
```

## Manual Installation

If you prefer manual setup:

```bash
git clone https://github.com/yourusername/orchestro.git
cd orchestro
npm install
npm run setup
```

## Links

- 📚 [Documentation](https://github.com/yourusername/orchestro)
- 🐛 [Issues](https://github.com/yourusername/orchestro/issues)
- 💬 [Discussions](https://github.com/yourusername/orchestro/discussions)

## License

MIT © Orchestro Team

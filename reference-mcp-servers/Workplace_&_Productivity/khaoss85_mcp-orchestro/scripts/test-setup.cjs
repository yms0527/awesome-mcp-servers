#!/usr/bin/env node

/**
 * Test Setup Script - Dry Run
 *
 * Tests the setup script without making changes
 */

const os = require('os');
const path = require('path');
const fs = require('fs');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  bright: '\x1b[1m',
};

function print(text, color = 'reset') {
  console.log(`${colors[color]}${text}${colors.reset}`);
}

function getClaudeConfigPath() {
  const platform = os.platform();
  const home = os.homedir();

  switch(platform) {
    case 'darwin':
      return path.join(home, 'Library', 'Application Support', 'Claude', 'claude_desktop_config.json');
    case 'win32':
      return path.join(process.env.APPDATA, 'Claude', 'claude_desktop_config.json');
    case 'linux':
      return path.join(home, '.config', 'Claude', 'claude_desktop_config.json');
    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }
}

print('\n🧪 Orchestro Setup Test', 'bright');
print('━'.repeat(50), 'bright');

print('\n📋 System Check:', 'blue');

// Check Node version
const nodeVersion = process.version;
print(`✓ Node.js: ${nodeVersion}`, nodeVersion.startsWith('v18') || nodeVersion.startsWith('v20') ? 'green' : 'yellow');

// Check platform
const platform = os.platform();
print(`✓ Platform: ${platform}`, 'green');

// Check Claude config location
const configPath = getClaudeConfigPath();
print(`\n📍 Claude Code Config:`, 'blue');
print(`   Path: ${configPath}`, 'yellow');

if (fs.existsSync(configPath)) {
  print(`   ✓ Exists: Yes`, 'green');
  try {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    print(`   ✓ Valid JSON: Yes`, 'green');

    if (config.mcpServers) {
      const servers = Object.keys(config.mcpServers);
      print(`   📦 MCP Servers: ${servers.length}`, 'blue');
      servers.forEach(s => print(`      • ${s}`, 'yellow'));
    }
  } catch (e) {
    print(`   ❌ Valid JSON: No (${e.message})`, 'red');
  }
} else {
  print(`   ⚠️  Exists: No (will be created)`, 'yellow');
}

// Check Orchestro build
print(`\n🔨 Orchestro Build:`, 'blue');
const distPath = path.join(process.cwd(), 'dist', 'server.js');
print(`   Path: ${distPath}`, 'yellow');

if (fs.existsSync(distPath)) {
  const stats = fs.statSync(distPath);
  print(`   ✓ Exists: Yes`, 'green');
  print(`   ✓ Size: ${(stats.size / 1024).toFixed(2)} KB`, 'green');
  print(`   ✓ Modified: ${stats.mtime.toLocaleString()}`, 'green');
} else {
  print(`   ❌ Exists: No`, 'red');
  print(`   Run: npm run build`, 'yellow');
}

// Check .env
print(`\n🔐 Environment:`, 'blue');
const envPath = path.join(process.cwd(), '.env');

if (fs.existsSync(envPath)) {
  print(`   ✓ .env exists`, 'green');
  const envContent = fs.readFileSync(envPath, 'utf8');

  const hasDbUrl = envContent.includes('DATABASE_URL=');
  const hasSupabaseUrl = envContent.includes('SUPABASE_URL=');

  print(`   ${hasDbUrl ? '✓' : '❌'} DATABASE_URL: ${hasDbUrl ? 'Set' : 'Missing'}`, hasDbUrl ? 'green' : 'red');
  print(`   ${hasSupabaseUrl ? '✓' : '❌'} SUPABASE_URL: ${hasSupabaseUrl ? 'Set' : 'Missing'}`, hasSupabaseUrl ? 'green' : 'red');
} else {
  print(`   ⚠️  .env not found (will be created)`, 'yellow');
}

// Check scripts
print(`\n📜 Scripts:`, 'blue');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

const requiredScripts = ['setup', 'configure-claude', 'migrate', 'dashboard'];
requiredScripts.forEach(script => {
  const exists = packageJson.scripts && packageJson.scripts[script];
  print(`   ${exists ? '✓' : '❌'} ${script}: ${exists ? 'Available' : 'Missing'}`, exists ? 'green' : 'red');
});

// Check migrations
print(`\n🗄️  Migrations:`, 'blue');
const migrationsPath = path.join(process.cwd(), 'src', 'db', 'migrations');

if (fs.existsSync(migrationsPath)) {
  const migrations = fs.readdirSync(migrationsPath).filter(f => f.endsWith('.sql')).sort();
  print(`   ✓ Found ${migrations.length} migrations`, 'green');
  migrations.slice(0, 3).forEach(m => print(`      • ${m}`, 'yellow'));
  if (migrations.length > 3) {
    print(`      ... and ${migrations.length - 3} more`, 'yellow');
  }
} else {
  print(`   ❌ Migrations folder not found`, 'red');
}

// Test summary
print('\n━'.repeat(50), 'bright');
print('\n✅ Test Complete!', 'green');

const distExists = fs.existsSync(distPath);
const hasEnv = fs.existsSync(envPath);

if (distExists && hasEnv) {
  print('\n🎉 Ready to run setup!', 'green');
  print('\nRun: npm run setup', 'blue');
} else if (distExists && !hasEnv) {
  print('\n⚠️  Build ready, but no .env file', 'yellow');
  print('\nRun: npm run setup (will create .env)', 'blue');
} else if (!distExists) {
  print('\n❌ Need to build first', 'red');
  print('\nRun: npm run build', 'yellow');
  print('Then: npm run setup', 'blue');
}

print('\n🧪 This was a dry-run. No changes were made.\n', 'bright');

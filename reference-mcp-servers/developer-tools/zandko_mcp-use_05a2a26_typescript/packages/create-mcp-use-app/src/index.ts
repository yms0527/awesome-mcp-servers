#!/usr/bin/env node

import { execSync } from 'node:child_process'
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createInterface } from 'node:readline'
import { Command } from 'commander'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const program = new Command()

const packageJson = JSON.parse(
  readFileSync(join(__dirname, '../package.json'), 'utf-8')
)

// Read current package versions from workspace
function getCurrentPackageVersions() {
  const versions: Record<string, string> = {}
  
  try {
    // Try multiple possible workspace root locations
    const possibleRoots = [
      resolve(__dirname, '../../../..'), // From dist/templates
      resolve(__dirname, '../../../../..'), // From dist
      resolve(process.cwd(), '.'), // Current working directory
      resolve(process.cwd(), '..'), // Parent of current directory
    ]
    
    let workspaceRoot = null
    for (const root of possibleRoots) {
      if (existsSync(join(root, 'packages/mcp-use/package.json'))) {
        workspaceRoot = root
        break
      }
    }
    
    if (!workspaceRoot) {
      throw new Error('Workspace root not found')
    }
    
    // Read mcp-use version
    const mcpUsePackage = JSON.parse(
      readFileSync(join(workspaceRoot, 'packages/mcp-use/package.json'), 'utf-8')
    )
    versions['mcp-use'] = mcpUsePackage.version
    
    // Read cli version
    const cliPackage = JSON.parse(
      readFileSync(join(workspaceRoot, 'packages/cli/package.json'), 'utf-8')
    )
    versions['@mcp-use/cli'] = cliPackage.version
    
    // Read inspector version
    const inspectorPackage = JSON.parse(
      readFileSync(join(workspaceRoot, 'packages/inspector/package.json'), 'utf-8')
    )
    versions['@mcp-use/inspector'] = inspectorPackage.version
  } catch (error) {
    console.warn('⚠️  Could not read workspace package versions, using defaults')
    console.warn(`   Error: ${error}`)
  }
  
  return versions
}

// Process template files to replace version placeholders
function processTemplateFile(filePath: string, versions: Record<string, string>, isDevelopment: boolean = false) {
  const content = readFileSync(filePath, 'utf-8')
  let processedContent = content
  
  // Replace version placeholders with current versions
  for (const [packageName, version] of Object.entries(versions)) {
    const placeholder = `{{${packageName}_version}}`
    const versionPrefix = isDevelopment ? 'workspace:*' : `^${version}`
    processedContent = processedContent.replace(new RegExp(placeholder, 'g'), versionPrefix)
  }
  
  // Handle workspace dependencies based on mode
  if (isDevelopment) {
    // Keep workspace dependencies for development
    processedContent = processedContent.replace(/"mcp-use": "\^[^"]+"/, '"mcp-use": "workspace:*"')
    processedContent = processedContent.replace(/"@mcp-use\/cli": "\^[^"]+"/, '"@mcp-use/cli": "workspace:*"')
    processedContent = processedContent.replace(/"@mcp-use\/inspector": "\^[^"]+"/, '"@mcp-use/inspector": "workspace:*"')
  } else {
    // Replace workspace dependencies with specific versions for production
    processedContent = processedContent.replace(/"mcp-use": "workspace:\*"/, `"mcp-use": "^${versions['mcp-use'] || '1.0.0'}"`)
    processedContent = processedContent.replace(/"@mcp-use\/cli": "workspace:\*"/, `"@mcp-use/cli": "^${versions['@mcp-use/cli'] || '2.0.0'}"`)
    processedContent = processedContent.replace(/"@mcp-use\/inspector": "workspace:\*"/, `"@mcp-use/inspector": "^${versions['@mcp-use/inspector'] || '0.3.0'}"`)
  }
  
  return processedContent
}

program
  .name('create-mcp-use-app')
  .description('Create a new MCP server project')
  .version(packageJson.version)
  .argument('[project-name]', 'Name of the MCP server project')
  .option('-t, --template <template>', 'Template to use', 'ui')
  .option('--no-install', 'Skip installing dependencies')
  .option('--dev', 'Use workspace dependencies for development')
  .action(async (projectName: string | undefined, options: { template: string, install: boolean, dev: boolean }) => {
    try {
      // If no project name provided, prompt for it
      if (!projectName) {
        console.log('🎯 Welcome to create-mcp-use-app!')
        console.log('')
        
        const promptedName = await promptForProjectName()
        
        if (!promptedName) {
          console.log('❌ Project creation cancelled.')
          process.exit(0)
        }
        
        projectName = promptedName
      }

      console.log(`🚀 Creating MCP server "${projectName}"...`)

      const projectPath = resolve(process.cwd(), projectName!)

      // Check if directory already exists
      if (existsSync(projectPath)) {
        console.error(`❌ Directory "${projectName}" already exists!`)
        process.exit(1)
      }

      // Create project directory
      mkdirSync(projectPath, { recursive: true })

      // Get current package versions
      const versions = getCurrentPackageVersions()
      
      // Copy template files
      await copyTemplate(projectPath, options.template, versions, options.dev)

      // Update package.json with project name
      updatePackageJson(projectPath, projectName!)

      // Install dependencies if requested
      if (options.install) {
        console.log('📦 Installing dependencies...')
        try {
          execSync('pnpm install', { cwd: projectPath, stdio: 'inherit' })
        }
        catch {
          console.log('⚠️  pnpm not found, trying npm...')
          try {
            execSync('npm install', { cwd: projectPath, stdio: 'inherit' })
          }
          catch {
            console.log('⚠️  npm install failed, please run "npm install" manually')
          }
        }
      }

      console.log('✅ MCP server created successfully!')
      if (options.dev) {
        console.log('🔧 Development mode: Using workspace dependencies')
      }
      console.log('')
      console.log('📁 Project structure:')
      console.log(`   ${projectName}/`)
      if (options.template === 'ui') {
        console.log('   ├── src/')
        console.log('   │   └── server.ts')
        console.log('   ├── resources/')
        console.log('   │   ├── data-visualization.tsx')
        console.log('   │   ├── kanban-board.tsx')
        console.log('   │   └── todo-list.tsx')
        console.log('   ├── index.ts')
        console.log('   ├── package.json')
        console.log('   ├── tsconfig.json')
        console.log('   └── README.md')
      } else {
        console.log('   ├── src/')
        console.log('   │   └── server.ts')
        console.log('   ├── package.json')
        console.log('   ├── tsconfig.json')
        console.log('   └── README.md')
      }
      console.log('')
      console.log('🚀 To get started:')
      console.log(`   cd ${projectName!}`)
      if (!options.install) {
        console.log('   npm install')
      }
      console.log('   npm run dev')
      console.log('')
      if (options.dev) {
        console.log('💡 Development mode: Your project uses workspace dependencies')
        console.log('   Make sure you\'re in the mcp-use workspace root for development')
      }
      console.log('📚 Learn more: https://docs.mcp-use.io')
    }
    catch (error) {
      console.error('❌ Error creating MCP server:', error)
      process.exit(1)
    }
  })

async function copyTemplate(projectPath: string, template: string, versions: Record<string, string>, isDevelopment: boolean = false) {
  const templatePath = join(__dirname, 'templates', template)

  if (!existsSync(templatePath)) {
    console.error(`❌ Template "${template}" not found!`)
    
    // Dynamically list available templates
    const templatesDir = join(__dirname, 'templates')
    if (existsSync(templatesDir)) {
      const availableTemplates = readdirSync(templatesDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)
        .sort()
      
      console.log(`Available templates: ${availableTemplates.join(', ')}`)
    } else {
      console.log('No templates directory found')
    }
    
    console.log('💡 Tip: Use "ui" template for React components and modern UI features')
    console.log('💡 Tip: Use "uiresource" template for UI resources and advanced server examples')
    process.exit(1)
  }

  copyDirectoryWithProcessing(templatePath, projectPath, versions, isDevelopment)
}

function copyDirectoryWithProcessing(src: string, dest: string, versions: Record<string, string>, isDevelopment: boolean) {
  const entries = readdirSync(src, { withFileTypes: true })

  for (const entry of entries) {
    const srcPath = join(src, entry.name)
    const destPath = join(dest, entry.name)

    if (entry.isDirectory()) {
      mkdirSync(destPath, { recursive: true })
      copyDirectoryWithProcessing(srcPath, destPath, versions, isDevelopment)
    }
    else {
      // Process files that might contain version placeholders
      if (entry.name === 'package.json' || entry.name.endsWith('.json')) {
        const processedContent = processTemplateFile(srcPath, versions, isDevelopment)
        writeFileSync(destPath, processedContent)
      } else {
        copyFileSync(srcPath, destPath)
      }
    }
  }
}


function updatePackageJson(projectPath: string, projectName: string) {
  const packageJsonPath = join(projectPath, 'package.json')
  const packageJsonContent = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))

  packageJsonContent.name = projectName
  packageJsonContent.description = `MCP server: ${projectName}`

  writeFileSync(packageJsonPath, JSON.stringify(packageJsonContent, null, 2))
}

function promptForProjectName(): Promise<string | null> {
  return new Promise((resolvePromise) => {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout
    })

    const askForName = () => {
      rl.question('What is your project name? ', (answer) => {
        const trimmed = answer.trim()
        
        if (!trimmed) {
          console.log('❌ Project name is required')
          askForName()
          return
        }
        
        if (!/^[a-zA-Z0-9-_]+$/.test(trimmed)) {
          console.log('❌ Project name can only contain letters, numbers, hyphens, and underscores')
          askForName()
          return
        }
        
        if (existsSync(join(process.cwd(), trimmed))) {
          console.log(`❌ Directory "${trimmed}" already exists! Please choose a different name.`)
          askForName()
          return
        }
        
        rl.close()
        resolvePromise(trimmed)
      })
    }
    
    askForName()
  })
}

program.parse()


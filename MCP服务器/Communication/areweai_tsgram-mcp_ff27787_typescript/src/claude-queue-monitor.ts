#!/usr/bin/env node

/**
 * CLAUDE QUEUE MONITOR
 * 
 * This monitors the message queue and processes Telegram messages
 * in the current Claude Code session.
 * 
 * Usage in Claude Code:
 * 1. Run the telegram queue: npm run telegram-queue start
 * 2. Monitor messages: npm run claude-monitor
 */

import fs from 'fs/promises'
import { existsSync, watchFile } from 'fs'
import path from 'path'
import readline from 'readline'
import { CLITelegramBridge } from './cli-telegram-bridge.js'
import { INCOMING_QUEUE, OUTGOING_QUEUE, QueueMessage } from './telegram-claude-queue.js'

class ClaudeQueueMonitor {
  private processedMessages: Set<string> = new Set()
  private telegramBridge: CLITelegramBridge
  private isMonitoring: boolean = false
  private rl: readline.Interface

  constructor() {
    this.telegramBridge = new CLITelegramBridge()
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })
  }

  /**
   * START MONITORING QUEUE
   */
  async start() {
    console.log('🔍 Claude Queue Monitor Started')
    console.log('📁 Monitoring:', INCOMING_QUEUE)
    console.log('📤 Responses go to:', OUTGOING_QUEUE)
    console.log('\n⚡ Telegram messages will appear below:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

    this.isMonitoring = true

    // Check queue file exists
    if (!existsSync(INCOMING_QUEUE)) {
      console.error('❌ Queue not found. Run: npm run telegram-queue start')
      return
    }

    // Initial read
    await this.processNewMessages()

    // Watch for changes
    watchFile(INCOMING_QUEUE, { interval: 1000 }, async () => {
      if (this.isMonitoring) {
        await this.processNewMessages()
      }
    })

    // Keep process alive
    await new Promise(() => {})
  }

  /**
   * PROCESS NEW MESSAGES
   */
  private async processNewMessages() {
    try {
      const content = await fs.readFile(INCOMING_QUEUE, 'utf-8')
      const lines = content.trim().split('\n').filter(line => line)

      for (const line of lines) {
        try {
          const message: QueueMessage = JSON.parse(line)
          
          if (!this.processedMessages.has(message.id) && 
              message.type === 'telegram_in' && 
              !message.processed) {
            
            this.processedMessages.add(message.id)
            await this.handleTelegramMessage(message)
          }
        } catch (error) {
          // Skip invalid lines
        }
      }
    } catch (error) {
      // File might be empty or locked
    }
  }

  /**
   * HANDLE TELEGRAM MESSAGE
   */
  private async handleTelegramMessage(message: QueueMessage) {
    console.log(`\n📨 [@${message.username}]: ${message.message}`)
    console.log(`⏰ ${new Date(message.timestamp).toLocaleTimeString()}`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

    // Check for special commands
    if (message.message.startsWith('/')) {
      await this.handleCommand(message)
      return
    }

    // For regular messages, prompt for response
    console.log('\n💭 How would you like to respond?')
    console.log('(Type your response or "skip" to ignore)\n')

    this.rl.question('> ', async (response) => {
      if (response.toLowerCase() !== 'skip' && response.trim()) {
        await this.sendResponse(message, response)
      }
    })
  }

  /**
   * HANDLE SPECIAL COMMANDS
   */
  private async handleCommand(message: QueueMessage) {
    const command = message.message.split(' ')[0]
    const args = message.message.substring(command.length).trim()

    switch (command) {
      case '/exec':
        // Execute command in current directory
        console.log(`\n⚡ Execute command: ${args}`)
        console.log('⚠️  This would execute in the current directory')
        console.log('For safety, commands must be run manually\n')
        await this.sendResponse(message, `Command noted: \`${args}\`\nPlease execute manually in Claude Code.`)
        break

      case '/status':
        // Show current status
        const status = `🤖 Claude Queue Monitor Active
📁 Working Directory: ${process.cwd()}
📊 Messages Processed: ${this.processedMessages.size}
⏰ Time: ${new Date().toLocaleTimeString()}`
        await this.sendResponse(message, status)
        break

      case '/help':
        // Show help
        const help = `📚 **Available Commands:**
/exec <command> - Request command execution
/status - Show monitor status
/help - Show this help message

Regular messages will prompt for a response.`
        await this.sendResponse(message, help)
        break

      default:
        await this.sendResponse(message, `Unknown command: ${command}`)
    }
  }

  /**
   * SEND RESPONSE TO TELEGRAM
   */
  private async sendResponse(originalMessage: QueueMessage, response: string) {
    const outgoingMessage: QueueMessage = {
      id: `resp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      type: 'claude_out',
      chatId: originalMessage.chatId,
      username: originalMessage.username,
      message: response,
      processed: false
    }

    // Append to outgoing queue
    const line = JSON.stringify(outgoingMessage) + '\n'
    await fs.appendFile(OUTGOING_QUEUE, line)
    
    console.log('\n✅ Response queued for delivery')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
  }

  /**
   * STOP MONITORING
   */
  stop() {
    this.isMonitoring = false
    this.rl.close()
    console.log('\n👋 Monitor stopped')
  }
}

// Main
async function main() {
  const monitor = new ClaudeQueueMonitor()
  
  // Handle shutdown
  process.on('SIGINT', () => {
    monitor.stop()
    process.exit(0)
  })
  
  await monitor.start()
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error)
}
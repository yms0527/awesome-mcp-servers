#!/usr/bin/env node

import { AlienVaultService } from '../services/alienvault.js';
import { ToolHandlers } from '../handlers/tools.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

interface QueryTestCase {
  name: string;
  description: string;
  query: string;
  language: 'SQL' | 'PPL';
  category: string;
  expectedValid: boolean;
  shouldExecute: boolean;
  expectedResultStructure?: {
    minRows?: number;
    maxRows?: number;
    requiredColumns?: string[];
  };
}

class AdvancedQueryValidator {
  private service: AlienVaultService;
  private handlers: ToolHandlers;
  private testResults: Array<{ test: string; passed: boolean; error?: string; executionTime?: number }> = [];

  constructor() {
    const clientId = process.env.ALIENVAULT_CLIENT_ID;
    const clientSecret = process.env.ALIENVAULT_CLIENT_SECRET;
    const subdomain = process.env.ALIENVAULT_SUBDOMAIN;

    if (!clientId || !clientSecret || !subdomain) {
      throw new Error('Missing required environment variables. Please check your .env file.');
    }

    this.service = new AlienVaultService(clientId, clientSecret, subdomain);
    this.handlers = new ToolHandlers(this.service);
  }

  private getTestQueries(): QueryTestCase[] {
    return [
      // Basic SQL Tests
      {
        name: 'Basic Security Event Query',
        description: 'Simple SELECT query for security events',
        query: 'SELECT message.event_name, message.source_address FROM logs WHERE message.source_country != \'US\' LIMIT 10',
        language: 'SQL',
        category: 'basic',
        expectedValid: true,
        shouldExecute: true,
        expectedResultStructure: {
          maxRows: 10,
          requiredColumns: ['message.event_name', 'message.source_address']
        }
      },
      {
        name: 'Failed Login Detection',
        description: 'Detect failed login attempts',
        query: 'SELECT message.source_address, COUNT(*) as failed_attempts FROM logs WHERE UPPER(message.event_name) LIKE UPPER(\'%login%\') AND UPPER(message.event_name) LIKE UPPER(\'%fail%\') GROUP BY message.source_address HAVING COUNT(*) > 5 ORDER BY failed_attempts DESC LIMIT 20',
        language: 'SQL',
        category: 'security',
        expectedValid: true,
        shouldExecute: true,
        expectedResultStructure: {
          maxRows: 20,
          requiredColumns: ['message.source_address', 'count(*)']
        }
      },
      {
        name: 'Geographic Anomaly Detection',
        description: 'Find events from non-US sources',
        query: 'SELECT message.event_name, message.source_address, message.source_country FROM logs WHERE message.source_country != \'US\' AND UPPER(message.event_name) LIKE UPPER(\'%login%\') LIMIT 25',
        language: 'SQL',
        category: 'security',
        expectedValid: true,
        shouldExecute: true,
        expectedResultStructure: {
          maxRows: 25,
          requiredColumns: ['message.event_name', 'message.source_address', 'message.source_country']
        }
      },
      // PPL Tests
      {
        name: 'Basic PPL Log Analysis',
        description: 'Simple PPL query for log analysis',
        query: 'search source=logs | where message.source_country!="US" | fields message.event_name, message.source_address | head 10',
        language: 'PPL',
        category: 'basic',
        expectedValid: true,
        shouldExecute: false, // PPL has JSON encoding issues - syntax validation only
        expectedResultStructure: {
          maxRows: 10
        }
      },
      {
        name: 'PPL Failed Login Analysis',
        description: 'PPL query for failed login analysis',
        query: 'search source=logs | where match(message.event_name, ".*login.*") | stats count() by message.source_address | where count > 3 | sort - count | head 15',
        language: 'PPL',
        category: 'security',
        expectedValid: true,
        shouldExecute: false, // PPL has JSON encoding issues - syntax validation only
        expectedResultStructure: {
          maxRows: 15
        }
      },
      // Invalid Query Tests
      {
        name: 'Invalid SQL - Missing FROM',
        description: 'SQL query without FROM clause should fail validation',
        query: 'SELECT message.event_name WHERE message.priority = \'high\'',
        language: 'SQL',
        category: 'validation',
        expectedValid: false,
        shouldExecute: false
      },
      {
        name: 'Invalid PPL - Missing Source',
        description: 'PPL query without source should fail validation',
        query: 'search | where message.priority="high"',
        language: 'PPL',
        category: 'validation',
        expectedValid: false,
        shouldExecute: false
      },
      {
        name: 'Security Risk - DROP Statement',
        description: 'SQL with DROP statement should be rejected',
        query: 'SELECT * FROM logs; DROP TABLE logs;',
        language: 'SQL',
        category: 'security',
        expectedValid: false,
        shouldExecute: false
      }
    ];
  }

  async testAuthentication(): Promise<boolean> {
    console.log('🔐 Testing API authentication...');
    try {
      const isConnected = await this.service.testConnection();
      if (isConnected) {
        console.log('✅ Authentication successful');
        return true;
      } else {
        console.log('❌ Authentication failed');
        return false;
      }
    } catch (error) {
      console.log(`❌ Authentication error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return false;
    }
  }

  async validateQuerySyntax(testCase: QueryTestCase): Promise<boolean> {
    console.log(`🔍 Validating syntax: ${testCase.name}`);
    const startTime = Date.now();
    
    try {
      const validation = await this.service.validateQuerySyntax(testCase.query, testCase.language);
      const executionTime = Date.now() - startTime;
      
      const passed = validation.is_valid === testCase.expectedValid;
      
      console.log(`   ${passed ? '✅' : '❌'} Expected valid: ${testCase.expectedValid}, Got: ${validation.is_valid}`);
      if (validation.errors.length > 0) {
        console.log(`   Errors: ${validation.errors.map(e => e.message).join(', ')}`);
      }
      if (validation.warnings.length > 0) {
        console.log(`   Warnings: ${validation.warnings.map(w => w.message).join(', ')}`);
      }
      
      this.testResults.push({
        test: `Syntax: ${testCase.name}`,
        passed,
        executionTime,
        error: passed ? undefined : `Expected ${testCase.expectedValid}, got ${validation.is_valid}`
      });
      
      return passed;
    } catch (error) {
      const executionTime = Date.now() - startTime;
      console.log(`   ❌ Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      this.testResults.push({
        test: `Syntax: ${testCase.name}`,
        passed: false,
        executionTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      return false;
    }
  }

  async executeQuery(testCase: QueryTestCase): Promise<boolean> {
    if (!testCase.shouldExecute) {
      console.log(`⏭️  Skipping execution: ${testCase.name} (not meant to be executed)`);
      return true;
    }

    console.log(`🚀 Executing query: ${testCase.name}`);
    const startTime = Date.now();
    
    try {
      // Get tenant ID (this might need to be configured)
      let tenantId: string;
      try {
        tenantId = this.service.getTenantIdFromSubdomain();
      } catch (error) {
        console.log(`   ⚠️  Could not get tenant ID: ${error instanceof Error ? error.message : 'Unknown error'}`);
        console.log('   Please set ALIENVAULT_TENANT_URI or TENANT_ID environment variable');
        return false;
      }

      const result = await this.service.executeAdvancedQuery({
        tenantId,
        queryString: testCase.query,
        queryLanguage: testCase.language,
        page: 1,
        pageSize: testCase.expectedResultStructure?.maxRows || 20,
        includePerformance: true
      });
      
      const executionTime = Date.now() - startTime;
      
      // Validate result structure
      let structureValid = true;
      const structureErrors: string[] = [];
      
      if (testCase.expectedResultStructure) {
        const { minRows, maxRows, requiredColumns } = testCase.expectedResultStructure;
        
        if (minRows && result.size < minRows) {
          structureValid = false;
          structureErrors.push(`Expected at least ${minRows} rows, got ${result.size}`);
        }
        
        if (maxRows && result.size > maxRows) {
          structureValid = false;
          structureErrors.push(`Expected at most ${maxRows} rows, got ${result.size}`);
        }
        
        if (requiredColumns) {
          const returnedColumns = result.schema.map(col => col.name);
          const missingColumns = requiredColumns.filter(col => !returnedColumns.includes(col));
          if (missingColumns.length > 0) {
            structureValid = false;
            structureErrors.push(`Missing columns: ${missingColumns.join(', ')}`);
          }
        }
      }
      
      console.log(`   ✅ Query executed successfully`);
      console.log(`   📊 Results: ${result.total} total, ${result.size} returned`);
      console.log(`   ⏱️  Execution time: ${executionTime}ms`);
      
      if ('performance' in result && result.performance) {
        console.log(`   🎯 Query complexity: ${result.performance.query_complexity}`);
      }
      
      if (!structureValid) {
        console.log(`   ⚠️  Structure validation failed: ${structureErrors.join(', ')}`);
      }
      
      this.testResults.push({
        test: `Execution: ${testCase.name}`,
        passed: structureValid,
        executionTime,
        error: structureValid ? undefined : structureErrors.join(', ')
      });
      
      return structureValid;
    } catch (error) {
      const executionTime = Date.now() - startTime;
      console.log(`   ❌ Execution error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      this.testResults.push({
        test: `Execution: ${testCase.name}`,
        passed: false,
        executionTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      return false;
    }
  }

  async testQueryExamples(): Promise<boolean> {
    console.log('📚 Testing query examples retrieval...');
    const startTime = Date.now();
    
    try {
      const examples = await this.handlers.callTool({
        params: {
          name: 'get_query_examples',
          arguments: {
            category: 'security',
            query_language: 'SQL',
            difficulty: 'beginner'
          }
        }
      });
      
      const executionTime = Date.now() - startTime;
      
      if (examples.content && examples.content[0] && examples.content[0].text) {
        const exampleData = JSON.parse(examples.content[0].text);
        const hasExamples = exampleData.examples && exampleData.examples.length > 0;
        
        console.log(`   ${hasExamples ? '✅' : '❌'} Retrieved ${exampleData.examples?.length || 0} examples`);
        
        this.testResults.push({
          test: 'Query Examples Retrieval',
          passed: hasExamples,
          executionTime,
          error: hasExamples ? undefined : 'No examples returned'
        });
        
        return hasExamples;
      } else {
        console.log('   ❌ Invalid response format');
        this.testResults.push({
          test: 'Query Examples Retrieval',
          passed: false,
          executionTime,
          error: 'Invalid response format'
        });
        return false;
      }
    } catch (error) {
      const executionTime = Date.now() - startTime;
      console.log(`   ❌ Error retrieving examples: ${error instanceof Error ? error.message : 'Unknown error'}`);
      this.testResults.push({
        test: 'Query Examples Retrieval',
        passed: false,
        executionTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      return false;
    }
  }

  async runAllTests(): Promise<void> {
    console.log('🧪 Starting Advanced Query Validation Tests\n');
    
    // Test authentication first
    const authSuccess = await this.testAuthentication();
    if (!authSuccess) {
      console.log('\n❌ Authentication failed. Cannot proceed with query tests.');
      return;
    }
    
    console.log('');
    
    // Test query examples
    await this.testQueryExamples();
    console.log('');
    
    // Get test cases
    const testQueries = this.getTestQueries();
    
    // Run syntax validation tests
    console.log('🔍 Running syntax validation tests...\n');
    for (const testCase of testQueries) {
      await this.validateQuerySyntax(testCase);
      console.log('');
    }
    
    // Run execution tests (only for valid queries that should execute)
    console.log('🚀 Running query execution tests...\n');
    const executionTests = testQueries.filter(tc => tc.shouldExecute && tc.expectedValid);
    
    for (const testCase of executionTests) {
      await this.executeQuery(testCase);
      console.log('');
    }
    
    // Print summary
    this.printTestSummary();
  }

  private printTestSummary(): void {
    console.log('📋 Test Summary');
    console.log('='.repeat(50));
    
    const passed = this.testResults.filter(r => r.passed).length;
    const total = this.testResults.length;
    const passRate = ((passed / total) * 100).toFixed(1);
    
    console.log(`Total Tests: ${total}`);
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${total - passed}`);
    console.log(`Pass Rate: ${passRate}%`);
    console.log('');
    
    // Show failed tests
    const failedTests = this.testResults.filter(r => !r.passed);
    if (failedTests.length > 0) {
      console.log('❌ Failed Tests:');
      failedTests.forEach(test => {
        console.log(`  - ${test.test}: ${test.error || 'Unknown error'}`);
      });
      console.log('');
    }
    
    // Show performance summary
    const avgExecutionTime = this.testResults
      .filter(r => r.executionTime !== undefined)
      .reduce((sum, r) => sum + (r.executionTime || 0), 0) / this.testResults.length;
    
    console.log(`Average Execution Time: ${avgExecutionTime.toFixed(0)}ms`);
    
    if (parseFloat(passRate) >= 80) {
      console.log('🎉 Advanced Query system is functioning well!');
    } else {
      console.log('⚠️  Advanced Query system needs attention.');
    }
  }
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const validator = new AdvancedQueryValidator();
  validator.runAllTests().catch(error => {
    console.error('Test execution failed:', error);
    process.exit(1);
  });
}

export { AdvancedQueryValidator };
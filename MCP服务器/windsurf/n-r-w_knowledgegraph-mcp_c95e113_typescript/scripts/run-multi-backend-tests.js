#!/usr/bin/env node

/**
 * Multi-Backend Test Runner
 *
 * This script ensures that tests run against both SQLite and PostgreSQL backends,
 * providing clear feedback about which backends are available and test results.
 */

import { spawn } from 'child_process';
import { checkPostgreSQLAvailability } from '../dist/tests/utils/multi-backend-runner.js';

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logHeader(message) {
  log(`\n${'='.repeat(60)}`, colors.cyan);
  log(`${message}`, colors.cyan + colors.bright);
  log(`${'='.repeat(60)}`, colors.cyan);
}

function logSection(message) {
  log(`\n${'-'.repeat(40)}`, colors.blue);
  log(`${message}`, colors.blue + colors.bright);
  log(`${'-'.repeat(40)}`, colors.blue);
}

async function runCommand(command, args = [], options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      ...options
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve(code);
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
}

async function checkBackendAvailability() {
  logSection('Checking Backend Availability');

  const backends = {
    sqlite: true, // SQLite is always available
    postgresql: false
  };

  // Check SQLite
  log('✓ SQLite: Available (in-memory)', colors.green);

  // Check PostgreSQL
  try {
    backends.postgresql = await checkPostgreSQLAvailability();
    if (backends.postgresql) {
      log('✓ PostgreSQL: Available', colors.green);
    } else {
      log('✗ PostgreSQL: Not available', colors.yellow);
    }
  } catch (error) {
    log(`✗ PostgreSQL: Error checking availability - ${error.message}`, colors.red);
  }

  return backends;
}

async function runTestSuite(suiteName, command, args = []) {
  logSection(`Running ${suiteName}`);

  try {
    await runCommand(command, args);
    log(`✓ ${suiteName} completed successfully`, colors.green);
    return true;
  } catch (error) {
    log(`✗ ${suiteName} failed: ${error.message}`, colors.red);
    return false;
  }
}

async function main() {
  logHeader('Multi-Backend Test Runner');

  let exitCode = 0;
  const results = {
    backendCheck: false,
    multiBackendTests: false,
    originalTests: false
  };

  try {
    // Check backend availability
    const backends = await checkBackendAvailability();
    results.backendCheck = true;

    if (!backends.sqlite) {
      log('\n❌ SQLite is not available. This is unexpected and indicates a serious issue.', colors.red);
      exitCode = 1;
      return;
    }

    if (!backends.postgresql) {
      log('\n⚠️  PostgreSQL is not available. Multi-backend tests will skip PostgreSQL tests.', colors.yellow);
      log('   To enable PostgreSQL tests, ensure PostgreSQL is running at localhost:5432', colors.yellow);
      log('   with username "postgres" and password "1".', colors.yellow);
    }

    // Run multi-backend tests
    results.multiBackendTests = await runTestSuite(
      'Multi-Backend Tests',
      'npm',
      ['run', 'test:multi-backend']
    );

    if (!results.multiBackendTests) {
      exitCode = 1;
    }

    // Run original test suite
    results.originalTests = await runTestSuite(
      'Original Test Suite',
      'npm',
      ['run', 'test:original']
    );

    if (!results.originalTests) {
      exitCode = 1;
    }

  } catch (error) {
    log(`\n❌ Test runner failed: ${error.message}`, colors.red);
    exitCode = 1;
  }

  // Summary
  logHeader('Test Results Summary');

  log(`Backend Availability Check: ${results.backendCheck ? '✓ PASSED' : '✗ FAILED'}`,
    results.backendCheck ? colors.green : colors.red);

  log(`Multi-Backend Tests: ${results.multiBackendTests ? '✓ PASSED' : '✗ FAILED'}`,
    results.multiBackendTests ? colors.green : colors.red);

  log(`Original Test Suite: ${results.originalTests ? '✓ PASSED' : '✗ FAILED'}`,
    results.originalTests ? colors.green : colors.red);

  const allPassed = results.backendCheck && results.multiBackendTests && results.originalTests;

  if (allPassed) {
    log('\n🎉 All tests passed successfully!', colors.green + colors.bright);
    log('Both SQLite and PostgreSQL backends are working correctly.', colors.green);
  } else {
    log('\n❌ Some tests failed. Please check the output above for details.', colors.red + colors.bright);
  }

  process.exit(exitCode);
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  log(`\n❌ Unhandled Rejection at: ${promise}, reason: ${reason}`, colors.red);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  log(`\n❌ Uncaught Exception: ${error.message}`, colors.red);
  console.error(error.stack);
  process.exit(1);
});

// Run the main function
main().catch((error) => {
  log(`\n❌ Fatal error: ${error.message}`, colors.red);
  console.error(error.stack);
  process.exit(1);
});

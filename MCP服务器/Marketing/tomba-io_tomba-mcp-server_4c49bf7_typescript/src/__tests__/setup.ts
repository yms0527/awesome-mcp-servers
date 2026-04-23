// Jest setup file
import { jest } from "@jest/globals";

// Mock environment variables
process.env.TOMBA_API_KEY = "test_api_key";
process.env.TOMBA_SECRET_KEY = "test_secret_key";

// Global test timeout
jest.setTimeout(30000);

// Mock console.error to avoid noise in tests
global.console = {
  ...console,
  error: jest.fn(),
};

export {};

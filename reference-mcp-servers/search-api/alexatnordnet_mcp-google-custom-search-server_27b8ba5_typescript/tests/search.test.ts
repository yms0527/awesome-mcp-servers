import { jest } from '@jest/globals';
import { z } from 'zod';
import { customsearch } from '@googleapis/customsearch';
import { EnvSchema, formatSearchResults, SearchArgumentsSchema } from '../src/index.js';

// Mock the Google Custom Search API
jest.mock('@googleapis/customsearch', () => ({
  customsearch: jest.fn(),
}));

describe('Google Custom Search functions', () => {
  // Reset environment variables before each test
  const originalEnv = process.env;
  
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
    process.env.GOOGLE_API_KEY = 'test-api-key';
    process.env.GOOGLE_SEARCH_ENGINE_ID = 'test-search-engine-id';
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('Environment validation', () => {
    it('should throw an error when environment variables are missing', () => {
      delete process.env.GOOGLE_API_KEY;
      delete process.env.GOOGLE_SEARCH_ENGINE_ID;

      const result = EnvSchema.safeParse(process.env);
      expect(result.success).toBe(false);
    });

    it('should validate when environment variables are present', () => {
      const result = EnvSchema.safeParse(process.env);
      expect(result.success).toBe(true);
    });
  });

  describe('Search function', () => {
    it('should format search results correctly', async () => {
      const mockResults = {
        items: [
          {
            title: 'Test Title',
            link: 'https://example.com',
            snippet: 'Test Description'
          }
        ]
      };

      const formatted = formatSearchResults(mockResults);
      expect(formatted).toContain('Test Title');
      expect(formatted).toContain('https://example.com');
      expect(formatted).toContain('Test Description');
    });

    it('should handle empty search results', async () => {
      const mockResults = {
        items: []
      };

      const formatted = formatSearchResults(mockResults);
      expect(formatted).toBe('No results found.');
    });

    it('should handle missing items in results', async () => {
      const mockResults = {};

      const formatted = formatSearchResults(mockResults);
      expect(formatted).toBe('No results found.');
    });

    it('should include country header when country is specified', async () => {
      const mockResults = {
        items: [
          {
            title: 'Test Title',
            link: 'https://example.com',
            snippet: 'Test Description'
          }
        ]
      };

      const formatted = formatSearchResults(mockResults, 'us');
      expect(formatted).toContain('Search results for region: US');
      expect(formatted).toContain('Test Title');
    });

    it('should not include country header when country is not specified', async () => {
      const mockResults = {
        items: [
          {
            title: 'Test Title',
            link: 'https://example.com',
            snippet: 'Test Description'
          }
        ]
      };

      const formatted = formatSearchResults(mockResults);
      expect(formatted).not.toContain('Search results for region:');
    });
  });

  describe('SearchArgumentsSchema', () => {
    it('should accept valid country codes', () => {
      const result = SearchArgumentsSchema.parse({
        query: 'test',
        country: 'us'
      });
      expect(result.country).toBe('us');
    });

    it('should accept queries without country', () => {
      const result = SearchArgumentsSchema.parse({
        query: 'test'
      });
      expect(result.country).toBeUndefined();
    });

    it('should accept various country codes', () => {
      const countryCodes = ['us', 'gb', 'au', 'de', 'fr', 'jp'];
      countryCodes.forEach(code => {
        const result = SearchArgumentsSchema.parse({
          query: 'test',
          country: code
        });
        expect(result.country).toBe(code);
      });
    });
  });
});
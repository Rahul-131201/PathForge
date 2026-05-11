import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { validateEnvironment, getEnv } from '@/server/config';

describe('Environment Configuration', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('validateEnvironment', () => {
    it('should throw when required variables are missing', () => {
      // Clear required env vars
      delete process.env.DATABASE_URL;
      delete process.env.AUTH_SECRET;
      delete process.env.AUTH_URL;
      delete process.env.NEXT_PUBLIC_APP_URL;
      delete process.env.GROQ_API_KEY;
      delete process.env.GOOGLE_GENERATIVE_AI_API_KEY;

      expect(() => {
        validateEnvironment();
      }).toThrow();
    });

    it('should throw when no AI API is configured', () => {
      process.env.DATABASE_URL = 'postgresql://test';
      process.env.AUTH_SECRET = 'a'.repeat(32);
      process.env.AUTH_URL = 'http://localhost:3000';
      process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';
      delete process.env.GROQ_API_KEY;
      delete process.env.GOOGLE_GENERATIVE_AI_API_KEY;

      expect(() => {
        validateEnvironment();
      }).toThrow();
    });

    it('should pass when required variables are set', () => {
      process.env.DATABASE_URL = 'postgresql://test';
      process.env.AUTH_SECRET = 'a'.repeat(32);
      process.env.AUTH_URL = 'http://localhost:3000';
      process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';
      process.env.GROQ_API_KEY = 'test-key';

      expect(() => {
        validateEnvironment();
      }).not.toThrow();
    });

    it('should accept Gemini as primary AI provider', () => {
      process.env.DATABASE_URL = 'postgresql://test';
      process.env.AUTH_SECRET = 'a'.repeat(32);
      process.env.AUTH_URL = 'http://localhost:3000';
      process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';
      process.env.GOOGLE_GENERATIVE_AI_API_KEY = 'test-key';
      delete process.env.GROQ_API_KEY;

      expect(() => {
        validateEnvironment();
      }).not.toThrow();
    });

    it('should validate AUTH_SECRET minimum length', () => {
      process.env.DATABASE_URL = 'postgresql://test';
      process.env.AUTH_SECRET = 'short'; // Less than 32 chars
      process.env.AUTH_URL = 'http://localhost:3000';
      process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';
      process.env.GROQ_API_KEY = 'test-key';

      expect(() => {
        validateEnvironment();
      }).toThrow();
    });

    it('should validate URLs are valid', () => {
      process.env.DATABASE_URL = 'not-a-url';
      process.env.AUTH_SECRET = 'a'.repeat(32);
      process.env.AUTH_URL = 'http://localhost:3000';
      process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';
      process.env.GROQ_API_KEY = 'test-key';

      expect(() => {
        validateEnvironment();
      }).toThrow();
    });
  });

  describe('getEnv', () => {
    it('should return validated environment variables', () => {
      process.env.DATABASE_URL = 'postgresql://test';
      process.env.AUTH_SECRET = 'a'.repeat(32);
      process.env.AUTH_URL = 'http://localhost:3000';
      process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';
      process.env.GROQ_API_KEY = 'test-groq-key';
      process.env.NEXT_PUBLIC_APP_NAME = 'TestApp';

      const env = getEnv();
      expect(env.DATABASE_URL).toBe('postgresql://test');
      expect(env.GROQ_API_KEY).toBe('test-groq-key');
      expect(env.NEXT_PUBLIC_APP_NAME).toBe('TestApp');
    });

    it('should use default values when not provided', () => {
      process.env.DATABASE_URL = 'postgresql://test';
      process.env.AUTH_SECRET = 'a'.repeat(32);
      process.env.AUTH_URL = 'http://localhost:3000';
      process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';
      process.env.GROQ_API_KEY = 'test-key';
      delete process.env.NEXT_PUBLIC_APP_NAME;

      const env = getEnv();
      expect(env.NEXT_PUBLIC_APP_NAME).toBe('PathForge');
    });
  });
});

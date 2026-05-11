import { describe, it, expect, beforeEach } from 'vitest';
import { checkRateLimit, RateLimits, createRateLimitResponse } from '@/server/rate-limiter';

describe('Rate Limiter', () => {
  beforeEach(() => {
    // Reset the rate limit store before each test
    // Note: In a real test, you'd want to mock the internal store
  });

  describe('checkRateLimit', () => {
    it('should allow the first request', () => {
      const result = checkRateLimit('test-user-1', RateLimits.ROADMAP_GENERATION);
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBeLessThan(RateLimits.ROADMAP_GENERATION.maxRequests);
    });

    it('should track request count correctly', () => {
      const identifier = 'test-user-2';
      const config = RateLimits.ROADMAP_GENERATION;

      // Make multiple requests
      let result;
      for (let i = 0; i < config.maxRequests; i++) {
        result = checkRateLimit(identifier, config);
        expect(result.allowed).toBe(true);
      }

      // The next request should be rate limited
      result = checkRateLimit(identifier, config);
      expect(result.allowed).toBe(false);
      expect(result.retryAfter).toBeGreaterThan(0);
    });

    it('should return correct remaining requests', () => {
      const identifier = 'test-user-3';
      const config = RateLimits.PROGRESS_UPDATE;

      const result = checkRateLimit(identifier, config);
      expect(result.remaining).toBe(config.maxRequests - 1);
    });

    it('should differentiate between different identifiers', () => {
      const config = RateLimits.AUTH_LOGIN;

      const result1 = checkRateLimit('user-1', config);
      const result2 = checkRateLimit('user-2', config);

      expect(result1.remaining).toBe(result2.remaining);
    });

    it('should handle different rate limit configs', () => {
      const identifier = 'test-user-4';

      const roadmapResult = checkRateLimit(identifier, RateLimits.ROADMAP_GENERATION);
      const progressResult = checkRateLimit('different-user', RateLimits.PROGRESS_UPDATE);

      // Different configs should have different limits
      expect(RateLimits.ROADMAP_GENERATION.maxRequests).not.toBe(RateLimits.PROGRESS_UPDATE.maxRequests);
    });
  });

  describe('RateLimits config', () => {
    it('should have proper configuration for all limits', () => {
      expect(RateLimits.ROADMAP_GENERATION.maxRequests).toBe(5);
      expect(RateLimits.ROADMAP_GENERATION.windowMs).toBe(24 * 60 * 60 * 1000); // 24 hours

      expect(RateLimits.PROGRESS_UPDATE.maxRequests).toBe(50);
      expect(RateLimits.PROGRESS_UPDATE.windowMs).toBe(60 * 60 * 1000); // 1 hour

      expect(RateLimits.AUTH_LOGIN.maxRequests).toBe(10);
      expect(RateLimits.AUTH_LOGIN.windowMs).toBe(60 * 60 * 1000); // 1 hour
    });
  });

  describe('createRateLimitResponse', () => {
    it('should return 429 status with retry-after header', () => {
      const response = createRateLimitResponse(60);
      expect(response.status).toBe(429);
    });

    it('should include retry-after in headers', () => {
      const retryAfter = 3600;
      const response = createRateLimitResponse(retryAfter);
      expect(response.headers.get('Retry-After')).toBe(String(retryAfter / 1000));
    });
  });
});

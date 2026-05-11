import { NextResponse } from "next/server";

// ─── Rate Limiter Types ───────────────────────────────────────────────────────

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number; // milliseconds
}

interface RateLimitStore {
  [key: string]: { count: number; resetTime: number };
}

// ─── In-Memory Rate Limit Store ───────────────────────────────────────────────

const rateLimitStore: RateLimitStore = {};

// Cleanup old entries every 5 minutes
if (typeof window === "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const key in rateLimitStore) {
      if (rateLimitStore[key].resetTime < now) {
        delete rateLimitStore[key];
      }
    }
  }, 5 * 60 * 1000);
}

// ─── Rate Limiting Function ───────────────────────────────────────────────────

export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): { allowed: boolean; remaining: number; retryAfter: number } {
  const now = Date.now();
  const key = `ratelimit:${identifier}`;

  if (!rateLimitStore[key]) {
    rateLimitStore[key] = {
      count: 1,
      resetTime: now + config.windowMs,
    };
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      retryAfter: 0,
    };
  }

  const record = rateLimitStore[key];

  // Reset if window expired
  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + config.windowMs;
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      retryAfter: 0,
    };
  }

  // Check if limit exceeded
  if (record.count >= config.maxRequests) {
    const retryAfter = Math.ceil((record.resetTime - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      retryAfter,
    };
  }

  // Increment counter
  record.count++;
  const remaining = config.maxRequests - record.count;
  return {
    allowed: true,
    remaining,
    retryAfter: 0,
  };
}

// ─── Rate Limit Response Handler ───────────────────────────────────────────────

export function createRateLimitResponse(retryAfter: number) {
  return NextResponse.json(
    {
      error: "Too many requests",
      message: "Rate limit exceeded. Please try again later.",
    },
    {
      status: 429,
      headers: {
        "Retry-After": retryAfter.toString(),
        "X-RateLimit-Limit": "10",
        "X-RateLimit-Remaining": "0",
        "X-RateLimit-Reset": new Date(Date.now() + retryAfter * 1000).toISOString(),
      },
    }
  );
}

// ─── Common Rate Limit Configurations ──────────────────────────────────────────

export const RateLimits = {
  // API generation: 5 per 24 hours (existing, stricter)
  ROADMAP_GENERATION: {
    maxRequests: 5,
    windowMs: 24 * 60 * 60 * 1000,
  },

  // API progress updates: 50 per hour
  PROGRESS_UPDATE: {
    maxRequests: 50,
    windowMs: 60 * 60 * 1000,
  },

  // Explore search: 100 per hour
  EXPLORE_SEARCH: {
    maxRequests: 100,
    windowMs: 60 * 60 * 1000,
  },

  // Auth register: 5 per hour per IP
  AUTH_REGISTER: {
    maxRequests: 5,
    windowMs: 60 * 60 * 1000,
  },

  // Auth login: 10 per hour per IP
  AUTH_LOGIN: {
    maxRequests: 10,
    windowMs: 60 * 60 * 1000,
  },
};

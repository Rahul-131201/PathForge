import { createClient, RedisClientType } from 'redis';

// ─── Redis Client Singleton ───────────────────────────────────────────────────

let redisClient: RedisClientType | null = null;

export async function getRedisClient(): Promise<RedisClientType | null> {
  // Return null if Redis URL is not configured
  if (!process.env.REDIS_URL) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️  REDIS_URL not configured. Caching disabled. Set REDIS_URL to enable Redis caching.');
    }
    return null;
  }

  // Return existing client if already initialized
  if (redisClient) {
    return redisClient;
  }

  try {
    redisClient = createClient({
      url: process.env.REDIS_URL,
      socket: {
        reconnectStrategy: (retries) => Math.min(retries * 50, 500),
      },
    });

    redisClient.on('error', (err) => {
      console.error('Redis Client Error', err);
    });

    redisClient.on('connect', () => {
      console.log('✓ Redis connected');
    });

    await redisClient.connect();
    return redisClient;
  } catch (error) {
    console.error('Failed to initialize Redis:', error);
    redisClient = null;
    return null;
  }
}

// ─── Cache Key Helpers ────────────────────────────────────────────────────────

export function getCacheKey(prefix: string, identifier: string): string {
  return `${prefix}:${identifier}`;
}

export const CacheKeys = {
  ROADMAP: (roadmapId: string) => getCacheKey('roadmap', roadmapId),
  USER_ROADMAPS: (userId: string) => getCacheKey('user_roadmaps', userId),
  EXPLORE_RESULTS: (query: string) => getCacheKey('explore', query),
  USER_PROGRESS: (userId: string) => getCacheKey('user_progress', userId),
  DASHBOARD_DATA: (userId: string) => getCacheKey('dashboard', userId),
};

// ─── Cache Operations ─────────────────────────────────────────────────────────

export interface CacheOptions {
  ttl?: number; // Time to live in seconds
  prefix?: string;
}

/**
 * Get value from cache
 */
export async function getCached<T>(key: string): Promise<T | null> {
  const client = await getRedisClient();
  if (!client) return null;

  try {
    const value = await client.get(key);
    if (!value) return null;
    return JSON.parse(value) as T;
  } catch (error) {
    console.error(`Cache GET error for key ${key}:`, error);
    return null;
  }
}

/**
 * Set value in cache
 */
export async function setCached<T>(
  key: string,
  value: T,
  options: CacheOptions = {}
): Promise<void> {
  const client = await getRedisClient();
  if (!client) return;

  try {
    const ttl = options.ttl || 3600; // Default 1 hour
    await client.setEx(key, ttl, JSON.stringify(value));
  } catch (error) {
    console.error(`Cache SET error for key ${key}:`, error);
  }
}

/**
 * Delete value from cache
 */
export async function deleteCached(key: string): Promise<void> {
  const client = await getRedisClient();
  if (!client) return;

  try {
    await client.del(key);
  } catch (error) {
    console.error(`Cache DELETE error for key ${key}:`, error);
  }
}

/**
 * Clear all cache keys matching a pattern
 */
export async function clearCachePattern(pattern: string): Promise<void> {
  const client = await getRedisClient();
  if (!client) return;

  try {
    const keys = await client.keys(pattern);
    if (keys.length > 0) {
      await client.del(keys);
    }
  } catch (error) {
    console.error(`Cache CLEAR error for pattern ${pattern}:`, error);
  }
}

/**
 * Invalidate user-related caches
 */
export async function invalidateUserCache(userId: string): Promise<void> {
  await Promise.all([
    deleteCached(CacheKeys.USER_ROADMAPS(userId)),
    deleteCached(CacheKeys.USER_PROGRESS(userId)),
    deleteCached(CacheKeys.DASHBOARD_DATA(userId)),
  ]);
}

/**
 * Invalidate roadmap cache
 */
export async function invalidateRoadmapCache(roadmapId: string): Promise<void> {
  await deleteCached(CacheKeys.ROADMAP(roadmapId));
}

/**
 * Invalidate explore cache (all search results)
 */
export async function invalidateExploreCache(): Promise<void> {
  await clearCachePattern('explore:*');
}

// ─── Cache-Aside Pattern Helper ────────────────────────────────────────────────

/**
 * Get or set value with cache-aside pattern
 * @param key Cache key
 * @param fetcher Function to fetch value if not in cache
 * @param ttl Cache TTL in seconds
 */
export async function getCachedOrFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl?: number
): Promise<T> {
  // Try to get from cache first
  const cached = await getCached<T>(key);
  if (cached !== null) {
    return cached;
  }

  // Fetch if not in cache
  const value = await fetcher();

  // Store in cache
  await setCached(key, value, { ttl });

  return value;
}

export async function closeRedis(): Promise<void> {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
  }
}

⚡ Phase 13 (Optional): High-Performance Caching (Redis)
---

## 🎯 Phase Objective

Establish a centralized, in-memory caching layer using **Redis**. By decoupling heavy read queries from the primary database (MongoDB), we decrease response times from milliseconds to sub-milliseconds. We enforce the **Cache-Aside Pattern** to keep stale data out, and we transition our security rate limiters to a distributed Redis store so limits remain synchronized even behind a multi-instance load balancer.

---

## 📦 1. Core Dependency Installation

- **Type:** Optional Expansion
- **Action:** Run these commands to install the modern Redis client and the Redis store adapter for our Express rate limiter. *(Note: The modern `redis` v4+ package includes native TypeScript definitions out of the box).*

```bash
# Install the official Redis client and the distributed rate limiter store
npm install redis rate-limit-redis
```

---

## 🔌 2. The Fail-Fast Redis Connector (`src/config/redis.ts`)

- **Type:** App-Specific Expansion
- **Action:** Create `src/config/redis.ts` to connect to your Redis cluster.

Just like our MongoDB Singleton, this configuration attaches lifecycle event listeners to track connection health and fails fast if credentials are missing.

```tsx
import { createClient } from 'redis';
import { logger } from './logger'; // Utilizes our Phase 9 Pino logger

// 1. Initialize the client type
export type RedisClient = ReturnType<typeof createClient>;

const getRedisUrl = (): string => {
  const url = process.env.REDIS_URL;
  if (!url) {
    logger.error('❌ CRITICAL: REDIS_URL is missing from environment variables.');
    throw new Error('Caching features are disabled due to missing configuration.');
  }
  return url;
};

// 2. Instantiate the client
export const redisClient = createClient({ url: getRedisUrl() });

// 3. Attach asynchronous lifecycle monitors
redisClient.on('connect', () => logger.info('⚡ Redis connection established successfully.'));
redisClient.on('error', (err) => logger.error({ err }, '❌ Redis Runtime Error detected.'));
redisClient.on('reconnecting', () => logger.warn('⚠️ Redis client is attempting to reconnect...'));

// 4. Export the startup bootstrapper
export const connectRedis = async (): Promise<void> => {
  try {
    await redisClient.connect();
  } catch (error: any) {
    logger.fatal({ err: error }, '❌ Initial Redis connection failed to boot.');
    process.exit(1); // Kill the container if vital caching infrastructure fails
  }
};
```

---

## 🧠 3. The Cache-Aside Service (`src/services/cache.service.ts`)

- **Type:** Universal Core for Caching
- **Action:** Create `src/services/cache.service.ts`.

This service acts as a safe wrapper around raw Redis commands. It enforces the **Cache-Aside Pattern**: always read from cache first; if missing, fetch from the database, save to cache with a mandatory Time-To-Live (TTL) expiration, and return the payload.

```tsx
import { redisClient } from '../config/redis';
import { logger } from '../config/logger';

// Default TTL expiration set to 1 hour (in seconds) if not explicitly provided
const DEFAULT_TTL = 3600; 

export const cacheService = {
  /**
   * Retrieves a parsed JSON payload from the cache.
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await redisClient.get(key);
      if (!data) return null;
      
      return JSON.parse(data) as T;
    } catch (error) {
      // Fail-safe: If Redis crashes, log the error but return null so the app falls back to MongoDB gracefully
      logger.error({ err: error, key }, 'Redis GET failure. Falling back to primary database.');
      return null;
    }
  },

  /**
   * Stores an object in the cache as a serialized JSON string with a mandatory TTL.
   */
  async set(key: string, value: any, ttlSeconds: number = DEFAULT_TTL): Promise<void> {
    try {
      const serializedValue = JSON.stringify(value);
      // 'EX' tells Redis to expire the key after the specified amount of seconds
      await redisClient.set(key, serializedValue, { EX: ttlSeconds });
    } catch (error) {
      logger.error({ err: error, key }, 'Redis SET failure.');
    }
  },

  /**
   * Invalidates a specific cached key (used immediately when data updates or deletes).
   */
  async del(key: string): Promise<void> {
    try {
      await redisClient.del(key);
    } catch (error) {
      logger.error({ err: error, key }, 'Redis DEL failure.');
    }
  },
};
```

---

## 🛡️ 4. Upgrading to Distributed Rate Limiting (`src/config/security.ts`)

- **Type:** Universal Baseline Updates (Upgrades Phase 8)
- **Action:** Open your existing `src/config/security.ts` file and inject the **RedisStore adapter**.

This ensures that if a malicious script hits 5 different containers in your cluster, their request counts are globally tallied in memory.

```tsx
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { redisClient } from './redis'; // <-- Import the configured client

// ==========================================
// UPGRADED GLOBAL DISTRIBUTED RATE LIMITER
// ==========================================
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 100, 
  standardHeaders: true,
  legacyHeaders: false,
  
  // Back the rate limiter with our centralized Redis instance
  store: new RedisStore({
    // @ts-expect-error - Known type mismatch between rate-limit-redis and modern redis client commands
    sendCommand: (...args: string[]) => redisClient.sendCommand(args),
  }),

  message: {
    status: 'error',
    message: '⚠️ Too many requests originating from this IP. Please try again after 15 minutes.',
  },
});
```

---

## 🚦 5. Blueprint: Caching Controller Integration

- **Type:** App-Specific Implementation Blueprint
- **Action:** Here is exactly how you integrate the Cache-Aside wrapper directly into a read-heavy feature endpoint (e.g., retrieving a frequently accessed user profile or public links).

```tsx
import { Request, Response } from 'express';
import { cacheService } from '../services/cache.service';
import { User } from '../models/user.model';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';

export const getUserProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.params.id;
  const cacheKey = `user:profile:${userId}`;

  // ==========================================
  // 1. CHECK CACHE FIRST (Sub-millisecond read)
  // ==========================================
  const cachedProfile = await cacheService.get(cacheKey);
  
  if (cachedProfile) {
    res.status(200).json({
      status: 'success',
      source: 'cache', // Transparently audit the payload source
      data: cachedProfile,
    });
    return;
  }

  // ==========================================
  // 2. FALLBACK TO DATABASE (Cache Miss)
  // ==========================================
  const user = await User.findById(userId).select('-passwordHash');
  if (!user) throw new AppError('User profile not found.', 404);

  const profileData = user.toObject();

  // ==========================================
  // 3. POPULATE CACHE FOR SUBSEQUENT READS
  // ==========================================
  // Cache this specific user profile for 10 minutes (600 seconds)
  await cacheService.set(cacheKey, profileData, 600);

  res.status(200).json({
    status: 'success',
    source: 'database',
    data: profileData,
  });
});
```

> **⚠️ Cache Invalidation Rule:** If you write a `updateUserProfile` controller, you must explicitly call `await cacheService.del(cacheKey)` right after saving the database updates to prevent users from seeing old cached data!
> 

---

## 🔗 6. Wiring Redis into the Server Boot (`src/server.ts`)

Open `src/server.ts` and ensure Redis connects alongside MongoDB before opening your HTTP ports.

```tsx
import app from './app';
import connectDB from './config/db';
import { connectRedis } from './config/redis'; // <-- 1. Import Redis bootstrapper
import { logger } from './config/logger';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    logger.info('⏳ Initializing infrastructure connections...');
    
    // Boot persistent database first
    await connectDB();
    
    // Boot in-memory cache second
    await connectRedis(); // <-- 2. Await Redis connection

    app.listen(PORT, () => {
      logger.info(`🚀 Server successfully booted on port ${PORT}`);
    });

  } catch (error) {
    logger.fatal({ err: error }, '❌ Critical failure during server startup.');
    process.exit(1);
  }
};

startServer();
```

---

## 🔒 7. Environment Variables Update (`.env`)

Append your active Redis URI to your local `.env` and `.env.example` files:

```
# Caching & Distributed Storage
REDIS_URL=redis://127.0.0.1:6379
```

---

## 🔍 Next Steps Checklist

- [ ]  Create the new page under your "📦 Advanced & Optional Modules" Notion section and paste this template.
- [ ]  Install `redis` and `rate-limit-redis` via NPM.
- [ ]  Add the `REDIS_URL` configuration key to your `.env` file.
- [ ]  Create `src/config/redis.ts` and `src/services/cache.service.ts`.
- [ ]  Upgrade your Phase 8 rate limiter inside `security.ts` to utilize the Redis backing store.
- [ ]  Update `src/server.ts` to boot Redis during startup.
- [ ]  Test the integration: Hit an endpoint twice. Verify via the JSON response that the first read states `source: "database"` and the second read states `source: "cache"`.

---
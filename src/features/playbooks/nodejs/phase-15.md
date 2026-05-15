🔄 Phase 15 (Optional): Real-Time Communication (Socket.io)
---

## 🎯 Phase Objective

Establish secure, event-driven, real-time communication between the server and connected clients. We implement **Socket.io** with a strict architectural perimeter:

1. **Handshake Security:** Intercepts the initial HTTP upgrade request, verifying the user's JWT before establishing a persistent WebSocket connection.
2. **Strongly-Typed Dictionaries:** Enforces strict interfaces for incoming and outgoing payloads to completely eliminate silent transport mismatches.
3. **Targeted Room Orchestration:** Automatically subscribes authenticated sockets to private, user-specific rooms (`user:${userId}`), allowing decoupled controllers or background workers to push targeted live notifications statelessly.

---

## 📦 1. Core Dependency Installation

- **Type:** Optional Expansion
- **Action:** Run these commands to install Socket.io and the Redis Adapter.

> **💡 Enterprise Scaling Note:** If you deploy multiple instances of your API behind a load balancer, standard WebSockets will fail to broadcast across instances. We install the official `@socket.io/redis-adapter` to route events seamlessly through our existing Phase 13 Redis cluster.
> 

```bash
# Install Socket.io core and the distributed Redis adapter
npm install socket.io @socket.io/redis-adapter
```

*(Note: Socket.io v4+ includes comprehensive native TypeScript definitions out of the box).*

---

## 🗂️ 2. Strongly-Typed Event Dictionaries (`src/types/socket.types.ts`)

- **Type:** Universal Core for WebSockets
- **Action:** Create `src/types/socket.types.ts`.

Never use plain strings for event names. Defining explicit payload structures guarantees complete compile-time safety across your entire event stream.

```tsx
import { ITokenPayload } from '../utils/jwt'; // Phase 7 Payload Interface

// ==========================================
// 1. OUTGOING EVENTS (Server -> Client)
// ==========================================
export interface ServerToClientEvents {
  'notification:info': (payload: { message: string; timestamp: string }) => void;
  'link:processing:complete': (payload: { linkId: string; title: string; url: string }) => void;
  'link:processing:failed': (payload: { linkId: string; error: string }) => void;
}

// ==========================================
// 2. INCOMING EVENTS (Client -> Server)
// ==========================================
export interface ClientToServerEvents {
  'client:ping': () => void;
  // Placeholder for future bidirectional interactions (e.g., joining dynamic dashboard rooms)
  // 'room:join': (payload: { targetId: string }) => void;
}

// ==========================================
// 3. INTERNAL SERVER EVENTS & SOCKET DATA
// ==========================================
export interface InterServerEvents {
  ping: () => void;
}

// Defines exactly what secure context is attached to each individual socket instance
export interface SocketData {
  user: ITokenPayload;
}
```

---

## 🎛️ 3. The Secure Socket Orchestrator (`src/config/socket.ts`)

- **Type:** Universal Core for WebSockets
- **Action:** Create `src/config/socket.ts`.

This module initializes the Socket.io server, applies our strict CORS parameters, binds the Redis adapter, and enforces authentication interceptors *before* granting connection access.

```tsx
import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { redisClient } from './redis'; // Phase 13 Redis Client
import { verifyToken } from '../utils/jwt'; // Phase 7 Auth Utility
import { logger } from './logger';
import { getCorsOptions } from './security'; // Phase 8 CORS Whitelist

import {
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  SocketData,
} from '../types/socket.types';

// Export the strongly-typed server instance type
export type TypedSocketServer = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

let io: TypedSocketServer | null = null;

export const initializeSocketServer = async (httpServer: HttpServer): Promise<TypedSocketServer> => {
  // 1. Instantiate the Socket.io server with strict production CORS options
  io = new Server(httpServer, {
    cors: getCorsOptions(),
    path: '/socket.io', // Standard base path
  });

  // 2. Bind the Redis Adapter for horizontal scalability
  try {
    // Duplicate existing clients specifically for the adapter's pub/sub channels
    const pubClient = redisClient.duplicate();
    const subClient = redisClient.duplicate();
    await Promise.all([pubClient.connect(), subClient.connect()]);
    
    io.adapter(createAdapter(pubClient, subClient));
    logger.info('⚡ Socket.io Redis Adapter successfully bound.');
  } catch (error) {
    logger.error({ err: error }, '❌ Failed to bind Socket.io Redis Adapter. Running in standalone mode.');
  }

  // ==========================================
  // 3. HANDSHAKE AUTHENTICATION INTERCEPTOR
  // ==========================================
  io.use((socket, next) => {
    // Extract the token from either the HTTP authorization header or query string parameters
    const authHeader = socket.handshake.headers.authorization;
    const queryToken = socket.handshake.auth?.token;

    let token = '';
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (queryToken) {
      token = queryToken;
    }

    if (!token) {
      return next(new Error('Authentication error: Valid Bearer token required for connection upgrade.'));
    }

    try {
      // Cryptographically verify the token and attach the payload to socket.data
      const decoded = verifyToken(token);
      socket.data.user = decoded;
      next();
    } catch (error) {
      next(new Error('Authentication error: Token is invalid or expired.'));
    }
  });

  // ==========================================
  // 4. CONNECTION & ROOM ORCHESTRATION
  // ==========================================
  io.on('connection', (socket) => {
    const userId = socket.data.user?.id;
    const userRoom = `user:${userId}`;

    // Automatically subscribe the socket to its private user room
    socket.join(userRoom);
    logger.info(`🔗 Socket connected [ID: ${socket.id}] - Subscribed to room [${userRoom}]`);

    // Standard ping/pong listener for connectivity verification
    socket.on('client:ping', () => {
      socket.emit('notification:info', {
        message: 'pong',
        timestamp: new Date().toISOString(),
      });
    });

    socket.on('disconnect', (reason) => {
      logger.info(`🔌 Socket disconnected [ID: ${socket.id}] - Reason: ${reason}`);
    });
  });

  return io;
};

// Stateless getter to retrieve the initialized server instance anywhere in the application
export const getSocketServer = (): TypedSocketServer => {
  if (!io) {
    throw new Error('❌ CRITICAL: Socket server has not been initialized yet.');
  }
  return io;
};
```

---

## 🔗 4. Binding WebSockets to the Network Server (`src/server.ts`)

- **Type:** Universal Baseline Updates
- **Action:** Open `src/server.ts`.

Notice the architectural elegance: `src/app.ts` remains entirely unaware of WebSockets. We wrap the raw HTTP server with our Socket orchestrator strictly inside the networking entry point.

```tsx
import { createServer } from 'http'; // <-- 1. Import native HTTP server
import app from './app';
import connectDB from './config/db';
import { connectRedis } from './config/redis';
import { initializeSocketServer } from './config/socket'; // <-- 2. Import Socket initializer
import { logger } from './config/logger';
import { linkWorker } from './workers/link.worker';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    logger.info('⏳ Initializing infrastructure connections...');
    
    await connectDB();
    await connectRedis();

    // ==========================================
    // DECOUPLED NETWORK BINDING
    // ==========================================
    // 1. Wrap the Express application inside a native Node HTTP Server
    const httpServer = createServer(app);

    // 2. Bind the strongly-typed Socket.io orchestrator to the HTTP Server
    logger.info('⏳ Initializing real-time WebSocket layer...');
    await initializeSocketServer(httpServer);

    // Boot background workers (Phase 14)
    linkWorker.run();

    // 3. Listen on the wrapped httpServer instead of app.listen()
    httpServer.listen(PORT, () => {
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

## 📤 5. Blueprint: Pushing Real-Time Events from Workers

- **Type:** App-Specific Implementation Blueprint
- **Action:** Here is exactly how your decoupled background workers (or standard controllers) retrieve the socket server and broadcast live notifications to specific user rooms.

Open `src/workers/link.worker.ts` (created in Phase 14) and inject real-time feedback:

```tsx
import { Worker, Job } from 'bullmq';
import { getQueueConnection } from '../config/queue';
import { logger } from '../config/logger';
import { getSocketServer } from '../config/socket'; // <-- 1. Import stateless socket getter

import { ILinkMetadataJob } from '../services/queue/producer.service';

export const linkWorker = new Worker(
  'link-processing',
  async (job: Job<ILinkMetadataJob>) => {
    const { linkId, url } = job.data;
    // Note: In real applications, job payloads should also pass along the owning userId
    const mockUserId = 'user_12345'; 

    logger.info(`⚙️ [Worker] Processing job ${job.id} - Scraping URL: ${url}`);

    try {
      // Execute slow metadata scraping logic...
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const scrapedTitle = 'LinkNote Master Playbook Documentation';

      // ==========================================
      // PUSH TARGETED REAL-TIME SUCCESS EVENT
      // ==========================================
      const io = getSocketServer();
      
      // Emit strictly to the private room belonging to the owner of this link
      io.to(`user:${mockUserId}`).emit('link:processing:complete', {
        linkId,
        title: scrapedTitle,
        url,
      });

      logger.info(`✅ [Worker] Pushed complete notification for Link ID: ${linkId}`);
    } catch (error: any) {
      // Push real-time failure notification to the client
      const io = getSocketServer();
      io.to(`user:${mockUserId}`).emit('link:processing:failed', {
        linkId,
        error: error.message || 'Failed to extract metadata from target URL.',
      });
      
      throw error; // Re-throw to trigger BullMQ's automatic retry backoff
    }
  },
  { connection: getQueueConnection(), concurrency: 5, autorun: false }
);
```

---

## 🔍 Next Steps Checklist

- [ ]  Create the new nested page under your "📦 Advanced & Optional Modules" header and paste this blueprint.
- [ ]  Install `socket.io` and `@socket.io/redis-adapter` via NPM.
- [ ]  Create `src/types/socket.types.ts` to enforce your event structures.
- [ ]  Create `src/config/socket.ts` to manage handshake verification and room isolation.
- [ ]  Refactor `src/server.ts` to wrap Express in a native `http.createServer()` block.
- [ ]  Inject `getSocketServer().to(...).emit(...)` calls into your background workers or high-impact controllers.
- [ ]  Test the connection using an authorized frontend socket client or a testing tool like Postman WebSockets.

---
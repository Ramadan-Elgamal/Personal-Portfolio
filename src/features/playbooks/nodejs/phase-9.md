📊 Phase 9: Professional Observability & Logging (Pino)
---

## 🎯 Phase Objective

Establish structured, asynchronous application logging and automated HTTP request tracing. We implement three core observability layers:

1. **Centralized Pino Logger**: Emits blazing-fast JSON logs in production, but dynamically swaps to human-readable colored output (`pino-pretty`) during local development.
2. **HTTP Traffic Tracing (`pino-http`)**: Automatically intercepts incoming requests, logs execution latency, tracks status codes, and sanitizes sensitive headers (like authorization tokens) before they hit log storage.
3. **Platform Refactoring**: Standardizes all infrastructure boots, database connection states, and global errors to use structured logging streams instead of basic console outputs.

---

## 📦 1. Core Dependency Installation

- **Type:** Universal / Repeated Code
- **Action:** Run these commands to install the core Pino engine, the Express HTTP interceptor, and the local development pretty-printer.

```bash
# Install Pino core and the Express HTTP logger
npm install pino pino-http

# Install Pino Pretty purely as a dev dependency for clean local terminal formatting
npm install -D pino-pretty
```

*(Note: Pino 8+ includes native TypeScript definitions out of the box).*

---

## 🎛️ 2. The Centralized Logger Instance (`src/config/logger.ts`)

- **Type:** Universal / Repeated Code
- **Action:** Create `src/config/logger.ts` to export your application-wide logger.

This instance inspects `NODE_ENV` to determine its formatting strategy dynamically.

```tsx
import pino from 'pino';

const isDevelopment = process.env.NODE_ENV === 'development';

export const logger = pino({
  // Default to logging everything from 'info' and above, or read from environment
  level: process.env.LOG_LEVEL || 'info',

  // Include the ISO timestamp for exact event correlation
  timestamp: pino.stdTimeFunctions.isoTime,

  // Dynamically apply pino-pretty transport strictly in local development environments
  ...(isDevelopment && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true, // Colorize log levels (e.g., ERROR is red, INFO is green)
        translateTime: 'SYS:standard', // Human-readable local timestamp
        ignore: 'pid,hostname', // Keep the local terminal clean by hiding process IDs
      },
    },
  }),
});
```

---

## 🌐 3. The HTTP Request Tracing Interceptor (`src/middlewares/logger.middleware.ts`)

- **Type:** Universal / Repeated Code
- **Action:** Create `src/middlewares/logger.middleware.ts`.

This middleware automatically logs the lifecycle, duration, and IP addresses of incoming API requests while proactively stripping out credentials.

```tsx
import pinoHttp from 'pino-http';
import { logger } from '../config/logger';

export const httpLogger = pinoHttp({
  logger,
  
  // Custom execution rules
  autoLogging: {
    // Completely ignore noisy container health checks to prevent log spam
    ignore: (req) => req.url === '/health', 
  },

  // Security Sanitization: Define exactly what properties are safely recorded
  serializers: {
    req: (req) => ({
      id: req.id,
      method: req.method,
      url: req.url,
      remoteAddress: req.remoteAddress,
      headers: {
        ...req.headers,
        // Proactively redact Authorization headers to prevent leaking JWTs or API keys into logs
        authorization: req.headers.authorization ? '[REDACTED]' : undefined,
      },
    }),
    res: (res) => ({
      statusCode: res.statusCode,
    }),
  },

  // Custom log messages based on HTTP outcome
  customSuccessMessage: (req, res) => {
    return `[HTTP] ${req.method} ${req.url} completed successfully.`;
  },
  customErrorMessage: (req, res, err) => {
    return `[HTTP] ${req.method} ${req.url} failed: ${err.message}`;
  },
});
```

---

## 🔗 4. Wiring Observability into the Pipeline (`src/app.ts`)

- **Type:** Universal Baseline / Updates Phase 8 Placeholders
- **Action:** Open `src/app.ts` and mount the `httpLogger` immediately after your security headers, ensuring it captures all downstream traffic.

```tsx
import express, { Application, Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { getCorsOptions, globalLimiter } from './config/security';

// <-- 1. Import our HTTP tracing interceptor
import { httpLogger } from './middlewares/logger.middleware'; 

import userRoutes from './routes/user.routes';
import { AppError } from './utils/AppError';
import { errorHandler } from './middlewares/error.middleware';

const app: Application = express();

// 1. Global Security Layer
app.use(helmet());
app.use(cors(getCorsOptions()));
app.use(globalLimiter);

// ==========================================
// 2. OBSERVABILITY LAYER (Mount after security)
// ==========================================
// STEP 1: Every request passing this point is automatically timed and logged
app.use(httpLogger);

// 3. Standard Middlewares & Health Check
app.use(express.json({ limit: '10kb' }));

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'success', message: 'API is running normally.' });
});

// 4. Feature Routes
app.use('/api/v1/users', userRoutes);

// 5. Global Safety Nets
app.all('*', (req, res, next) => {
  next(new AppError(`Cannot find ${req.method} ${req.originalUrl} on this server.`, 404));
});

app.use(errorHandler);

export default app;
```

---

## 🛠️ 5. Platform Refactoring: Replacing `console` Outputs

- **Type:** Universal Baseline Updates
- **Action:** To complete your professional observability layer, refactor your existing base files to replace basic `console` calls with structured Pino logs.

### Refactoring Server Boot (`src/server.ts`)

```tsx
import app from './app';
import connectDB from './config/db';
import { logger } from './config/logger'; // <-- 1. Import logger

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    logger.info('⏳ Initializing database connection...'); // <-- 2. Replace console.log
    await connectDB();

    app.listen(PORT, () => {
      logger.info(`🚀 Server successfully booted on port ${PORT}`); // <-- 3. Replace console.log
    });

  } catch (error) {
    logger.fatal({ err: error }, '❌ Critical failure during server startup.'); // <-- 4. Structured error object
    process.exit(1);
  }
};

startServer();
```

### Refactoring the Global Error Handler (`src/middlewares/error.middleware.ts`)

Open `src/middlewares/error.middleware.ts` and replace the raw `console.error` calls with structured error logging.

```tsx
  // Replace the old console.error block with this secure Pino stream:
  if ('isOperational' in err && err.isOperational) {
    // Log expected operational failures as warnings
    logger.warn(`[Operational Error] ${statusCode} - ${message}`);
  } else {
    // Log unexpected bugs as critical errors, passing the complete error object for stack tracing
    logger.error({ err }, '🚨 CRITICAL UNEXPECTED BUG DETECTED');
  }
```

---

## 🔍 Next Steps Checklist

- [ ]  Install `pino`, `pino-http`, and `pino-pretty` via NPM.
- [ ]  Create `src/config/logger.ts` to export your dynamic Pino instance.
- [ ]  Create `src/middlewares/logger.middleware.ts` to encapsulate HTTP request tracing.
- [ ]  Mount `httpLogger` inside `src/app.ts` immediately after the security middleware block.
- [ ]  Refactor `src/server.ts`, `src/config/db.ts`, and `error.middleware.ts` to completely eliminate `console.log` and `console.error` calls.
- [ ]  Make an API request to verify clean, colorized execution logs appear in your terminal.

---

Your API now features enterprise-grade observability. Every HTTP request is strictly audited for execution duration, sensitive payload fields are securely sanitized, and unexpected system crashes pass complete stack traces directly into your JSON logging stream.

Are you ready to build out **Phase 10 (Automated Testing Setup)** to configure the necessary boilerplate for running **Jest** and **Supertest** against your decoupled Express application?
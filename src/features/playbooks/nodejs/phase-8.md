🛡️ Phase 8: Production Security Hardening (Helmet, CORS, & Rate Limiting)
---

## 🎯 Phase Objective

Secure the application's transport layer against real-world attack vectors. We implement three automated defensive perimeters:

1. **Helmet**: Dynamically sets crucial security headers to mitigate vulnerabilities like Cross-Site Scripting (XSS), clickjacking, and MIME-sniffing.
2. **CORS (Cross-Origin Resource Sharing)**: Restricts API access strictly to trusted frontend domains, preventing unauthorized third-party websites from making requests on behalf of users.
3. **Express Rate Limit**: Throttles incoming traffic per IP address to prevent Denial of Service (DoS) attempts and brute-force attacks on sensitive endpoints.

---

## 📦 1. Core Dependency Installation

- **Type:** Universal / Repeated Code
- **Action:** Run these commands to install our security packages. *(Note: `helmet` and `express-rate-limit` include native TypeScript definitions out of the box).*

```bash
# Install security headers, CORS, and rate limiting packages
npm install helmet cors express-rate-limit

# Install development type definitions for CORS
npm install -D @types/cors
```

---

## 🎛️ 2. The Centralized Security Configuration (`src/config/security.ts`)

- **Type:** Universal Baseline / Reusable Configurations
- **Action:** Create `src/config/security.ts` to define your standard security parameters.

Extracting these options keeps our main application entry point clean and allows us to control whitelist origins dynamically via environment variables.

```tsx
import { CorsOptions } from 'cors';
import rateLimit from 'express-rate-limit';

// ==========================================
// 1. STRICT CORS CONFIGURATION
// ==========================================
export const getCorsOptions = (): CorsOptions => {
  // Extract trusted origins from environment, defaulting to a fail-safe empty array if missing
  const allowedOrigins = process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : [];

  return {
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, server-to-server, or cURL) 
      // ONLY if we are in development, or explicitly handle them based on app requirements.
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('🚫 CORS Error: This origin is not authorized to access the API.'));
      }
    },
    credentials: true, // Required if your API eventually uses cookies or authorization headers
    optionsSuccessStatus: 200,
  };
};

// ==========================================
// 2. GLOBAL RATE LIMITER
// ==========================================
// Applied to all routes to prevent basic DoS attacks and resource exhaustion
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the deprecated `X-RateLimit-*` headers
  message: {
    status: 'error',
    message: '⚠️ Too many requests originating from this IP. Please try again after 15 minutes.',
  },
});

// ==========================================
// 3. SENSITIVE ENDPOINT LIMITER (Optional/App-Specific)
// ==========================================
// Applied specifically to auth routes to aggressively throttle password brute-forcing
export const authLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 5, // Limit each IP to 5 login/register attempts per minute
  message: {
    status: 'error',
    message: '🚨 Too many authentication attempts. Your IP has been temporarily blocked for 1 minute.',
  },
});
```

---

## 🔒 3. Updating Environment Variables (`.env`)

- **Type:** App-Specific Baseline
- **Action:** Open your `.env` and `.env.example` files and append the trusted origins setting. Use a comma-separated string for multiple domains.

### `.env.example`

```bash
# Security & CORS Whitelist (Comma-separated domains)
# STEP 1: Add your production frontend domains here
# CORS_ORIGINS=https://myproductionapp.com,https://admin.myproductionapp.com
```

### `.env` (Local Development)

```bash
# Security & CORS Whitelist
# STEP 2: Allow local frontend dev servers (like Vite or Next.js)
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

---

## 🔗 4. Wiring Security into the Request Pipeline (`src/app.ts`)

- **Type:** Universal Baseline / Completes Phase 1 Placeholders
- **Action:** Open your existing `src/app.ts` file and replace the placeholder comments from Phase 1 with our actual security middlewares.

**CRITICAL RULE:** Security headers, CORS, and global rate limiters must be the absolute **first** middlewares mounted at the top of your request pipeline, executing before payload parsers or routers.

```tsx
import express, { Application, Request, Response } from 'express';
// <-- 1. Import security packages and configurations
import helmet from 'helmet';
import cors from 'cors';
import { getCorsOptions, globalLimiter } from './config/security';

import userRoutes from './routes/user.routes';
import { AppError } from './utils/AppError';
import { errorHandler } from './middlewares/error.middleware';

const app: Application = express();

// ==========================================
// 1. GLOBAL SECURITY LAYER (Must be first!)
// ==========================================

// STEP 1: Enable Helmet to set secure HTTP headers
app.use(helmet());

// STEP 2: Enable CORS with strict whitelist options
app.use(cors(getCorsOptions()));

// STEP 3: Apply the global rate limiter to throttle aggressive IPs
app.use(globalLimiter);

// ==========================================
// 2. STANDARD MIDDLEWARES & HEALTH CHECK
// ==========================================
app.use(express.json({ limit: '10kb' })); // Safety update: Limit incoming JSON bodies to 10kb to prevent payload overloads

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'success', message: 'API is running normally.' });
});

// ==========================================
// 3. FEATURE ROUTES
// ==========================================
app.use('/api/v1/users', userRoutes);

// ==========================================
// 4. GLOBAL SAFETY NETS
// ==========================================
app.all('*', (req, res, next) => {
  next(new AppError(`Cannot find ${req.method} ${req.originalUrl} on this server.`, 404));
});

app.use(errorHandler);

export default app;
```

---

## 🚦 5. Blueprint: Protecting Specific Auth Routes

- **Type:** App-Specific Implementation Blueprint
- **Action:** Here is exactly how you apply the stricter `authLimiter` directly to sensitive route paths (e.g., inside `src/routes/user.routes.ts`).

```tsx
import { Router } from 'express';
import { registerUser } from '../controllers/user.controller';
// <-- 1. Import the aggressive rate limiter
import { authLimiter } from '../config/security'; 

const router = Router();

// Apply authLimiter strictly as an interceptor before the controller executes
router.post('/register', authLimiter, registerUser);

// Example: router.post('/login', authLimiter, loginUser);

export default router;
```

---

## 🔍 Next Steps Checklist

- [ ]  Install `helmet`, `cors`, and `express-rate-limit` via NPM.
- [ ]  Create `src/config/security.ts` to centralize our defensive parameters.
- [ ]  Add `CORS_ORIGINS` to your local `.env` file.
- [ ]  Mount Helmet, CORS, and the global rate limiter at the absolute top of `src/app.ts`.
- [ ]  Add the strict `limit: '10kb'` parameter to `express.json()` to protect your server's memory.
- [ ]  Test CORS safety by attempting to cURL or fetch data from an unauthorized origin.
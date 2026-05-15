🔐 Phase 7: Authentication & Authorization (JWT & RBAC)
---

## 🎯 Phase Objective

Secure your API endpoints using a stateless authentication pipeline. We implement robust utilities to issue and verify JSON Web Tokens (JWT), extend TypeScript's definitions to securely attach user sessions to incoming requests, and build declarative middleware guards for **Authentication** (Who are you?) and **Role-Based Access Control / RBAC** (What are you allowed to do?).

---

## 📦 1. Core Dependency Installation

- **Type:** Universal / Repeated Code
- **Action:** Run these commands to install the JWT library and its TypeScript definitions.

```bash
# Install JSON Web Token library
npm install jsonwebtoken

# Install development type definitions
npm install -D @types/jsonwebtoken
```

---

## 🔑 2. The Stateless Auth Utility (`src/utils/jwt.ts`)

- **Type:** Universal / Repeated Code
- **Action:** Create `src/utils/jwt.ts` to encapsulate token generation and verification.

> **💡 Fail-Fast Rule:** Just like our database setup, this utility verifies the existence of `JWT_SECRET` at runtime and throws a critical error if the environment is misconfigured.
> 

```tsx
import jwt from 'jsonwebtoken';
import { AppError } from './AppError';

// Define the standard payload embedded inside our JWTs
export interface ITokenPayload {
  id: string;
  role: 'user' | 'admin';
}

const getSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('❌ CRITICAL: JWT_SECRET is not defined in environment variables.');
  }
  return secret;
};

// ==========================================
// 1. ISSUE TOKEN
// ==========================================
export const signToken = (payload: ITokenPayload): string => {
  return jwt.sign(payload, getSecret(), {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d', // Default to 1 day expiration
  });
};

// ==========================================
// 2. VERIFY TOKEN
// ==========================================
export const verifyToken = (token: string): ITokenPayload => {
  try {
    return jwt.verify(token, getSecret()) as ITokenPayload;
  } catch (error) {
    // Return a clean, operational 401 Unauthorized error if the token is tampered/expired
    throw new AppError('Invalid or expired authentication token. Please log in again.', 401);
  }
};
```

---

## 🛡️ 3. The Authentication Guard (`src/middlewares/auth.middleware.ts`)

- **Type:** Universal / Repeated Code
- **Action:** Create `src/middlewares/auth.middleware.ts`.

> **⚠️ TypeScript Namespace Augmentation:** Express's standard `Request` object does not have a `user` property. We use `declare global` directly inside this file to tell the TypeScript compiler that any request passing through this middleware will securely carry the decoded user payload.
> 

```tsx
import { Request, Response, NextFunction } from 'express';
import { verifyToken, ITokenPayload } from '../utils/jwt';
import { AppError } from '../utils/AppError';

// ==========================================
// 1. EXPRESS TYPESCRIPT AUGMENTATION
// ==========================================
declare global {
  namespace Express {
    interface Request {
      user?: ITokenPayload;
    }
  }
}

// ==========================================
// 2. AUTHENTICATION INTERCEPTOR
// ==========================================
export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  // 1. Extract the Authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Access denied. No valid Bearer token provided.', 401));
  }

  // 2. Extract the raw token string
  const token = authHeader.split(' ')[1];

  try {
    // 3. Verify token and attach payload to the request object
    const decodedPayload = verifyToken(token);
    req.user = decodedPayload;
    
    next(); // Pass control to the next middleware or controller
  } catch (error) {
    next(error); // Forwards the AppError thrown by verifyToken to our global error handler
  }
};
```

---

## 🛑 4. Role-Based Access Control (`src/middlewares/role.middleware.ts`)

- **Type:** Universal / Repeated Code
- **Action:** Create `src/middlewares/role.middleware.ts`.

This is a higher-order middleware factory. It inspects the `req.user` object attached by `requireAuth` and rejects access if the user's role does not match the permitted list.

```tsx
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

export const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Safety check: Ensure requireAuth ran first
    if (!req.user) {
      return next(new AppError('Authentication required before verifying roles.', 401));
    }

    // Verify if the user's role exists inside the allowed array
    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new AppError('Forbidden: You do not have the required permissions to perform this action.', 403)
      );
    }

    next();
  };
};
```

---

## 🔗 5. Blueprint Implementation Example

- **Type:** App-Specific Implementation Blueprint
- **Action:** Here is exactly how you apply these guards to your route dictionaries (e.g., inside `src/routes/user.routes.ts` or any feature router).

```tsx
import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';
// Placeholder imports for feature controllers
// import { getProfile, getAllUsers, deleteUser } from '../controllers/user.controller';

const router = Router();

// ==========================================
// 1. PUBLIC ROUTES (No guards)
// ==========================================
// router.post('/login', loginController);

// ==========================================
// 2. PROTECTED ROUTES (Requires valid JWT)
// ==========================================
// Any route defined below this middleware requires authentication
router.use(requireAuth);

// Example: GET /api/v1/users/me -> Only accessible to authenticated users
// router.get('/me', getProfile);

// ==========================================
// 3. RESTRICTED ROUTES (Requires specific roles)
// ==========================================
// Example: GET /api/v1/users -> Only accessible if req.user.role === 'admin'
// router.get('/', requireRole(['admin']), getAllUsers);

// Example: DELETE /api/v1/users/:id -> Only admin
// router.delete('/:id', requireRole(['admin']), deleteUser);

export default router;
```

---

## 🔍 Next Steps Checklist

- [ ]  Install `jsonwebtoken` via NPM.
- [ ]  Add `JWT_SECRET=your_super_secret_key` and `JWT_EXPIRES_IN=1d` to your local `.env` file.
- [ ]  Create `jwt.ts` utility file.
- [ ]  Create `auth.middleware.ts` ensuring the `declare global` namespace block is placed at the top.
- [ ]  Create `role.middleware.ts` for granular permission gating.
- [ ]  Apply `requireAuth` and `requireRole` to protect your sensitive endpoints.
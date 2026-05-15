🛤️ Phase 5: The Request Pipeline (Routes, Controllers, & Services)
---

## 🎯 Phase Objective

Wire the standard lifecycle of an incoming HTTP request. We enforce a strict separation of duties across three distinct layers:

1. **The Route:** Acts as a pure dictionary, mapping HTTP verbs and paths to a Controller.
2. **The Controller:** The HTTP manager. Extracts parameters/body, executes Joi validation, passes clean data to the Service, and formats the standard JSON response.
3. **The Service:** The domain brain. Completely agnostic of Express (`req`/`res`). Executes business rules, queries the database, and returns raw data or throws operational errors.

---

## 🧠 1. The Business Logic Layer (`src/services/user.service.ts`)

- **Type:** App-Specific Baseline / Blueprint Example
- **Action:** Create `src/services/user.service.ts`.

> **💡 Service Design Rule:** Never import Express types (`Request`, `Response`) here. If you decide to trigger these functions via a CLI, a background cron job, or a message queue (RabbitMQ) later, this code won't need to change at all.
> 

```tsx
import User, { IUser } from '../models/user.model';
// Note: AppError is fully implemented in Phase 6
import { AppError } from '../utils/AppError';

// STEP 1: Define the input interface for your service method
export interface IRegisterUserInput {
  name: string;
  email: string;
  passwordHash: string; // Mongoose pre-save hook will hash this
}

export const createUser = async (input: IRegisterUserInput) => {
  // ==========================================
  // 1. ENFORCE DOMAIN BUSINESS RULES
  // ==========================================
  const existingUser = await User.findOne({ email: input.email });
  
  if (existingUser) {
    // Throw a clean, operational HTTP 409 Conflict error directly to the controller
    throw new AppError('A user with this email address already exists.', 409);
  }

  // ==========================================
  // 2. EXECUTE PERSISTENCE
  // ==========================================
  const newUser = new User({
    name: input.name,
    email: input.email,
    passwordHash: input.passwordHash,
  });

  await newUser.save();

  // ==========================================
  // 3. SANITIZE OUTPUT (Never leak sensitive data)
  // ==========================================
  const userResponse = newUser.toObject();
  delete (userResponse as any).passwordHash;

  return userResponse;
};
```

---

## 🚦 2. The Transport Layer (`src/controllers/user.controller.ts`)

- **Type:** App-Specific Baseline / Blueprint Example
- **Action:** Create `src/controllers/user.controller.ts`.

> **💡 Controller Design Rule:** We wrap all controllers in `asyncHandler` (implemented in Phase 6) to eliminate repetitive `try/catch` blocks. If validation fails or the service throws an error, it is automatically intercepted by our global error handler.
> 

```tsx
import { Request, Response } from 'express';
import { createUser } from '../services/user.service';
import { registerSchema } from '../validations/user.validation';
// Note: asyncHandler and AppError are fully implemented in Phase 6
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';

export const registerUser = asyncHandler(async (req: Request, res: Response) => {
  // ==========================================
  // 1. FAIL-FAST PAYLOAD VALIDATION
  // ==========================================
  // abortEarly: false ensures we return ALL validation failures at once, not just the first one
  const { error, value } = registerSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errorMessages = error.details.map((err) => err.message).join(', ');
    throw new AppError(errorMessages, 400); // 400 Bad Request
  }

  // ==========================================
  // 2. DELEGATE TO SERVICE LAYER
  // ==========================================
  // Map validated client payload ('password') to service expectations ('passwordHash')
  const serviceInput = {
    name: value.name,
    email: value.email,
    passwordHash: value.password, 
  };

  const newUser = await createUser(serviceInput);

  // ==========================================
  // 3. FORMAT STANDARDIZED JSON RESPONSE
  // ==========================================
  res.status(201).json({
    status: 'success',
    message: 'User registered successfully.',
    data: newUser,
  });
});
```

---

## 🗺️ 3. The Routing Dictionary (`src/routes/user.routes.ts`)

- **Type:** App-Specific Baseline / Blueprint Example
- **Action:** Create `src/routes/user.routes.ts`. Keep this entirely devoid of inline logic.

```tsx
import { Router } from 'express';
import { registerUser } from '../controllers/user.controller'; // import the controller

const router = Router();

// ==========================================
// FEATURE ENDPOINTS: /api/v1/users
// ==========================================

// POST /api/v1/users/register
router.post('/register', registerUser);

// STEP 1: Placeholder for future auth routes
// Example: router.post('/login', loginUser);
// Example: router.get('/me', requireAuth, getUserProfile);

export default router;
```

---

## 🔗 4. Wiring the Router into the Application (`src/app.ts`)

- **Type:** App-Specific Baseline / Updates Phase 1 Placeholders
- **Action:** Open your existing `src/app.ts` file and update the routing placeholders to mount our new feature pipeline.

```tsx
import express, { Application, Request, Response } from 'express';
// <-- 1. Import your feature routers here
import userRoutes from './routes/user.routes'; 

const app: Application = express();

app.use(express.json()); 

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'success', message: 'API is running normally.' });
});

// ==========================================
// FEATURE ROUTES MOUNTING
// ==========================================
// <-- 2. Mount the router to a versioned base path
app.use('/api/v1/users', userRoutes); 

// Placeholders for Phase 6 global error handlers...
// app.all('*', ...);
// app.use(errorHandler);

export default app;
```

---

## 🔍 Next Steps Checklist

- [ ]  Create the blueprint Service, Controller, and Route files for your first entity.
- [ ]  Mount the router inside `src/app.ts` under a clean, versioned namespace (e.g., `/api/v1/...`).
- [ ]  Ignore temporary IDE import warnings for `AppError` and `asyncHandler`.
- [ ]  Proceed to **Phase 6** to build the critical utility wrappers and global error middleware that bring this pipeline to life.
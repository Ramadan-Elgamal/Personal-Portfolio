⚙️ Phase 17 (Optional): Enterprise Workflow Automation (n8n)
---

## 🎯 Phase Objective

Decouple fluid and frequently changing business processes from core backend services. By integrating **n8n** as an external workflow orchestration engine, we establish a secure, bidirectional event pipeline:

1. **Outbound Triggers (API $\rightarrow$ n8n):** The backend securely dispatches non-blocking HTTP payloads to n8n Webhook nodes whenever core domain events occur (e.g., `UserRegistered`, `CartAbandoned`, `LeadSubmitted`).
2. **Inbound Callbacks (n8n $\rightarrow$ API):** n8n processes complex third-party integrations (CRMs, AI chatbots, multi-channel outreach) and securely calls back into our dedicated API endpoints to update persistent application state.
3. **Infrastructure Co-hosting:** Extending our local Docker Compose setup to run a secure, self-hosted n8n instance right alongside our existing API and databases.

---

## 🐳 1. Extending Local Infrastructure (`docker-compose.yml`)

- **Type:** Optional Expansion
- **Action:** Open your existing `docker-compose.yml` file and inject the `n8n` service block.

This configuration spins up self-hosted n8n, secures its admin dashboard, and attaches it to the shared internal network so it can communicate directly with your API and MongoDB containers.

```yaml
  # Inject this service into your existing docker-compose.yml services block
  n8n:
    image: n8nio/n8n:latest
    ports:
      - "5678:5678"
    environment:
      - N8N_HOST=localhost
      - N8N_PORT=5678
      - N8N_PROTOCOL=http
      - NODE_ENV=production
      - WEBHOOK_URL=http://localhost:5678/
      # Secure the n8n visual canvas with basic authentication
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=${N8N_AUTH_USER:-admin}
      - N8N_BASIC_AUTH_PASSWORD=${N8N_AUTH_PASSWORD:-supersecretpassword}
      # Enforce standard UTC operations across automation tasks
      - GENERIC_TIMEZONE=UTC
    volumes:
      - n8n_data:/home/node/.n8n
    networks:
      - app-network
    restart: unless-stopped

# Ensure you define the new persistent volume at the absolute bottom of your file:
# volumes:
#   mongo_data:
#     driver: local
#   n8n_data:
#     driver: local
```

---

## 🎛️ 2. The Outbound Connector Configuration (`src/config/n8n.ts`)

- **Type:** App-Specific Expansion
- **Action:** Create `src/config/n8n.ts` to centralize connection strings and cryptographic shared secrets. Fails fast if automation credentials are unconfigured.

```tsx
import { logger } from './logger';

export const getN8nConfig = () => {
  const baseUrl = process.env.N8N_WEBHOOK_BASE_URL;
  const secret = process.env.N8N_SHARED_SECRET;

  if (!baseUrl || !secret) {
    logger.error('❌ CRITICAL: N8N_WEBHOOK_BASE_URL or N8N_SHARED_SECRET is missing.');
    throw new Error('Automation features are disabled due to missing configuration.');
  }

  return { baseUrl, secret };
};
```

---

## 📤 3. The Outbound Automation Service (`src/services/automation.service.ts`)

- **Type:** Universal Core for Orchestration
- **Action:** Create `src/services/automation.service.ts`.

This file acts as our event producer. It exposes clean, strongly-typed methods to trigger complex external workflows (such as multi-channel abandoned cart recovery or asynchronous lead qualification scoring) without blocking the primary HTTP request thread.

```tsx
import { getN8nConfig } from '../config/n8n';
import { logger } from '../config/logger';

// ==========================================
// 1. STRONGLY-TYPED WORKFLOW PAYLOADS
// ==========================================
export interface ILeadQualificationPayload {
  userId: string;
  email: string;
  name: string;
  source: string;
  submittedData: Record<string, any>;
}

export interface IAbandonedCartPayload {
  cartId: string;
  userId: string;
  email: string;
  items: Array<{ productId: string; quantity: number; price: number }>;
  cartTotal: number;
}

// ==========================================
// 2. STATELESS EVENT PRODUCER
// ==========================================
export const automationService = {
  /**
   * Fires an event to n8n to initiate a dynamic lead qualification and outreach sequence.
   */
  async triggerLeadQualification(payload: ILeadQualificationPayload): Promise<void> {
    await this.dispatchWebhook('lead-qualification', payload);
  },

  /**
   * Fires an event to n8n to schedule multi-channel abandoned cart follow-ups.
   */
  async triggerAbandonedCartRecovery(payload: IAbandonedCartPayload): Promise<void> {
    await this.dispatchWebhook('abandoned-cart', payload);
  },

  /**
   * Universal dispatcher that securely transmits payloads to an n8n Webhook node.
   */
  private async dispatchWebhook(workflowPath: string, data: any): Promise<void> {
    try {
      const { baseUrl, secret } = getN8nConfig();
      // Construct the full webhook target (n8n production webhooks listen on /webhook/)
      const targetUrl = `${baseUrl.replace(/\/$/, '')}/webhook/${workflowPath}`;

      // Execute non-blocking network dispatch, injecting our shared secret into the headers
      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Automation-Secret': secret, // Verified by the n8n Webhook node's header auth rules
        },
        body: JSON.stringify({
          event: workflowPath,
          timestamp: new Date().toISOString(),
          data,
        }),
      });

      if (!response.ok) {
        throw new Error(`n8n rejected trigger payload. HTTP Status: ${response.status}`);
      }

      logger.info(`⚡ [n8n Orchestration] Successfully dispatched event trigger: [${workflowPath}]`);
    } catch (error: any) {
      // Non-blocking failure: If n8n goes offline, log the error but allow the core API transaction to succeed
      logger.error({ err: error, workflowPath }, '❌ Failed to dispatch outbound n8n automation webhook.');
    }
  },
};
```

---

## 🛡️ 4. Inbound Webhook Verification Guard (`src/middlewares/n8nGuard.middleware.ts`)

- **Type:** Universal Core for Orchestration
- **Action:** Create `src/middlewares/n8nGuard.middleware.ts`.

When an n8n workflow finishes processing external systems (like querying an AI agent or scoring a lead), it calls an HTTP Request node back to our API to update the database. This middleware establishes an absolute security boundary, verifying that inbound callbacks genuinely originated from our trusted n8n instance.

```tsx
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

export const requireN8nSignature = (req: Request, res: Response, next: NextFunction): void => {
  // Extract the shared secret passed by the n8n HTTP Request node
  const incomingSecret = req.headers['x-n8n-callback-secret'];
  const expectedSecret = process.env.N8N_SHARED_SECRET;

  if (!expectedSecret) {
    return next(new AppError('Server configuration error: Automation shared secret undefined.', 500));
  }

  // Prevent unauthorized scripts or third parties from triggering state updates
  if (!incomingSecret || incomingSecret !== expectedSecret) {
    return next(new AppError('Forbidden: Invalid or missing workflow orchestration signature.', 403));
  }

  next();
};
```

---

## 🚦 5. The Inbound Callback Controller (`src/controllers/automation.controller.ts`)

- **Type:** App-Specific Expansion
- **Action:** Create `src/controllers/automation.controller.ts`.

Receives validated, authorized execution results from n8n and persists the final outcomes into the application database.

```tsx
import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import { logger } from '../config/logger';
// import { User } from '../models/user.model';
import Joi from 'joi';

// Secure payload schema expected from the n8n workflow callback
const leadQualificationCallbackSchema = Joi.object({
  userId: Joi.string().required(),
  qualificationScore: Joi.number().min(0).max(100).required(),
  status: Joi.string().valid('cold', 'warm', 'hot', 'disqualified').required(),
  assignedRepresentative: Joi.string().allow(null, '').optional(),
});

export const handleLeadQualificationCallback = asyncHandler(async (req: Request, res: Response) => {
  // 1. Validate payload structure arriving from n8n
  const { error, value } = leadQualificationCallbackSchema.validate(req.body);
  if (error) throw new AppError(error.details[0].message, 400);

  logger.info(`⚙️ [n8n Callback] Processing qualified lead status for User ID: ${value.userId}`);

  // 2. Safely execute database updates based on external workflow calculations
  /*
  await User.findByIdAndUpdate(value.userId, {
    leadScore: value.qualificationScore,
    leadStatus: value.status,
    assignedRep: value.assignedRepresentative
  });
  */

  // 3. Acknowledge receipt so the n8n workflow node successfully completes its execution step
  res.status(200).json({
    status: 'success',
    message: 'Workflow callback processed and persistent state updated successfully.',
  });
});
```

---

## 🗺️ 6. Mounting the Automation Pipeline (`src/routes/automation.routes.ts`)

- **Type:** App-Specific Expansion
- **Action:** Create `src/routes/automation.routes.ts` and mount it to your main `src/app.ts` file under `/api/v1/automation`.

```tsx
import { Router } from 'express';
import { handleLeadQualificationCallback } from '../controllers/automation.controller';
import { requireN8nSignature } from '../middlewares/n8nGuard.middleware';
import { globalLimiter } from '../config/security'; // Phase 8 Rate Limiter

const router = Router();

// 1. Throttles aggressive traffic to prevent callback endpoint flooding
router.use(globalLimiter);

// 2. Enforce strict cryptographic shared secret validation on ALL inbound workflow triggers
router.use(requireN8nSignature);

// POST /api/v1/automation/callback/lead-qualified -> Triggered by n8n HTTP Request node
router.post('/callback/lead-qualified', handleLeadQualificationCallback);

export default router;
```

---

## 🔒 7. Environment Variables Update (`.env`)

Append your automation orchestrator parameters to your local `.env` and `.env.example` files:

```
# n8n Workflow Orchestration Engine
# Use your external cloud instance, or resolve internally to the local Docker Compose service name
N8N_WEBHOOK_BASE_URL=http://localhost:5678
N8N_SHARED_SECRET=your_cryptographically_secure_random_string_here

# n8n Local Canvas Access Credentials (if co-hosting via Docker Compose)
N8N_AUTH_USER=admin
N8N_AUTH_PASSWORD=production_secure_canvas_password
```

---

## 🔍 Next Steps Checklist

- [ ]  Create a dedicated page for Phase 17 inside your "📦 Advanced & Optional Modules" Notion section.
- [ ]  Inject the `n8n` service block into `docker-compose.yml` and spin it up using `docker compose up -d n8n`.
- [ ]  Populate your `.env` file with secure shared secret keys.
- [ ]  Create `src/config/n8n.ts` and `src/services/automation.service.ts`.
- [ ]  Scaffold the inbound middleware guard inside `src/middlewares/n8nGuard.middleware.ts`.
- [ ]  Build your inbound callback handlers inside `src/controllers/automation.controller.ts`.
- [ ]  Mount `automation.routes.ts` under `/api/v1/automation` inside `src/app.ts`.
- [ ]  **Test the pipeline:** Build a simple test workflow in n8n featuring a Webhook Trigger node. Verify that calling `automationService.triggerLeadQualification(...)` successfully passes your JSON payloads right onto the n8n canvas.
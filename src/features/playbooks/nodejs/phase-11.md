🐳 Phase 11: Containerization & CI/CD Pipelines
---

## 🎯 Phase Objective

Package the application into a secure, lightweight, and portable container while automating integration testing. We implement three core infrastructure pillars:

1. **Multi-Stage Dockerfile**: Compiles the TypeScript source code, discards heavy development dependencies, and runs the compiled JavaScript using a lean, unprivileged runtime image to maximize production security.
2. **Docker Compose Orchestration**: Connects the API container to a dedicated, persistent MongoDB instance, managing network discovery and boot-order health checks automatically.
3. **Continuous Integration (CI)**: Automates static type-checking and integration testing on every `git push` or pull request using GitHub Actions.

---

## 📦 1. Production Multi-Stage Build (`Dockerfile`)

- **Type:** Universal / Repeated Code
- **Action:** Create a `Dockerfile` (no file extension) at the root of your workspace.

> **💡 Security & Size Optimization:** This multi-stage setup ensures that source code files (`.ts`) and heavy development dependencies (like Jest and typescript compilers) never make it into your final production container, keeping the attack surface small and the image size under 150MB.
> 

```docker
# ==========================================
# 1. BASE STAGE (Shared environment)
# ==========================================
FROM node:22-alpine AS base
WORKDIR /usr/src/app
COPY package*.json ./

# ==========================================
# 2. BUILDER STAGE (Compile TypeScript)
# ==========================================
FROM base AS builder
# Install ALL dependencies, including devDependencies required for tsc
RUN npm ci
COPY tsconfig*.json ./
COPY src ./src

# Compile TypeScript to JavaScript inside dist/
RUN npm run build

# Prune away devDependencies, leaving strictly production modules
RUN npm prune --production

# ==========================================
# 3. PRODUCTION RUNTIME STAGE (Lean output)
# ==========================================
FROM node:22-alpine AS production
WORKDIR /usr/src/app

# Enforce production environment optimizations
ENV NODE_ENV=production

# Copy necessary package definitions
COPY package*.json ./

# Copy compiled code and clean production modules from the builder stage
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist

# Expose the designated network port
EXPOSE 3000

# SECURITY: Run the application as the unprivileged, built-in 'node' user instead of root
USER node

# Execute the production boot script
CMD ["npm", "start"]
```

---

## 🌐 2. Local Environment Orchestration (`docker-compose.yml`)

- **Type:** Universal Baseline / Local Infrastructure
- **Action:** Create `docker-compose.yml` at the root of your workspace.

This configuration spins up your database and API together, mounting persistent volumes so data survives container restarts, and attaches a strict health check to ensure the API never boots until MongoDB is actively accepting connections.

```yaml
services:
  api:
    build:
      context: .
      target: production
    ports:
      - "3000:3000"
    environment:
      - PORT=3000
      - NODE_ENV=production
      # Compose automatically resolves service names ('mongo') to internal IP addresses
      - MONGO_URI=mongodb://mongo:27017/production_db
      - JWT_SECRET=${JWT_SECRET:-local_development_fallback_secret}
    depends_on:
      mongo:
        condition: service_healthy
    networks:
      - app-network
    restart: unless-stopped

  mongo:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    networks:
      - app-network
    # Native MongoDB health check to verify the storage engine is fully online
    healthcheck:
      test: echo "db.runCommand('ping').ok" | mongosh localhost:27017/test --quiet
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

networks:
  app-network:
    driver: bridge

volumes:
  mongo_data:
    driver: local
```

---

## ⚡ 3. Automated CI/CD Pipeline (`.github/workflows/ci.yml`)

- **Type:** Universal / Repeated Code
- **Action:** Create the folder hierarchy `.github/workflows/` and add a file named `ci.yml`.

Whenever you push code to GitHub, this action automatically sets up a clean Node environment, compiles the types, and runs your complete Jest integration test suite.

```yaml
name: Continuous Integration Pipeline

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Source Code
        uses: actions/checkout@v4

      - name: Setup Node.js Environment
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'

      - name: Install Clean Dependencies
        run: npm ci

      - name: Execute Static Type Check
        run: npm run typecheck

      - name: Execute Automated Test Suite
        env:
          JWT_SECRET: temporary_ci_secret_key
        run: npm test
```

---

## 📜 4. The Standard `.dockerignore` File

- **Type:** Universal / Repeated Code
- **Action:** Create a `.dockerignore` file at your workspace root to keep your builds fast and prevent local files from overwriting container code.

```
# Dependency directories
node_modules/

# Local build outputs
dist/

# Environment files
.env
.env.*

# Logs
logs/
*.log

# Git files
.git/
.gitignore

# Documentation & tests
README.md
**/__tests__/
**/*.test.ts
**/*.spec.ts
```

---

## 🔍 Next Steps Checklist

- [ ]  Create the `Dockerfile` and `.dockerignore` files at the root level.
- [ ]  Create `docker-compose.yml` to define your multi-container environment.
- [ ]  Scaffold the GitHub Actions configuration inside `.github/workflows/ci.yml`.
- [ ]  Verify your Docker setup locally by running `docker compose up --build` in your terminal. You should see MongoDB boot up, pass its health check, and trigger the API launch successfully.

---

### 🏆 Master Playbook Complete!
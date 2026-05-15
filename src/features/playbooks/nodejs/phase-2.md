⚙️ Phase 2: Runtime & Type Safety Core
## 🎯 Phase Objective

Establish rock-solid compile-time safety, modern module resolution, and environment variable management. By locking in strict TypeScript configurations and fast execution tools (`tsx`), we eliminate the vast majority of runtime errors (like `undefined` crashes) before our code ever runs.

---

## 📦 1. Core Dependency Installation

- **Type:** Universal / Repeated Code
- **Action:** Run these commands in your terminal to install the minimal runtime framework and our development compiler tools.

```bash
# 1. Install core runtime dependencies
npm install express dotenv

# 2. Install TypeScript, ambient types, and the fast execution watcher (tsx)
npm install -D typescript @types/node @types/express tsx
```

> **💡 Why `tsx` instead of `nodemon` or `ts-node`?** > `tsx` (TypeScript Execute) is a lightning-fast runner powered by `esbuild`. It handles modern module resolution out of the box, requires zero compilation overhead during local development, and watches for file changes effortlessly.
> 

---

## 🎛️ 2. TypeScript Configuration (`tsconfig.json`)

- **Type:** Universal / Repeated Code
- **Action:** Initialize TypeScript and replace the configuration file.

First, generate the base file from your terminal:

```bash
npx tsc --init
```

Next, open the generated `tsconfig.json` at the root of your project and replace its entire content with this strict, production-ready configuration:

```json
{
  "compilerOptions": {
    /* Base Options */
    "target": "ES2022",
    "module": "CommonJS",
    "lib": ["ES2022"],
    
    /* Bundling & Resolution */
    "rootDir": "./src",
    "outDir": "./dist",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    
    /* Strict Type-Checking (Non-Negotiable) */
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.spec.ts", "**/*.test.ts"]
}
```

---

## 📜 3. Execution Scripts (`package.json`)

- **Type:** Universal / Repeated Code
- **Action:** Open your `package.json` and add these standardized scripts to manage your development, build, and production lifecycles.

```json
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "typecheck": "tsc --noEmit"
  },
```

### Script Anatomy:

- **`npm run dev`**: Boots the application in watch mode. Any saved changes inside the `src/` directory will instantly restart the server.
- **`npm run build`**: Compiles our strict TypeScript code down to clean, optimized JavaScript inside the `dist/` folder.
- **`npm start`**: The entry point used by production hosting environments (AWS, Docker, Render) to execute the compiled application.
- **`npm run typecheck`**: Runs the compiler without outputting files. Perfect for pre-commit hooks or CI/CD pipelines to verify code correctness.

---

## 🔒 4. Environment Variables Baseline (`.env`)

- **Type:** App-Specific Baseline
- **Action:** Populate your newly created `.env` and `.env.example` files.

### `.env.example` (Committed to Git)

```
# Application Infrastructure
PORT=3000
NODE_ENV=development

# STEP 1: Add placeholder keys for external infrastructure here
# MONGO_URI=mongodb://localhost:27017/your_db_name
# JWT_SECRET=your_super_secret_jwt_key
```

### `.env` (Ignored by Git)

```
# Application Infrastructure
PORT=3000
NODE_ENV=development

# STEP 2: Add your actual local development keys here
# MONGO_URI=mongodb://127.0.0.1:27017/my_actual_db
# JWT_SECRET=development_secret_key_change_in_production
```

---

## 🔍 Next Steps Checklist

- [ ]  Install the NPM dependencies in your terminal.
- [ ]  Update `tsconfig.json` with the strict compilation rules.
- [ ]  Add the execution scripts to `package.json`.
- [ ]  Verify setup by running `npm run dev` (it should successfully boot the server created in Phase 1).
- [ ]  Proceed to **Phase 3** to configure robust database persistence (MongoDB Singleton setup).
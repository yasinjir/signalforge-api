# SignalForge API

Open-source backend for **SignalForge**, a product-operations platform that turns raw product feedback into structured insights, reports, PRDs, and execution-ready tasks.

**Product flow:** Project → Inputs → Insights → Report → PRD → Tasks

## Open-source status

SignalForge is being developed as an open-source product operations platform.

This repository contains the API backend. Contributions are welcome — see [CONTRIBUTING.md](CONTRIBUTING.md). For security reports, see [SECURITY.md](SECURITY.md). Community standards are in [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## What it does

- Manage product **projects** and **inputs** (feedback, notes, structured content).
- Generate and fetch **insights**, **reports**, **PRDs**, and **tasks** per project (MVP uses deterministic sample data; LLM pipeline is planned).
- Expose a **workspace** endpoint to hydrate the full project state in one request for the frontend.

## Tech stack

- [NestJS](https://nestjs.com/)
- TypeScript
- [Prisma 7](https://www.prisma.io/) with PostgreSQL
- [Supabase](https://supabase.com/) Postgres (`DATABASE_URL`)
- [Vercel](https://vercel.com/) Serverless Functions

## Production URLs

| Service | URL |
|---------|-----|
| Backend | https://signalforge-api.vercel.app |
| Frontend | https://signalforge-frontend.vercel.app |

Repository: [github.com/yasinjir/signalforge-api](https://github.com/yasinjir/signalforge-api)

## API health check

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/health` | Vercel-native health handler (`api/health.ts`) |
| `GET` | `/health` | Nest health (local dev; same payload shape via AppController) |

Example (production):

```http
GET https://signalforge-api.vercel.app/api/health
```

Health endpoints are **public** (no auth required).

## Authentication

Product API routes require a Supabase Auth access token:

```http
Authorization: Bearer <access_token>
```

The backend verifies the JWT with Supabase (`SUPABASE_URL` + `SUPABASE_ANON_KEY`) and scopes all project data to the authenticated user’s `ownerId`.

- Missing or invalid token → `401 Unauthorized`
- Project not owned by the user → `404 Project not found` (no cross-user leakage)
- Legacy projects with `ownerId = null` are hidden from authenticated users

Obtain the access token from the frontend after Supabase sign-in.

## Main API endpoints

Base URL in production: `https://signalforge-api.vercel.app`

All endpoints below require `Authorization: Bearer <access_token>` unless noted.

### Projects

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/projects` | List projects for the current user (optional filters) |
| `POST` | `/projects` | Create a project (sets `ownerId`) |
| `GET` | `/projects/:id` | Get one project (must be owned) |
| `GET` | `/projects/:id/workspace` | Full workspace (must be owned) |
| `PATCH` | `/projects/:id` | Update project metadata (must be owned) |
| `PATCH` | `/projects/:id/archive` | Archive project (`status = archived`) |
| `DELETE` | `/projects/:id` | Delete project and related data (cascade) |

**List query parameters** (`GET /projects`):

| Parameter | Description |
|-----------|-------------|
| `search` | Case-insensitive match on `name`, `initiative`, `backgroundContext`, `analysisGoal` |
| `stage` | Filter by `currentStage` |
| `status` | Filter by `status` |
| `includeArchived` | Set to `true` to include archived projects; default excludes `status=archived` |

### Workspace response

`GET /projects/:id/workspace` returns:

- `project` — project record
- `inputs` — inputs, newest first
- `latestInsight` — latest insight run with parsed JSON fields, or `null`
- `latestReport` — latest report run with parsed JSON fields, or `null`
- `latestPrd` — latest PRD run, or `null`
- `latestTasks` — latest task run with parsed JSON fields, or `null`

### Inputs

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/projects/:projectId/inputs` | List inputs for a project |
| `POST` | `/projects/:projectId/inputs` | Add an input |

### Insights

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/projects/:projectId/insights/generate` | Generate insights |
| `GET` | `/projects/:projectId/insights/latest` | Latest insight run |

### Reports

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/projects/:projectId/reports/generate` | Generate report |
| `GET` | `/projects/:projectId/reports/latest` | Latest report run |

### PRD

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/projects/:projectId/prd/generate` | Generate PRD |
| `GET` | `/projects/:projectId/prd/latest` | Latest PRD |
| `PATCH` | `/projects/:projectId/prd/latest` | Update latest PRD |

### Tasks

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/projects/:projectId/tasks/generate` | Generate tasks |
| `GET` | `/projects/:projectId/tasks/latest` | Latest task run |

## Local setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create environment file:

   ```bash
   copy .env.example .env
   ```

   On macOS/Linux: `cp .env.example .env`

3. Set in `.env` (see `.env.example`):

   - `DATABASE_URL` — Supabase pooler URL
   - `SUPABASE_URL` — Supabase project URL
   - `SUPABASE_ANON_KEY` — Supabase anon/public key

   **Do not commit `.env`.**

4. Start the API in watch mode:

   ```bash
   npm run start:dev
   ```

   Default port: `3000` (override with `PORT` in `.env`).

**Notes:**

- `DATABASE_URL` is required for Prisma and database access.
- `postinstall` runs `prisma generate` automatically after `npm install`.
- Do **not** run `prisma migrate` unless you are intentionally managing schema changes. Production tables were created manually in Supabase.

## Build

```bash
npm run build
```

Compiles NestJS to `dist/`. Vercel builds serverless handlers from `api/` separately.

## Vercel deployment

1. Connect this repository to a Vercel project.
2. Set environment variables:

   | Variable | Value |
   |----------|--------|
   | `DATABASE_URL` | Supabase pooler connection string |
   | `NODE_ENV` | `production` |
   | `SUPABASE_URL` | `https://<project-ref>.supabase.co` |
   | `SUPABASE_ANON_KEY` | Supabase anon key (Project Settings → API) |

3. Deploy. Vercel uses native `/api` functions:

   - `api/health.ts` — lightweight health check
   - `api/[...path].ts` — NestJS app via Express + `serverless-http`

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for smoke tests and frontend configuration.

## Supabase notes

- Postgres schema matches `prisma/schema.prisma` (`Project`, `ProjectInput`, `InsightRun`, `ReportRun`, `PrdRun`, `TaskRun`).
- `Project.ownerId` links rows to Supabase Auth users (add column manually in SQL Editor if not already applied).
- Tables were created manually in the Supabase SQL Editor.
- Local migration to Supabase was skipped when the pooler was unreachable from the developer machine.
- Never commit database credentials; use Vercel env vars in production and `.env` locally (gitignored).

## Scripts

| Script | Description |
|--------|-------------|
| `npm run start` | Start Nest (non-watch) |
| `npm run start:dev` | Start with hot reload |
| `npm run start:prod` | Run compiled `dist/main.js` |
| `npm run build` | Compile TypeScript |
| `npm run test` | Unit tests |

## Next backlog

- Real LLM generation pipeline (replace MVP sample generators)
- Workspace hydration improvements (pagination, partial loads)
- Better production error logging and observability

## License

This project is licensed under the [MIT License](LICENSE).

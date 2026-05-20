# SignalForge API

Backend for **SignalForge**, a product-operations platform that turns raw product feedback into structured insights, reports, PRDs, and execution-ready tasks.

**Product flow:** Project → Inputs → Insights → Report → PRD → Tasks

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

## Main API endpoints

Base URL in production: `https://signalforge-api.vercel.app`

### Projects

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/projects` | List all projects |
| `POST` | `/projects` | Create a project |
| `GET` | `/projects/:id` | Get one project |
| `GET` | `/projects/:id/workspace` | Full workspace (project, inputs, latest runs) |

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

3. Set `DATABASE_URL` in `.env` to your Supabase pooler URL (or another Postgres instance). **Do not commit `.env`.**

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

3. Deploy. Vercel uses native `/api` functions:

   - `api/health.ts` — lightweight health check
   - `api/[...path].ts` — NestJS app via Express + `serverless-http`

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for smoke tests and frontend configuration.

## Supabase notes

- Postgres schema matches `prisma/schema.prisma` (`Project`, `ProjectInput`, `InsightRun`, `ReportRun`, `PrdRun`, `TaskRun`).
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

- Supabase Auth
- `ownerId` / `userId` on `Project`
- Per-user project isolation
- Archive / delete project
- Real LLM generation pipeline (replace MVP sample generators)
- Workspace hydration improvements (pagination, partial loads)
- Better production error logging and observability

## License

UNLICENSED — private project.

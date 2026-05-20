# SignalForge API — Deployment

Production deployment guide for the backend on Vercel with Supabase Postgres.

## Vercel backend environment variables

Set these in the Vercel project (**Settings → Environment Variables**) for Production (and Preview if needed):

| Variable | Example / notes |
|----------|-----------------|
| `DATABASE_URL` | Supabase **connection pooler** URL (port `6543`, `?pgbouncer=true`). Use the value from Supabase **Project Settings → Database**. Never commit the real password. |
| `NODE_ENV` | `production` |

`postinstall` runs `prisma generate` during deploy. Do **not** run `prisma migrate` from CI unless you intentionally manage schema migrations.

## Supabase connection notes

- Tables (`Project`, `ProjectInput`, `InsightRun`, `ReportRun`, `PrdRun`, `TaskRun`) were created manually in the Supabase SQL Editor.
- Local `prisma migrate` was not used because the local network could not reach the Supabase pooler (`P1001`).
- Runtime uses `DATABASE_URL` only; credentials stay in Vercel (or local `.env`, which is gitignored).
- Prisma 7 uses `@prisma/adapter-pg` with the connection string from the environment.

## Frontend environment variable

On the **signalforge-frontend** Vercel project:

```
VITE_API_BASE_URL=https://signalforge-api.vercel.app
```

Redeploy the frontend after changing this variable.

## Vercel serverless functions

| File | Route |
|------|--------|
| `api/health.ts` | `GET /api/health` |
| `api/[...path].ts` | NestJS catch-all for application API routes |

`vercel.json` configures function duration and CORS headers for the production frontend origin.

## Post-deploy smoke tests

Replace `{PROJECT_ID}` with a real id from `GET /projects`.

```http
GET https://signalforge-api.vercel.app/api/health
```

Expected: JSON with `status: "ok"` and `service: "signalforge-api"`.

```http
GET https://signalforge-api.vercel.app/projects
```

Expected: `[]` or a JSON array of projects.

```http
GET https://signalforge-api.vercel.app/projects/{PROJECT_ID}/workspace
```

Expected: workspace JSON (`project`, `inputs`, `latestInsight`, `latestReport`, `latestPrd`, `latestTasks`).

## Local vs production

| Item | Local | Production |
|------|--------|------------|
| Env file | Copy `.env.example` → `.env` | Vercel env vars |
| Start API | `npm run start:dev` (port `3000`) | Vercel deploy |
| Health | `GET http://localhost:3000/health` | `GET /api/health` on Vercel |

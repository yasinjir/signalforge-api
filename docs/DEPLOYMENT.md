# SignalForge API — Deployment

Production deployment guide for the backend on Vercel with Supabase Postgres and Supabase Auth.

## Vercel backend environment variables

Set these in the Vercel project (**Settings → Environment Variables**) for Production (and Preview if needed):

| Variable | Example / notes |
|----------|-----------------|
| `DATABASE_URL` | Supabase **connection pooler** URL (port `6543`, `?pgbouncer=true`). Use the value from Supabase **Project Settings → Database**. Never commit the real password. |
| `NODE_ENV` | `production` |
| `SUPABASE_URL` | `https://<project-ref>.supabase.co` (Project Settings → API) |
| `SUPABASE_ANON_KEY` | Supabase **anon** public key (Project Settings → API) |

`postinstall` runs `prisma generate` during deploy. Do **not** run `prisma migrate` from CI unless you intentionally manage schema migrations.

## Authentication

Product endpoints require:

```http
Authorization: Bearer <supabase_access_token>
```

The backend validates the token with `supabase.auth.getUser()` and filters projects by `ownerId`.

**Public (no auth):**

- `GET /api/health`
- `GET /health` (local Nest)

## Supabase connection notes

- Tables (`Project`, `ProjectInput`, `InsightRun`, `ReportRun`, `PrdRun`, `TaskRun`) were created manually in the Supabase SQL Editor.
- Add `ownerId` on `Project` manually if needed:

  ```sql
  ALTER TABLE "Project"
  ADD COLUMN IF NOT EXISTS "ownerId" TEXT;

  CREATE INDEX IF NOT EXISTS "Project_ownerId_idx"
  ON "Project" ("ownerId");
  ```

- Local `prisma migrate` was not used because the local network could not reach the Supabase pooler (`P1001`).
- Runtime uses environment variables only; never commit credentials.

## Frontend environment variable

On the **signalforge-frontend** Vercel project:

```
VITE_API_BASE_URL=https://signalforge-api.vercel.app
```

The frontend must send the Supabase session access token on API requests. Redeploy the frontend after changing env vars.

## Vercel serverless functions

| File | Route |
|------|--------|
| `api/health.ts` | `GET /api/health` (public) |
| `api/[...path].ts` | NestJS catch-all for application API routes |

`vercel.json` configures function duration and CORS headers for the production frontend origin. `Authorization` is allowed for authenticated API calls.

## Post-deploy smoke tests

**Public health (no auth):**

```http
GET https://signalforge-api.vercel.app/api/health
```

Expected: JSON with `status: "ok"` and `service: "signalforge-api"`.

**Authenticated API** (replace `<ACCESS_TOKEN>` from Supabase Auth):

```http
GET https://signalforge-api.vercel.app/projects
Authorization: Bearer <ACCESS_TOKEN>
```

Expected: `[]` or a JSON array of projects owned by that user (archived projects excluded unless `?includeArchived=true`).

```http
PATCH https://signalforge-api.vercel.app/projects/{PROJECT_ID}
Authorization: Bearer <ACCESS_TOKEN>
Content-Type: application/json

{ "name": "Updated name" }
```

```http
PATCH https://signalforge-api.vercel.app/projects/{PROJECT_ID}/archive
Authorization: Bearer <ACCESS_TOKEN>
```

```http
DELETE https://signalforge-api.vercel.app/projects/{PROJECT_ID}
Authorization: Bearer <ACCESS_TOKEN>
```

```http
GET https://signalforge-api.vercel.app/projects/{PROJECT_ID}/workspace
Authorization: Bearer <ACCESS_TOKEN>
```

Expected: workspace JSON for an owned project, or `404` if not found / not owned.

## Local vs production

| Item | Local | Production |
|------|--------|------------|
| Env file | Copy `.env.example` → `.env` | Vercel env vars |
| Start API | `npm run start:dev` (port `3000`) | Vercel deploy |
| Health | `GET http://localhost:3000/health` | `GET /api/health` on Vercel |
| Product API | `Authorization: Bearer <token>` | Same |

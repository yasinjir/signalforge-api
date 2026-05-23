# Contributing to SignalForge API

Thank you for your interest in contributing to SignalForge.

## Project overview

SignalForge is an open-source product operations platform. This repository is the **backend API**: it turns raw product feedback into structured insights, reports, PRDs, and execution-ready tasks.

**Product flow:** Project → Inputs → Insights → Report → PRD → Tasks

Stack: NestJS, TypeScript, Prisma 7, Supabase Postgres, Vercel serverless functions.

## Local setup

1. Fork and clone the repository.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Copy environment variables:

   ```bash
   cp .env.example .env
   ```

   On Windows: `copy .env.example .env`

4. Fill in `.env` with your local or development values (see `.env.example`). **Never commit `.env`.**

5. Start the API:

   ```bash
   npm run start:dev
   ```

6. Verify the build:

   ```bash
   npm run build
   ```

See [README.md](README.md) for API details, auth, and deployment notes.

## Branches

- Create a branch from `main` for each change.
- Use descriptive names, for example:
  - `feature/workspace-pagination`
  - `fix/auth-guard-error-message`
  - `docs/update-deployment-guide`

## Commits

- Write clear, focused commit messages in the imperative mood.
- Examples:
  - `Add project workspace endpoint`
  - `Fix ownership check in inputs service`
  - `Document Supabase auth setup`
- Keep commits reasonably scoped; split unrelated changes when possible.

## Pull requests

1. Update your branch with the latest `main` if needed.
2. Run `npm run build` and fix any TypeScript errors.
3. Open a pull request against `main` with:
   - A short summary of what changed and why
   - Notes on testing you performed
   - Any follow-up work or breaking changes
4. Link related issues when applicable.
5. Wait for review and address feedback.

## Coding style expectations

- Match existing patterns in the codebase (NestJS modules, services, controllers).
- Use TypeScript types; avoid `any` unless necessary.
- Keep changes focused; avoid unrelated refactors in the same PR.
- Prefer clear names and small, readable functions.
- Run the formatter/linter if you touch formatted files (`npm run lint` when applicable).

## Secrets and configuration

- **Do not commit** `.env`, API keys, database passwords, or Supabase service role keys.
- Use `.env.example` for documented placeholder variables only.
- Do not hardcode credentials in source code.

## Before you open a PR

- [ ] `npm run build` passes
- [ ] No secrets or `.env` files in the diff
- [ ] README or docs updated if behavior or setup changed

## Questions

Open a [GitHub Discussion](https://github.com/yasinjir/signalforge-api/discussions) or an issue for questions that are not security-related.

For security issues, see [SECURITY.md](SECURITY.md).

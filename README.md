# sedcarrd

vinext (Next.js App Router on Vite) deployed to Cloudflare Workers, with an Elysia API, Drizzle + Postgres,
next-intl (German default) and shadcn/ui.

## Getting started

```sh
bun install
cp .env.example .env   # local credentials + connection strings
bun run db:up          # Postgres (dev + test) and S3 storage via docker compose
bun run db:migrate     # apply migrations to the dev database
bun run dev
```

## Local services (`docker-compose.yml`)

| Service   | Purpose                    | Host port | Connection (.env)                     |
| --------- | -------------------------- | --------- | ------------------------------------- |
| `db`      | Development Postgres 17    | 5433      | `DATABASE_URL`                        |
| `db-test` | Test Postgres (throw-away) | 5434      | `TEST_DATABASE_URL`                   |
| `storage` | RustFS, S3-compatible      | 9000/9001 | `S3_ENDPOINT`, `S3_ACCESS_KEY_ID`, …  |

`bun test` always uses `TEST_DATABASE_URL`, never the development database.

## Scripts

- `bun run dev` / `build` / `start` / `deploy`: develop, build, preview and deploy the Worker.
- `bun run test` / `test:watch`: unit and integration tests (bun test + Testing Library).
- `bun run test:e2e` / `test:e2e:watch`: Playwright. Set `PLAYWRIGHT_BASE_URL` to test a running server.
- `bun run db:up` / `db:down`: start / stop the docker services.
- `bun run db:generate`: create a migration from `features/*/db/schema.ts` into `drizzle/`.
- `bun run db:migrate` / `db:migrate:test`: apply migrations to the dev / test database.
- `bun run db:push` / `db:check` / `db:studio`: push schema directly, check migrations, open Drizzle Studio.
- `bun run auth:generate`: regenerate `features/auth/db/schema.ts` from the Better Auth config (after adding
  Better Auth plugins), then `bun run db:generate` for the migration.

## Authentication

Better Auth (email + password) lives in `features/auth`. Its endpoints are served by Elysia at `/api/auth/*`;
`GET /api/me` returns the signed-in user (use `auth: true` on any Elysia route to require a session).
Pages: `/login`, `/signup` and the protected `/dashboard` (all localized, e.g. `/en/login`).
`BETTER_AUTH_SECRET` and `BETTER_AUTH_URL` come from `.env` locally and are Worker secrets in production.

## End-to-end tests and the database

The auth e2e tests sign real users up, so the server under test needs a migrated database. To run them
against the throw-away test database:

```sh
bun run db:migrate:test
bun run build
DATABASE_URL=$TEST_DATABASE_URL BETTER_AUTH_URL=http://localhost:5199 bunx vite preview --port 5199 &
PLAYWRIGHT_BASE_URL=http://localhost:5199 bun run test:e2e
```

## Production database

The Worker reads `DATABASE_URL` as a secret (declared in `cloudflare.config.ts`).
Set it with `wrangler secret put DATABASE_URL`, or switch to a Hyperdrive binding for connection pooling.

See [features/README.md](features/README.md) for the project structure and conventions.

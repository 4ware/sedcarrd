# sedcarrd

vinext (Next.js App Router on Vite) deployed to Cloudflare Workers, with an Elysia API, Drizzle + Postgres,
next-intl (German default) and shadcn/ui.

## Getting started

```sh
bun install
cp .env.example .env   # local credentials + connection strings
bun run db:up          # Postgres (dev + test) and S3 storage via docker compose
bun run db:migrate     # apply migrations to the dev database
bun run storage:setup  # create the S3 buckets (dev + test) with CORS for local origins
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

Sign-up requires a confirmed email address: Better Auth mails a verification link (via Resend,
`lib/email/send-email.ts`) and creates no session until it is opened; the link signs the user in and leads to
the dashboard. Logging in while unconfirmed fails and mails a fresh link. `RESEND_API_KEY` is a Worker secret;
emails come from `hello@` the Resend-verified `RESEND_DOMAIN` (`cloudflare.config.ts`, `.env`). Without a key, emails
are only logged. `bun test` never sends email.

## End-to-end tests and the database

The auth e2e tests sign real users up, so the server under test needs a migrated database. They confirm
emails by signing the verification link with `BETTER_AUTH_SECRET` from `.env`, and sign up with Resend test
addresses (`delivered+…@resend.dev`), so real sends are harmless. To run them
against the throw-away test database:

```sh
bun run db:migrate:test
bun run build
DATABASE_URL=$TEST_DATABASE_URL S3_BUCKET=$S3_TEST_BUCKET BETTER_AUTH_URL=http://localhost:5199 bunx vite preview --port 5199 &
PLAYWRIGHT_BASE_URL=http://localhost:5199 bun run test:e2e
```

## Person images (S3)

Images are uploaded with [better-upload](https://better-upload.com): `POST /api/upload` (route `personImages`) checks
the session and ownership and returns pre-signed URLs; the browser uploads straight to the bucket and then registers
the keys with `POST /api/people/:id/images`, which verifies each object. The bucket stays private; the API returns
signed GET URLs (1 hour). Config: `S3_ENDPOINT`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY` (Worker secrets),
`S3_REGION`, `S3_BUCKET` (`cloudflare.config.ts`). The production bucket needs a CORS rule allowing `PUT` from the
app's origin. `bun test` uses `S3_TEST_BUCKET`.

## Production database

The Worker reads `DATABASE_URL` as a secret (declared in `cloudflare.config.ts`).
Set it with `wrangler secret put DATABASE_URL`, or switch to a Hyperdrive binding for connection pooling.

See [features/README.md](features/README.md) for the project structure and conventions.

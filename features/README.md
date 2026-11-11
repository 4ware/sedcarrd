# Features

Every feature lives in its own folder and owns its UI, logic and database schema:

```
features/<feature-name>/
├── api/
│   ├── routes.ts # Elysia plugin with this feature's endpoints (registered in server/app.ts)
│   ├── queries.ts# TanStack Query keys + queryOptions(client, …) for those endpoints
│   └── use-*.ts  # "use client" hooks wrapping the queries / mutations with the browser `api` client
├── components/   # UI used only by this feature (one component per file)
├── db/
│   └── schema.ts # Drizzle tables owned by this feature
├── lib/          # Server/client logic, data access, helpers
├── messages/     # next-intl catalogs: de.json (default) + en.json
└── index.ts      # Public API: the only file other code should import from
```

Translations: a feature's `messages/<locale>.json` is registered under its namespace in
[`i18n/messages.ts`](../i18n/messages.ts) and read with `useTranslations("<Namespace>")`.
Feature-agnostic strings live in the root [`messages/`](../messages) folder.

API: all endpoints are Elysia routes under `/api` (one app in [`server/app.ts`](../server/app.ts),
mounted by `app/api/[[...slugs]]/route.ts`). Every API interaction from the UI goes through
TanStack Query (`useQuery` / `useMutation`) using the typed Eden client from
[`lib/api/client.ts`](../lib/api/client.ts) and `unwrap()` from [`lib/api/unwrap.ts`](../lib/api/unwrap.ts).
Server Components that need data can prefetch the same `queryOptions` with `serverApi`
([`lib/api/server.ts`](../lib/api/server.ts)), which calls Elysia in-process. Never call `fetch("/api/…")` by hand.
[`lib/api/hello.ts`](../lib/api/hello.ts) + [`lib/api/use-hello.ts`](../lib/api/use-hello.ts) are the reference example.

Rules:

- `app/` routes stay thin: they import from `@/features/<name>` and render.
- Features may import from `@/components/*` (global components) but not from each other's internals,
  only via another feature's `index.ts`.
- Leave out subfolders a feature doesn't need (e.g. no `db/` for a static page).
- Colocate tests next to the file they cover: `*.test.ts(x)` for bun test, `*.e2e.ts` for Playwright.

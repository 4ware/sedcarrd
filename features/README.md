# Features

Every feature lives in its own folder and owns its UI, logic and database schema:

```
features/<feature-name>/
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

Rules:

- `app/` routes stay thin: they import from `@/features/<name>` and render.
- Features may import from `@/components/*` (global components) but not from each other's internals,
  only via another feature's `index.ts`.
- Leave out subfolders a feature doesn't need (e.g. no `db/` for a static page).
- Colocate tests next to the file they cover: `*.test.ts(x)` for bun test, `*.e2e.ts` for Playwright.

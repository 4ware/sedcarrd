import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

/** Reads the Postgres connection string. In tests it points at the test database (see test/test-env.ts). */
export function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set. Copy .env.example to .env and run `bun run db:up`.");
  return url;
}

/**
 * Creates a Drizzle client plus a `close()` to release its connection.
 *
 * Cloudflare Workers cannot reuse a socket across requests, so create one per request
 * (the Elysia `db` plugin does this) instead of a module-level singleton.
 * postgres.js connects lazily, so creating a client that never queries is free.
 */
export function createDb(url: string = getDatabaseUrl()) {
  const client = postgres(url, {
    max: 1,
    // Workers: skip the extra round-trip that fetches custom type OIDs on connect.
    fetch_types: false,
  });

  return {
    db: drizzle({ client }),
    close: () => client.end({ timeout: 5 }),
  };
}

export type Db = ReturnType<typeof createDb>["db"];

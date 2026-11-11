import { createDb } from "@/lib/db/client";
import { createAuth } from "./auth";

/**
 * Only for the Better Auth CLI, which needs a module exporting `auth`:
 *   bun run auth:generate
 * Never import this from app code. postgres.js connects lazily, so loading it opens no connection.
 */
export const auth = createAuth(createDb(process.env.DATABASE_URL ?? "postgres://localhost/unused").db);

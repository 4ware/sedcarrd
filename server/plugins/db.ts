import { Elysia } from "elysia";
import { createDb } from "@/lib/db/client";

/**
 * Gives routes a request-scoped Drizzle client as `db` and closes its connection after the response.
 * `.use(dbPlugin)` in any router that needs the database.
 */
export const dbPlugin = new Elysia({ name: "plugins/db" })
  .resolve({ as: "scoped" }, () => {
    const { db, close } = createDb();
    return { db, closeDb: close };
  })
  .onAfterResponse({ as: "scoped" }, async ({ closeDb }) => {
    await closeDb?.();
  });

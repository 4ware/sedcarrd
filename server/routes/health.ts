import { sql } from "drizzle-orm";
import { Elysia, t } from "elysia";
import { dbPlugin } from "../plugins/db";

/** Liveness + database readiness checks. */
export const healthRoutes = new Elysia({ name: "routes/health", prefix: "/health" })
  .get("/", () => ({ status: "ok" as const }), {
    response: t.Object({ status: t.Literal("ok") }),
  })
  .use(dbPlugin)
  .get(
    "/db",
    async ({ db, status }) => {
      try {
        await db.execute(sql`select 1`);
        return { database: "ok" as const };
      } catch {
        return status(503, { database: "unavailable" as const });
      }
    },
    {
      response: {
        200: t.Object({ database: t.Literal("ok") }),
        503: t.Object({ database: t.Literal("unavailable") }),
      },
    },
  );

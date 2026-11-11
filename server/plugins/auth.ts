import { Elysia } from "elysia";
import { createAuth } from "@/features/auth/lib/auth";
import { createDb } from "@/lib/db/client";

/** Looks up the Better Auth session for a request (own short-lived connection, Workers-safe). */
export async function getRequestSession(headers: Headers) {
  const { db, close } = createDb();
  try {
    return await createAuth(db).api.getSession({ headers });
  } finally {
    await close();
  }
}

/**
 * Adds the `auth: true` route option: anonymous requests get 401, authenticated handlers receive
 * `user` and `session`.
 */
export const authPlugin = new Elysia({ name: "plugins/auth" }).macro({
  auth: {
    async resolve({ request, status }) {
      const result = await getRequestSession(request.headers);
      if (!result) return status(401, { message: "Unauthorized" });
      return { user: result.user, session: result.session };
    },
  },
});

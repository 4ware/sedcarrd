import { Elysia, t } from "elysia";
import { createAuth } from "@/features/auth/lib/auth";
import { createDb } from "@/lib/db/client";
import { authPlugin } from "../plugins/auth";

const AUTH_BASE_PATH = "/api/auth";

/**
 * Better Auth's endpoints. Mount it on the root app with `.mount("/auth", handleAuthRequest)`:
 * mounting (instead of routing) leaves the request body unread for Better Auth, and `mount`
 * strips the mount path from the URL, so it is restored here.
 */
export async function handleAuthRequest(request: Request) {
  const url = new URL(request.url);
  url.pathname = AUTH_BASE_PATH + url.pathname;

  const { db, close } = createDb();
  try {
    return await createAuth(db).handler(new Request(url, request));
  } finally {
    await close();
  }
}

/** Typed account routes built on top of Better Auth sessions. */
export const accountRoutes = new Elysia({ name: "routes/account" }).use(authPlugin).get(
  "/me",
  ({ user }) => ({ id: user.id, name: user.name, email: user.email }),
  {
    auth: true,
    response: {
      200: t.Object({ id: t.String(), name: t.String(), email: t.String() }),
      401: t.Object({ message: t.String() }),
    },
  },
);

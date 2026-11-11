import { eq } from "drizzle-orm";
import { user } from "@/features/auth/db/schema";
import type { Db } from "@/lib/db/client";
import { app } from "@/server/app";
import { sessionCookie } from "./session-cookie";

const origin = process.env.BETTER_AUTH_URL ?? "http://localhost:5173";

/** POST JSON to the in-process app (with the Origin Better Auth's CSRF check expects). */
export function postJson(path: string, body: unknown, cookie?: string) {
  return app.fetch(
    new Request(`http://localhost${path}`, {
      method: "POST",
      headers: { "content-type": "application/json", origin, ...(cookie ? { cookie } : {}) },
      body: JSON.stringify(body),
    }),
  );
}

/**
 * Signs a user up, marks the email as confirmed and signs in. Returns the user id and session cookie.
 * The calling test file must stub "@/lib/email/send-email" (sign-up sends a verification email).
 */
export async function createSignedInUser(db: Db, email: string, password = "correct horse battery staple") {
  await postJson("/api/auth/sign-up/email", { name: "Test User", email, password });
  await db.update(user).set({ emailVerified: true }).where(eq(user.email, email));
  const signIn = await postJson("/api/auth/sign-in/email", { email, password });
  const [row] = await db.select({ id: user.id }).from(user).where(eq(user.email, email));
  if (!row) throw new Error(`user ${email} was not created`);
  return { id: row.id, cookie: sessionCookie(signIn) };
}

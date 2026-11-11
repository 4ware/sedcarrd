import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { treaty } from "@elysiajs/eden";
import { eq } from "drizzle-orm";
import { user } from "@/features/auth/db/schema";
import { createDb } from "@/lib/db/client";
import { app } from "../app";

const api = treaty(app).api;
const origin = process.env.BETTER_AUTH_URL ?? "http://localhost:5173";
const email = `auth-test-${crypto.randomUUID()}@example.com`;
const password = "correct horse battery staple";

function post(path: string, body: unknown, cookie?: string) {
  return app.fetch(
    new Request(`http://localhost${path}`, {
      method: "POST",
      headers: { "content-type": "application/json", origin, ...(cookie ? { cookie } : {}) },
      body: JSON.stringify(body),
    }),
  );
}

/** Turns Set-Cookie response headers into a Cookie request header. */
function sessionCookie(response: Response) {
  // happy-dom (preloaded for component tests) swaps in its own Headers without reliable
  // getSetCookie(), so fall back to the combined header.
  const setCookies =
    typeof response.headers.getSetCookie === "function" && response.headers.getSetCookie().length > 0
      ? response.headers.getSetCookie()
      : (response.headers.get("set-cookie") ?? "").split(/,(?=\s*[\w.-]+=)/);
  return setCookies
    .map((c) => c.split(";")[0]?.trim())
    .filter(Boolean)
    .join("; ");
}

// Runs against the migrated test database (`bun run db:up && bun run db:migrate:test`).
describe.skipIf(!process.env.TEST_DATABASE_URL)("auth API", () => {
  const { db, close } = createDb();

  beforeAll(async () => {
    await db.delete(user).where(eq(user.email, email));
  });

  afterAll(async () => {
    await db.delete(user).where(eq(user.email, email));
    await close();
  });

  test("GET /api/auth/ok", async () => {
    const response = await app.fetch(new Request("http://localhost/api/auth/ok"));
    expect(await response.json()).toEqual({ ok: true });
  });

  test("GET /api/me is 401 without a session", async () => {
    const { error } = await api.me.get();
    expect(error?.status).toBe(401);
  });

  test("sign up, sign in, read /api/me, sign out", async () => {
    const signUp = await post("/api/auth/sign-up/email", { name: "Test Person", email, password });
    expect(signUp.status).toBe(200);

    const wrong = await post("/api/auth/sign-in/email", { email, password: "nope-nope-nope" });
    expect(wrong.status).toBe(401);

    const signIn = await post("/api/auth/sign-in/email", { email, password });
    expect(signIn.status).toBe(200);
    const cookie = sessionCookie(signIn);
    expect(cookie).toContain("better-auth.session_token=");

    const { data: me } = await api.me.get({ headers: { cookie } });
    expect(me).toMatchObject({ name: "Test Person", email });

    const signOut = await post("/api/auth/sign-out", {}, cookie);
    expect(signOut.status).toBe(200);
  });

  test("rejects sign-up with a duplicate email", async () => {
    const again = await post("/api/auth/sign-up/email", { name: "Again", email, password });
    expect(again.status).toBe(422);
  });
});

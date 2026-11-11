import { afterAll, beforeAll, beforeEach, describe, expect, mock, test } from "bun:test";
import { treaty } from "@elysiajs/eden";
import { eq } from "drizzle-orm";
import { user } from "@/features/auth/db/schema";
import { createDb } from "@/lib/db/client";
import type { EmailMessage } from "@/lib/email/send-email";
import { sessionCookie } from "@/test/session-cookie";
import { app } from "../app";

/** Outgoing mail is captured here instead of going to Resend. */
const outbox: EmailMessage[] = [];
mock.module("@/lib/email/send-email", () => ({
  sendEmail: async (message: EmailMessage) => {
    outbox.push(message);
  },
}));

const api = treaty(app).api;
const origin = process.env.BETTER_AUTH_URL ?? "http://localhost:5173";
const email = `auth-test-${crypto.randomUUID()}@example.com`;
const password = "correct horse battery staple";
const callbackURL = `${origin}/en/dashboard`;

/** The verification link from the most recent email, rebased onto the in-process app. */
function lastVerificationPath() {
  const text = outbox.at(-1)?.text ?? "";
  const link = text.match(/https?:\/\/\S+\/api\/auth\/verify-email\?\S+/)?.[0];
  if (!link) throw new Error(`No verification link in: ${text}`);
  const url = new URL(link);
  return url.pathname + url.search;
}

function post(path: string, body: unknown, cookie?: string) {
  return app.fetch(
    new Request(`http://localhost${path}`, {
      method: "POST",
      headers: { "content-type": "application/json", origin, ...(cookie ? { cookie } : {}) },
      body: JSON.stringify(body),
    }),
  );
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

  beforeEach(() => {
    outbox.length = 0;
  });

  test("sign up, confirm the email, read /api/me, sign out, sign in", async () => {
    const signUp = await post("/api/auth/sign-up/email", { name: "Test Person", email, password, callbackURL });
    expect(signUp.status).toBe(200);
    expect(await signUp.json()).toMatchObject({ token: null });
    expect(sessionCookie(signUp)).not.toContain("better-auth.session_token=");

    expect(outbox).toHaveLength(1);
    expect(outbox[0]).toMatchObject({ to: email, subject: "Confirm your email address" });

    // Unverified: sign-in is refused and a fresh link goes out.
    const early = await post("/api/auth/sign-in/email", { email, password, callbackURL });
    expect(early.status).toBe(403);
    expect(await early.json()).toMatchObject({ code: "EMAIL_NOT_VERIFIED" });
    expect(outbox).toHaveLength(2);

    // Following the link verifies the address, signs in and redirects to the callback.
    const verify = await app.fetch(new Request(`http://localhost${lastVerificationPath()}`));
    expect(verify.status).toBe(302);
    expect(verify.headers.get("location")).toBe(callbackURL);
    const cookie = sessionCookie(verify);
    expect(cookie).toContain("better-auth.session_token=");

    const { data: me } = await api.me.get({ headers: { cookie } });
    expect(me).toMatchObject({ name: "Test Person", email });

    const signOut = await post("/api/auth/sign-out", {}, cookie);
    expect(signOut.status).toBe(200);

    const wrong = await post("/api/auth/sign-in/email", { email, password: "nope-nope-nope" });
    expect(wrong.status).toBe(401);

    const signIn = await post("/api/auth/sign-in/email", { email, password });
    expect(signIn.status).toBe(200);
    expect(sessionCookie(signIn)).toContain("better-auth.session_token=");
  });

  test("an invalid verification token does not sign anyone in", async () => {
    const response = await app.fetch(
      new Request(`http://localhost/api/auth/verify-email?token=forged&callbackURL=${encodeURIComponent(callbackURL)}`),
    );
    expect(response.status).toBe(302);
    expect(response.headers.get("location")).toContain("error=");
    expect(sessionCookie(response)).not.toContain("better-auth.session_token=");
  });

  test("a sign-up with a taken email looks like a new one and sends nothing", async () => {
    const again = await post("/api/auth/sign-up/email", { name: "Again", email, password, callbackURL });
    expect(again.status).toBe(200);
    expect(await again.json()).toMatchObject({ token: null });
    expect(outbox).toHaveLength(0);
  });
});

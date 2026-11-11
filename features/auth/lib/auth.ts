import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import type { Db } from "@/lib/db/client";
import { sendEmail } from "@/lib/email/send-email";
import * as schema from "../db/schema";
import { resetPasswordEmail } from "./reset-password-email";
import { verificationEmail } from "./verification-email";

function isLocalUrl(url: string | undefined) {
  return !!url && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/.test(url);
}

/**
 * Builds a Better Auth instance on top of a Drizzle client.
 *
 * Cloudflare Workers cannot share a database connection between requests, so an instance is
 * created per request (see server/plugins/auth.ts and ./session.ts) instead of a module singleton.
 * BETTER_AUTH_SECRET and BETTER_AUTH_URL are read from the environment.
 */
export function createAuth(db: Db) {
  const baseURL = process.env.BETTER_AUTH_URL;

  return betterAuth({
    appName: "Sedcarrd",
    basePath: "/api/auth",
    database: drizzleAdapter(db, { provider: "pg", schema }),
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 8,
      maxPasswordLength: 128,
      // No session until the address is confirmed. Sign-up then answers a taken email with the
      // same generic success as a new one, so it cannot be used to probe for accounts.
      requireEmailVerification: true,
      // Forgot password: the emailed link is valid for an hour, single use, and logs out everywhere.
      resetPasswordTokenExpiresIn: 60 * 60,
      revokeSessionsOnPasswordReset: true,
      sendResetPassword: async ({ user, url }) => {
        try {
          await sendEmail(resetPasswordEmail({ to: user.email, name: user.name, url }));
        } catch (error) {
          // The answer to the request stays the same either way (no hint whether the account exists).
          console.error("[auth] could not send the password reset email", error);
        }
      },
    },
    emailVerification: {
      sendOnSignUp: true,
      // Signing in while unverified fails with EMAIL_NOT_VERIFIED and mails a fresh link.
      sendOnSignIn: true,
      // Following the link signs the user in and redirects to the sign-up callbackURL.
      autoSignInAfterVerification: true,
      expiresIn: 60 * 60 * 24,
      // Awaited (no background task handler): a Worker may stop once the response is sent.
      sendVerificationEmail: async ({ user, url }) => {
        try {
          await sendEmail(verificationEmail({ to: user.email, name: user.name, url }));
        } catch (error) {
          // Keep sign-up working when the mail provider fails; the user can request a new link.
          console.error("[auth] could not send the verification email", error);
        }
      },
    },
    session: {
      // Re-validate against the database at most every 5 minutes; saves a query per request.
      cookieCache: { enabled: true, maxAge: 5 * 60 },
    },
    rateLimit: {
      // In-memory limits don't survive across Worker isolates; keep counters in Postgres.
      storage: "database",
    },
    // Local dev servers run on varying ports (dev, preview, Playwright).
    trustedOrigins: isLocalUrl(baseURL) ? ["http://localhost:*", "http://127.0.0.1:*"] : [],
  });
}

export type Auth = ReturnType<typeof createAuth>;
export type Session = Auth["$Infer"]["Session"];
export type SessionUser = Session["user"];


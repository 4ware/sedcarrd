import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createDb, type Db } from "@/lib/db/client";
import * as schema from "../db/schema";

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
      autoSignIn: true,
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


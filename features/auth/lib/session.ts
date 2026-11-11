import { headers } from "next/headers";
import { cache } from "react";
import { redirect } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { createDb } from "@/lib/db/client";
import { createAuth } from "./auth";

/** The current Better Auth session in Server Components (deduplicated per request). */
export const getSession = cache(async () => {
  const { db, close } = createDb();
  try {
    return await createAuth(db).api.getSession({ headers: await headers() });
  } finally {
    await close();
  }
});

/** Returns the session or redirects to the login page. */
export async function requireSession(locale: Locale) {
  const session = await getSession();
  if (!session) return redirect({ href: "/login", locale });
  return session;
}

/** Sends already signed-in users from login/sign-up straight to the dashboard. */
export async function redirectIfAuthenticated(locale: Locale) {
  if (await getSession()) redirect({ href: "/dashboard", locale });
}

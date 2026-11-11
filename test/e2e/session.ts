import { type Page, test } from "@playwright/test";
import { createEmailVerificationToken } from "better-auth/api";

export const e2ePassword = "correct horse battery staple";

/** Resend's test inbox: accepts any "+label" address without affecting deliverability. */
export const uniqueEmail = () =>
  `delivered+e2e-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@resend.dev`;

/** Opens the link from the verification email, signed the same way the server signs it. */
export async function confirmEmail(page: Page, email: string, callbackURL = "/dashboard") {
  const secret = process.env.BETTER_AUTH_SECRET;
  if (!secret) throw new Error("BETTER_AUTH_SECRET is not set (needed to build the verification link).");
  const token = await createEmailVerificationToken(secret, email);
  await page.goto(`/api/auth/verify-email?token=${token}&callbackURL=${encodeURIComponent(callbackURL)}`);
}

/** Signs a new, confirmed user up through the API and leaves the browser signed in on the dashboard. */
export async function signInAsNewUser(page: Page, name = "E2E Person") {
  const email = uniqueEmail();
  // Better Auth's CSRF check needs an Origin header, which a browser would send.
  const origin = new URL(test.info().project.use.baseURL ?? "http://localhost:5173").origin;
  const response = await page.request.post("/api/auth/sign-up/email", {
    data: { name, email, password: e2ePassword },
    headers: { origin },
  });
  if (!response.ok()) throw new Error(`Sign-up failed: ${response.status()} ${await response.text()}`);
  await confirmEmail(page, email);
  return { email };
}

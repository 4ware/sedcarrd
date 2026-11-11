import { expect, type Page, test } from "@playwright/test";
import { createEmailVerificationToken } from "better-auth/api";

// Needs a server whose DATABASE_URL points at a migrated database (see README → Testing) and the
// same BETTER_AUTH_SECRET as this process (loaded from .env by playwright.config.ts).
const password = "correct horse battery staple";
// Resend's test inbox: accepts any "+label" address without affecting deliverability.
const uniqueEmail = () => `delivered+e2e-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@resend.dev`;

/** Opens the link from the verification email, signed the same way the server signs it. */
async function confirmEmail(page: Page, email: string) {
  const secret = process.env.BETTER_AUTH_SECRET;
  if (!secret) throw new Error("BETTER_AUTH_SECRET is not set (needed to build the verification link).");
  const token = await createEmailVerificationToken(secret, email);
  await page.goto(`/api/auth/verify-email?token=${token}&callbackURL=${encodeURIComponent("/dashboard")}`);
}

async function signUp(page: Page, name: string, email: string) {
  await page.getByLabel("Name").fill(name);
  await page.getByLabel("E-Mail").fill(email);
  await page.getByLabel("Passwort", { exact: true }).fill(password);
  await page.getByLabel("Passwort wiederholen").fill(password);
  await page.getByRole("button", { name: "Konto erstellen" }).click();

  // No session yet: the user is asked to confirm the address first.
  await expect(page.getByRole("heading", { name: "Schau in dein Postfach" })).toBeVisible();
  await expect(page.getByText(email)).toBeVisible();
  await expect(page).toHaveURL(/\/signup$/);
}

test("anonymous visitors are sent from the dashboard to the login page", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole("heading", { name: "Willkommen zurück" })).toBeVisible();
});

test("sign up, confirm the email, log out from the sidebar menu, log back in", async ({ page }) => {
  const email = uniqueEmail();

  // Sign up → "check your inbox" → verification link → dashboard
  await page.goto("/signup");
  await signUp(page, "Mara Ellison", email);
  await confirmEmail(page, email);

  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole("heading", { name: "Hallo, Mara Ellison" })).toBeVisible();

  // Signed-in users skip the auth pages
  await page.goto("/login");
  await expect(page).toHaveURL(/\/dashboard$/);

  // User drop-down at the bottom of the sidebar: only "log out"
  const userMenu = page.getByRole("button", { name: "Kontomenü" });
  await expect(userMenu).toContainText(email);
  await userMenu.click();
  await expect(page.getByRole("menuitem")).toHaveCount(1);
  await page.getByRole("menuitem", { name: "Abmelden" }).click();

  await expect(page).toHaveURL(/\/login$/);
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/login$/);

  // Wrong password → message, right password → dashboard
  await page.getByLabel("E-Mail").fill(email);
  await page.getByLabel("Passwort", { exact: true }).fill("definitely-wrong");
  await page.getByRole("button", { name: "Anmelden" }).click();
  await expect(page.getByRole("alert")).toContainText("E-Mail oder Passwort ist falsch.");

  await page.getByLabel("Passwort", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Anmelden" }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
});

test("the sign-up form and the login form link to each other", async ({ page }) => {
  await page.goto("/en/login");
  await page.getByRole("link", { name: "Sign up" }).click();
  await expect(page).toHaveURL(/\/en\/signup$/);
  await page.getByRole("link", { name: "Log in" }).click();
  await expect(page).toHaveURL(/\/en\/login$/);
});

test("the landing page links to log in and sign up, and to the dashboard once signed in", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Anmelden" }).click();
  await expect(page).toHaveURL(/\/login$/);

  await page.goto("/");
  await page.getByRole("link", { name: "Schaffe Raum für deine Arbeit" }).click();
  await expect(page).toHaveURL(/\/signup$/);

  const email = uniqueEmail();
  await signUp(page, "Landing Visitor", email);
  await confirmEmail(page, email);
  await expect(page).toHaveURL(/\/dashboard$/);

  await page.goto("/");
  await expect(page.getByRole("link", { name: "Anmelden" })).toHaveCount(0);
  await page.getByRole("link", { name: "Zum Dashboard" }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
});

test("unconfirmed accounts cannot log in yet", async ({ page }) => {
  const email = uniqueEmail();
  await page.goto("/signup");
  await signUp(page, "Not Yet", email);

  await page.getByRole("link", { name: "Anmelden" }).click();
  await expect(page).toHaveURL(/\/login$/);
  await page.getByLabel("E-Mail").fill(email);
  await page.getByLabel("Passwort", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Anmelden" }).click();

  await expect(page.getByRole("alert")).toContainText("Bitte bestätige zuerst deine E-Mail-Adresse.");
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/login$/);
});

test("sign-up rejects mismatching passwords before calling the server", async ({ page }) => {
  await page.goto("/signup");
  await page.getByLabel("Name").fill("Mismatch");
  await page.getByLabel("E-Mail").fill(uniqueEmail());
  await page.getByLabel("Passwort", { exact: true }).fill(password);
  await page.getByLabel("Passwort wiederholen").fill(`${password}!`);
  await page.getByRole("button", { name: "Konto erstellen" }).click();

  await expect(page.getByText("Die Passwörter stimmen nicht überein.")).toBeVisible();
  await expect(page.getByLabel("Passwort wiederholen")).toBeFocused();
  await expect(page).toHaveURL(/\/signup$/);
});

test("the eye icon shows the password as plain text and hides it again", async ({ page }) => {
  await page.goto("/login");
  const input = page.getByLabel("Passwort", { exact: true });
  await input.fill("visible-secret");
  await expect(input).toHaveAttribute("type", "password");

  await page.getByRole("button", { name: "Passwort anzeigen" }).click();
  await expect(input).toHaveAttribute("type", "text");
  await expect(input).toHaveValue("visible-secret");

  await page.getByRole("button", { name: "Passwort verbergen" }).click();
  await expect(input).toHaveAttribute("type", "password");
});

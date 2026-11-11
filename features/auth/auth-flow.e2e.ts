import { expect, test } from "@playwright/test";

// Needs a server whose DATABASE_URL points at a migrated database (see README → Testing).
const password = "correct horse battery staple";
const uniqueEmail = () => `e2e-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.com`;

test("anonymous visitors are sent from the dashboard to the login page", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole("heading", { name: "Willkommen zurück" })).toBeVisible();
});

test("sign up, log out from the sidebar menu, log back in", async ({ page }) => {
  const email = uniqueEmail();

  // Sign up → dashboard
  await page.goto("/signup");
  await page.getByLabel("Name").fill("Mara Ellison");
  await page.getByLabel("E-Mail").fill(email);
  await page.getByLabel("Passwort", { exact: true }).fill(password);
  await page.getByLabel("Passwort wiederholen").fill(password);
  await page.getByRole("button", { name: "Konto erstellen" }).click();

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

  await page.getByLabel("Name").fill("Landing Visitor");
  await page.getByLabel("E-Mail").fill(uniqueEmail());
  await page.getByLabel("Passwort", { exact: true }).fill(password);
  await page.getByLabel("Passwort wiederholen").fill(password);
  await page.getByRole("button", { name: "Konto erstellen" }).click();
  await expect(page).toHaveURL(/\/dashboard$/);

  await page.goto("/");
  await expect(page.getByRole("link", { name: "Anmelden" })).toHaveCount(0);
  await page.getByRole("link", { name: "Zum Dashboard" }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
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

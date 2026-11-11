import { expect, test } from "@playwright/test";
import { e2ePassword, signInAsNewUser, uniqueEmail } from "@/test/e2e/session";

test("forgot password: from the login to the confirmation", async ({ browser, baseURL }) => {
  // An existing account (created in its own context, so this visitor is logged out).
  const owner = await browser.newContext({ baseURL, locale: "de-DE" });
  const { email } = await signInAsNewUser(await owner.newPage());
  await owner.close();

  const visitor = await browser.newContext({ baseURL, locale: "de-DE" });
  const page = await visitor.newPage();
  await page.goto("/login");
  await page.getByRole("link", { name: "Passwort vergessen?" }).click();
  await expect(page).toHaveURL(/\/forgot-password$/);
  await expect(page).toHaveTitle("Passwort vergessen — Sedcarrd");

  await page.getByLabel("E-Mail").fill(email);
  await page.getByRole("button", { name: "Link zum Zurücksetzen senden" }).click();
  await expect(page.getByRole("heading", { name: "Schau in dein Postfach" })).toBeVisible();
  await expect(page.getByRole("status")).toContainText(email);
  await page.screenshot({ path: "test-results/forgot-password.png", animations: "disabled" });

  // Unknown addresses get exactly the same answer.
  await page.getByRole("button", { name: "Andere E-Mail-Adresse verwenden" }).click();
  await page.getByLabel("E-Mail").fill(uniqueEmail());
  await page.getByRole("button", { name: "Link zum Zurücksetzen senden" }).click();
  await expect(page.getByRole("heading", { name: "Schau in dein Postfach" })).toBeVisible();
  await visitor.close();
});

test("a reset link without a valid token offers a new one", async ({ page }) => {
  for (const path of ["/reset-password", "/reset-password?error=INVALID_TOKEN"]) {
    await page.goto(path);
    await expect(page.getByRole("heading", { name: "Link ungültig" })).toBeVisible();
  }
  await page.getByRole("link", { name: "Neuen Link anfordern" }).click();
  await expect(page).toHaveURL(/\/forgot-password$/);
});

test("a rejected token (e.g. already used) shows the same", async ({ page }) => {
  await page.goto("/reset-password?token=not-a-real-token");
  await page.getByLabel("Passwort", { exact: true }).fill(e2ePassword);
  await page.getByLabel("Passwort wiederholen").fill(e2ePassword);
  await page.getByRole("button", { name: "Passwort speichern" }).click();
  await expect(page.getByRole("heading", { name: "Link ungültig" })).toBeVisible();
});

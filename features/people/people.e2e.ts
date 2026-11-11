import { expect, test } from "@playwright/test";
import { signInAsNewUser } from "@/test/e2e/session";

test("create a person from the dashboard and see it in the list", async ({ page }) => {
  await signInAsNewUser(page, "People Owner");
  await expect(page.getByText("Noch keine Personen")).toBeVisible();

  await page.getByRole("link", { name: "Person anlegen" }).click();
  await expect(page).toHaveURL(/\/dashboard\/people\/new$/);
  await expect(page).toHaveTitle("Person anlegen — Sedcarrd");

  // Required fields are checked before anything is sent.
  await page.getByRole("button", { name: "Person speichern" }).click();
  await expect(page.getByText("Bitte gib einen Vornamen ein.")).toBeVisible();

  await page.getByLabel("Vorname").fill("Lena");
  await page.getByLabel("Nachname").fill("Vogt");
  await page.getByLabel("Berufe").fill("Schauspielerin, Sprecherin");
  await page.getByLabel("Geburtsjahr").fill("1994");
  await page.getByLabel("Unmittelbarer Arbeitsort").fill("Berlin");
  await page.screenshot({ path: "test-results/person-new.png", animations: "disabled" });
  await page.getByRole("button", { name: "Person speichern" }).click();

  await expect(page).toHaveURL(/\/dashboard$/);
  const entry = page.getByRole("listitem").filter({ hasText: "Lena Vogt" });
  await expect(entry).toContainText("Schauspielerin, Sprecherin");
  await expect(entry).toContainText(`${new Date().getFullYear() - 1994} Jahre · Berlin`);
  await page.screenshot({ path: "test-results/dashboard-people.png", animations: "disabled" });
});

import { expect, test } from "@playwright/test";

test("landing page renders header and hero", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/Sedcarrd/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("good frame.");
  await expect(page.getByRole("link", { name: "See what a page can hold" })).toBeVisible();
  await expect(page.getByRole("article")).toContainText("Mara Ellison");
});

test("primary call to action jumps to the page section", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("link", { name: "See what a page can hold" }).click();
  await expect(page).toHaveURL(/#your-page$/);
});

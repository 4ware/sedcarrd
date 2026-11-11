import { expect, test } from "@playwright/test";

test("serves German by default at /", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/Deine Arbeit verdient/);
  await expect(page.locator("html")).toHaveAttribute("lang", "de");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("guten Rahmen.");
  await expect(page.getByRole("article")).toContainText("Mara Ellison");
});

test("serves English under /en", async ({ page }) => {
  await page.goto("/en");

  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("good frame.");
});

test("switches language from the navigation drop-down", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Sprache wählen" }).click();
  await page.getByRole("menuitem", { name: "English" }).click();

  await expect(page).toHaveURL(/\/en$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("good frame.");

  await page.getByRole("button", { name: "Choose language" }).click();
  await page.getByRole("menuitem", { name: "Deutsch" }).click();

  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("guten Rahmen.");
});

test("primary call to action jumps to the page section", async ({ page }) => {
  await page.goto("/en");

  await page.getByRole("link", { name: "See what a page can hold" }).click();
  await expect(page).toHaveURL(/#your-page$/);
});

test.describe("with an English browser", () => {
  test.use({ locale: "en-US" });

  test("first visit to / is redirected to /en", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/en$/);
  });
});

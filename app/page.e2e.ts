import { expect, test } from "@playwright/test";

test("home page renders and links to the API route", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle("vinext on Cloudflare Workers");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Build Next.js-style apps");

  await page.getByRole("link", { name: "API route" }).click();
  await expect(page).toHaveURL(/\/api\/hello$/);
  await expect(page.locator("body")).toContainText("Hello from vinext on Cloudflare Workers");
});

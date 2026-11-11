import { expect, type Page, test } from "@playwright/test";
import { signInAsNewUser } from "@/test/e2e/session";

/** Every page: exactly one <main> and one <h1>. */
async function expectPageOutline(page: Page) {
  await expect(page.getByRole("main")).toHaveCount(1);
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
}

test("public pages have one main landmark, one h1 and named navigation", async ({ page }) => {
  await page.goto("/");
  await expectPageOutline(page);
  await expect(page.getByRole("banner")).toHaveCount(1);
  await expect(page.getByRole("navigation", { name: "Hauptnavigation" })).toBeAttached();
  await expect(page.getByRole("region", { name: "Deine Arbeit verdient einen guten Rahmen." })).toBeVisible();
  await expect(page.getByRole("article", { name: "Mara Ellison" })).toBeVisible();

  for (const path of ["/login", "/signup"]) {
    await page.goto(path);
    await expectPageOutline(page);
    // The logo sits in the page header, the form alone in <main>.
    await expect(page.getByRole("banner").getByRole("link")).toHaveCount(1);
    await expect(page.getByRole("main").getByRole("form")).toHaveCount(1);
  }
});

test("dashboard, editor and public person page have one main landmark and one h1", async ({ page }) => {
  await signInAsNewUser(page);
  await expectPageOutline(page);
  await expect(page.getByRole("navigation", { name: "Dashboard-Navigation" })).toBeVisible();
  await expect(page.getByRole("region", { name: /^Hallo,/ })).toBeVisible();

  const created = await page.request.post("/api/people", {
    data: { firstName: "Lena", lastName: "Vogt", professions: [], birthYear: null, birthPlace: null, workingLocation: null },
  });
  const { id, slug } = (await created.json()) as { id: string; slug: string };

  await page.goto("/dashboard");
  await expect(page.getByRole("heading", { level: 3, name: "Lena Vogt" })).toBeVisible();

  await page.goto(`/dashboard/editor/${id}`);
  await expectPageOutline(page);

  await page.goto(`/people/${slug}`);
  await expectPageOutline(page);
  await expect(page.getByRole("article")).toHaveCount(1);
});

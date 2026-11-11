import { expect, test } from "@playwright/test";
import { signInAsNewUser } from "@/test/e2e/session";

test("a person's public page shows them in their theme, without login", async ({ page, browser, baseURL }) => {
  // Owner creates a person with a theme.
  await signInAsNewUser(page);
  const created = await page.request.post("/api/people", {
    data: {
      firstName: "Lena",
      lastName: `Vogt ${Date.now().toString(36)}`,
      professions: ["Schauspielerin", "Sprecherin"],
      birthYear: 1994,
      birthPlace: "Berlin",
      workingLocation: "Berlin",
    },
  });
  const { id, slug } = (await created.json()) as { id: string; slug: string };
  await page.request.patch(`/api/people/${id}`, { data: { languages: ["Deutsch", "Englisch"] } });

  // The owner picks a theme in the editor and goes to the public page without pressing "Fertig".
  await page.goto(`/dashboard/editor/${id}`);
  await page.getByRole("navigation", { name: "Editor" }).getByRole("button", { name: "Design ändern" }).click();
  await page.getByRole("dialog", { name: "Design" }).locator("label", { hasText: "Nacht" }).click();
  await expect(page.locator('[data-theme-key="midnight"]')).toBeVisible();
  await expect
    .poll(async () => ((await (await page.request.get(`/api/public/people/${slug}`)).json()) as { theme: string }).theme)
    .toBe("midnight");

  // The editor links to the public page.
  await expect(page.getByRole("link", { name: "Öffentliche Seite ansehen (neuer Tab)" })).toHaveAttribute(
    "href",
    `/people/${slug}`,
  );

  // A visitor without a session.
  const visitor = await browser.newContext({ baseURL, locale: "de-DE" });
  const publicPage = await visitor.newPage();

  // Rendered on the server: the HTML already contains the person.
  const html = await (await publicPage.request.get(`/people/${slug}`)).text();
  expect(html).toContain("Schauspielerin");

  await publicPage.goto(`/people/${slug}`);
  await expect(publicPage).toHaveTitle(/^Lena Vogt .+ — Sedcarrd$/);
  await expect(publicPage.locator('[data-theme-key="midnight"]')).toBeVisible();
  await expect(publicPage.getByRole("heading", { level: 1 })).toContainText("Lena Vogt");
  await expect(publicPage.getByText("Geboren 1994 in Berlin")).toBeVisible();
  await expect(publicPage.getByText("Deutsch, Englisch")).toBeVisible();
  // Read-only, and empty sections (photos) are left out.
  await expect(publicPage.getByRole("button")).toHaveCount(0);
  await expect(publicPage.getByText("Fotos hinzufügen")).toHaveCount(0);
  await publicPage.screenshot({ path: "test-results/public-person.png", animations: "disabled", fullPage: true });

  // English URL works too.
  await publicPage.goto(`/en/people/${slug}`);
  await expect(publicPage.getByText("Born 1994 in Berlin")).toBeVisible();
  await visitor.close();
});

test("unknown slugs are a 404", async ({ request }) => {
  const response = await request.get("/people/nobody-has-this-slug-123");
  expect(response.status()).toBe(404);
});

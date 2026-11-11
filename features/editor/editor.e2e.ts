import { expect, test } from "@playwright/test";
import { signInAsNewUser } from "@/test/e2e/session";

test("a person opens from the dashboard in the editor, loaded and editable", async ({ page }) => {
  await signInAsNewUser(page);
  // The browser context carries the session cookie, so page.request acts as the signed-in user.
  const created = await page.request.post("/api/people", {
    data: { firstName: "Lena", lastName: "Vogt", professions: [], birthYear: null, birthPlace: null, workingLocation: null },
  });
  expect(created.ok()).toBe(true);
  const { id } = (await created.json()) as { id: string };

  // Dashboard list → editor for that person (full screen, no sidebar).
  await page.goto("/dashboard");
  await page.getByRole("link", { name: "Lena Vogt" }).click();
  await expect(page).toHaveURL(new RegExp(`/dashboard/editor/${id}$`));
  await expect(page).toHaveTitle("Editor — Sedcarrd");
  await expect(page.getByRole("link", { name: "Übersicht" })).toHaveCount(0);

  const sitePage = page.getByRole("main", { name: "Deine Seite" });
  const nameElement = sitePage.getByRole("button", { name: "Name bearbeiten" });
  const nameHeading = sitePage.getByRole("heading", { level: 1 });
  await expect(nameHeading).toContainText("Lena Vogt");

  // The drawer starts with the loaded data.
  await nameElement.click();
  const drawer = page.getByRole("dialog", { name: "Name" });
  await expect(drawer.getByLabel("Vorname")).toHaveValue("Lena");
  await expect(drawer.getByLabel("Nachname")).toHaveValue("Vogt");
  await expect(drawer.getByLabel("Vorname")).toBeFocused();

  await drawer.getByLabel("Nachname").fill("Ellison");
  await expect(nameHeading).toContainText("Lena Ellison");
  await page.screenshot({ path: "test-results/editor-drawer.png", animations: "disabled" });

  // Invalid input keeps the drawer open; valid input is saved on "Fertig".
  await drawer.getByLabel("Vorname").fill("");
  await drawer.getByRole("button", { name: "Fertig" }).click();
  await expect(drawer.getByText("Bitte gib einen Vornamen ein.")).toBeVisible();
  await drawer.getByLabel("Vorname").fill("Mara");
  await drawer.getByRole("button", { name: "Fertig" }).click();
  await expect(drawer).toBeHidden();

  // Basisdaten: each block opens its own fields.
  await sitePage.getByRole("button", { name: "Aussehen bearbeiten" }).click();
  const appearance = page.getByRole("dialog", { name: "Aussehen" });
  await appearance.getByLabel("Körpergröße (cm)").fill("170");
  await appearance.getByLabel("Augenfarbe").fill("grün");
  await appearance.getByRole("button", { name: "Fertig" }).click();
  await expect(appearance).toBeHidden();
  await sitePage.getByRole("button", { name: "Fähigkeiten bearbeiten" }).click();
  const skills = page.getByRole("dialog", { name: "Fähigkeiten" });
  await skills.getByLabel("Sprachen").fill("Deutsch, Englisch");
  await skills.getByRole("button", { name: "Fertig" }).click();
  await expect(skills).toBeHidden();

  // Theme: previewed while picking, saved with "Fertig".
  const toolbar = page.getByRole("navigation", { name: "Editor" });
  await toolbar.getByRole("button", { name: "Design ändern" }).click();
  const design = page.getByRole("dialog", { name: "Design" });
  for (const [label, key] of [
    ["Mono", "mono"],
    ["Nacht", "midnight"],
    ["Abendrot", "sunset"],
    ["Klassisch", "classic"],
  ] as const) {
    // The radios are visually hidden; users click the theme card (their label).
    await design.locator("label", { hasText: label }).click();
    await expect(design.getByRole("radio", { name: label, exact: true })).toBeChecked();
    await expect(page.locator(`[data-theme-key="${key}"]`)).toBeVisible();
    // Screenshot of the page alone (drawer hidden for the shot only).
    const drawerElement = await design.elementHandle();
    await drawerElement?.evaluate((el) => (el as HTMLElement).style.setProperty("visibility", "hidden"));
    await page.screenshot({ path: `test-results/theme-${key}.png`, animations: "disabled", fullPage: true });
    await drawerElement?.evaluate((el) => (el as HTMLElement).style.removeProperty("visibility"));
  }
  await design.locator("label", { hasText: "Abendrot" }).click();
  await design.getByRole("button", { name: "Fertig" }).click();
  await expect(design).toBeHidden();

  // Saved: still there after a reload, and in the dashboard list.
  await page.reload();
  await expect(nameHeading).toContainText("Mara Ellison");
  await expect(sitePage.getByText("170 cm")).toBeVisible();
  await expect(sitePage.getByText("Deutsch, Englisch")).toBeVisible();
  await expect(page.locator('[data-theme-key="sunset"]')).toBeVisible();
  await page.screenshot({ path: "test-results/editor.png", animations: "disabled", fullPage: true });
  await toolbar.getByRole("link", { name: "Zurück zum Dashboard" }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole("link", { name: "Mara Ellison" })).toBeVisible();
});

test("an unknown person shows a message instead of the editor", async ({ page }) => {
  await signInAsNewUser(page);
  await page.goto("/dashboard/editor/00000000-0000-4000-8000-000000000000");
  await expect(page.getByRole("alert")).toHaveText("Diese Person gibt es nicht (mehr).");
});

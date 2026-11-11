import { expect, test } from "@playwright/test";
import { signInAsNewUser } from "@/test/e2e/session";

/** 40×50 PNGs (red, blue), generated with valid checksums: real images the browser decodes. */
const RED_PNG = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAACgAAAAyCAIAAACh0Q7HAAAAM0lEQVR4nO3NIREAAAgEsK+GoL8jDzEQ7G5+ma4TEYvFYrFYLBaLxWKxWCwWi8VisfhzvNl5n1cSx63wAAAAAElFTkSuQmCC", "base64");
const BLUE_PNG = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAACgAAAAyCAIAAACh0Q7HAAAAM0lEQVR4nO3NMQ0AAAgDsGnDDP5QiAwOmvRvqudExGKxWCwWi8VisVgsFovFYrFYLP4cL4u9l4fytjhMAAAAAElFTkSuQmCC", "base64");

test("photos upload straight to storage, show up in the theme and can be deleted", async ({ page }) => {
  await signInAsNewUser(page);
  const created = await page.request.post("/api/people", {
    data: { firstName: "Lena", lastName: "Vogt", professions: [], birthYear: null, birthPlace: null, workingLocation: null },
  });
  const { id } = (await created.json()) as { id: string };
  await page.goto(`/dashboard/editor/${id}`);

  const sitePage = page.getByRole("main", { name: "Deine Seite" });
  await expect(sitePage.getByText("Fotos hinzufügen")).toBeVisible();

  await sitePage.getByRole("button", { name: "Fotos bearbeiten" }).click();
  const drawer = page.getByRole("dialog", { name: "Fotos" });
  await drawer.locator('input[type="file"]').setInputFiles([
    { name: "rot.png", mimeType: "image/png", buffer: RED_PNG },
    { name: "blau.png", mimeType: "image/png", buffer: BLUE_PNG },
  ]);

  // Uploaded and registered: thumbnails in the drawer, photos on the page, loaded from storage.
  const thumbnails = drawer.getByRole("list", { name: "Hochgeladene Fotos" }).getByRole("listitem");
  await expect(thumbnails).toHaveCount(2);
  await expect(drawer.getByText("2 von 24 Fotos")).toBeVisible();
  const photos = sitePage.getByRole("img", { name: /^Lena Vogt, Foto/ });
  await expect(photos).toHaveCount(2);
  await expect
    .poll(() => photos.first().evaluate((img) => (img as HTMLImageElement).naturalWidth))
    .toBeGreaterThan(0);
  await page.screenshot({ path: "test-results/photos-drawer.png", animations: "disabled" });

  await drawer.getByRole("button", { name: "Fertig" }).click();
  await expect(drawer).toBeHidden();

  // Saved: still there after a reload, in another theme too.
  await page.reload();
  await expect(photos).toHaveCount(2);
  await page.request.patch(`/api/people/${id}`, { data: { theme: "noir" } });
  await page.reload();
  await expect(page.locator('[data-theme-key="noir"]')).toBeVisible();
  await expect(photos).toHaveCount(2);
  await page.screenshot({ path: "test-results/photos-noir.png", animations: "disabled", fullPage: true });

  // The dashboard list shows the first photo as thumbnail.
  await page.goto("/dashboard");
  const row = page.getByRole("listitem").filter({ hasText: "Lena Vogt" });
  const thumbnail = row.locator("img");
  await expect(thumbnail).toBeVisible();
  await expect.poll(() => thumbnail.evaluate((img) => (img as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  await page.screenshot({ path: "test-results/people-list-thumbnail.png", animations: "disabled" });

  // Delete both: the editor and the list show none.
  await page.goto(`/dashboard/editor/${id}`);
  await sitePage.getByRole("button", { name: "Fotos bearbeiten" }).click();
  await drawer.getByRole("button", { name: "Foto 1 löschen" }).click();
  await expect(thumbnails).toHaveCount(1);
  await expect(photos).toHaveCount(1);
  await drawer.getByRole("button", { name: "Foto 1 löschen" }).click();
  await expect(thumbnails).toHaveCount(0);
  await page.goto("/dashboard");
  await expect(row.locator("img")).toHaveCount(0);
  await expect(row.getByTestId("person-initials")).toHaveText("LV");
});

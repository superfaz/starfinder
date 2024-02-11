import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Bienvenue !/, level: 1 })).toBeVisible();
});

test("has create link", async ({ page }) => {
  await page.goto("/");

  // Click the create link
  await page.getByRole("link", { name: /Créer un personnage/ }).click();

  // Expect a navigation to the create page
  await expect(page).toHaveURL(/\/create/);
  await expect(page.getByRole("heading", { name: /Création de personnage/, level: 1 })).toBeVisible();
});

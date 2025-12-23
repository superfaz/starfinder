import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Bienvenue à toi/, level: 1 })).toBeVisible();
});

test("has create link", async ({ page }) => {
  await page.goto("/");

  // Click the create link
  await page.getByRole("link", { name: /Démarrer la création/ }).click();

  // Expect a navigation to the edit page
  await expect(page).toHaveURL(/\/edit/);
  await expect(page.getByRole("heading", { name: /Introduction/, level: 2 })).toBeVisible();
});

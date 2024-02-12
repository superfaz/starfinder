import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("/create");
  await expect(page.getByRole("heading", { name: /Création de personnage/, level: 1 })).toBeVisible();
});

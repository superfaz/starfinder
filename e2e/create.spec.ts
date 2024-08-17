import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("/edit/1");
  await expect(page.getByRole("heading", { name: /Introduction/, level: 2 })).toBeVisible();
});

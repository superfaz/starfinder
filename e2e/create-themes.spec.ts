import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/create/1");
  await page.getByRole("link", { name: /Race/ }).click();
  await page.getByRole("combobox", { name: /Race/ }).selectOption("Shirrens");

  await page.getByRole("link", { name: /Thème/ }).click();
  await expect(page.getByRole("heading", { name: /Thème/, level: 2 })).toBeVisible();
});

test("can display Theme tab", async ({ page }) => {
  await expect(page.getByRole("heading", { name: /Thème/, level: 2 })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Traits thématiques/, level: 2 })).not.toBeVisible();
});

const table = [
  { label: "Chasseur de primes", expected: "Chasseur réactif" },
  { label: "Erudit", expected: "Sur le bout de la langue" },
  { label: "Sans thème", expected: "Certitude" },
];

test("has expected theme choices", async ({ page }) => {
  const options = await page.getByRole("combobox", { name: /Thème/ }).getByRole("option").all();
  const optionTexts = await Promise.all(options.map(async (o) => await o.innerText()));

  expect(options).not.toHaveLength(0);
  expect(optionTexts).toContain("");
  for (const context of table) {
    expect(optionTexts).toContain(context.label);
  }
});

for (const context of table) {
  test(`can display theme choices for '${context.label}'`, async ({ page }) => {
    await page.getByRole("combobox", { name: /Thème/ }).selectOption(context.label);

    await expect(page.getByText(context.expected, { exact: true })).toBeVisible();
  });
}

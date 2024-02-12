import { test, expect } from "@playwright/test";

test("can display Race tab", async ({ page }) => {
  await page.goto("/create");

  await page.getByRole("button", { name: /Race/ }).click();

  await expect(page.getByRole("heading", { name: /Race/, level: 2 })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Traits raciaux/, level: 2 })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Traits alternatifs/, level: 2 })).toBeVisible();
});

const table = [
  { label: "Androïdes", expected: "Fabriqué" },
  { label: "Humains", expected: "Don supplémentaire" },
  { label: "Kasathas", expected: "Foulée du désert" },
  { label: "Lashuntas", expected: "Magie des lashuntas" },
  { label: "Shirrens", expected: "Perception aveugle" },
  { label: "Vesks", expected: "Expert en armure" },
  { label: "Ysokis", expected: "Abajoues" },
];

for (const context of table) {
  test(`can display race choices for '${context.label}'`, async ({ page }) => {
    await page.goto("/create");

    await page.getByRole("button", { name: /Race/ }).click();
    await expect(page.getByRole("heading", { name: /Race/, level: 2 })).toBeVisible();
    await page.getByRole("combobox", { name: /Race/ }).selectOption(context.label);

    await expect(page.getByText(context.expected, { exact: true })).toBeVisible();
  });
}

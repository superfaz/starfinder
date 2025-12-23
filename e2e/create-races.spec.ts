import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/edit/1");
  await page.getByRole("link", { name: /Race/ }).click();
  await expect(page.getByRole("heading", { name: /Race/, level: 2 })).toBeVisible();
});

test("can display Race tab", async ({ page }) => {
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
  { label: "Demi-elfes", expected: "Adaptabilité" },
  { label: "Demi-orques", expected: "Autonome" },
  { label: "Elfes", expected: "Immunités elfiques" },
  { label: "Gnomes", expected: "Curieux" },
  { label: "Halflings", expected: "Chance des halfelins" },
  { label: "Nains", expected: "Connaissances de la pierre" },
];

test("has expected race choices", async ({ page }) => {
  const options = await page.getByRole("combobox", { name: /Race/ }).getByRole("option").all();
  const optionTexts = await Promise.all(options.map(async (o) => await o.innerText()));

  expect(options).not.toHaveLength(0);
  expect(optionTexts).toEqual(["", ...table.map((context) => context.label)]);
});

for (const context of table) {
  test(`can display race choices for '${context.label}'`, async ({ page }) => {
    await page.getByRole("combobox", { name: /Race/ }).selectOption(context.label);

    await expect(page.getByText(context.expected, { exact: true })).toBeVisible();
  });
}

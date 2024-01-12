import { beforeEach, describe, expect, test } from "@jest/globals";
import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Page from "../page";

const races = [
  {
    id: "androids",
    label: "Androïdes",
    abilities: [
      "Androïde",
      "Fabriqué",
      "Vision nocturne",
      "Vision dans le noir",
      "Emotions contrôlées",
      "Emplacement d'amélioration",
    ],
  },
  { id: "humans", label: "Humains", abilities: [] },
];

const themes = [
  { id: "bounty-hunter", label: "Chasseur de primes", abilities: ["Chasseur de primes"] },
  { id: "scholar", label: "Erudit", abilities: ["Erudit"] },
  { id: "themeless", label: "Sans thème", abilities: [] },
];

const classes = [
  { id: "operative", label: "Agent", abilities: ["Feinte offensive"] },
  { id: "soldier", label: "Soldat", abilities: [] },
];

describe("TabSheet", () => {
  beforeEach(async () => {
    render(await Page());
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Fiche" }));
  });

  test("is not displayed", async () => {
    const content = within(document.querySelector("#content") as HTMLElement);
    expect(content.queryByRole("heading", { level: 2, name: "Fiche de personnage" })).toBeNull();
  });
});

describe("TabSheet", () => {
  beforeEach(async () => {
    render(await Page());
  });

  test("is displayed", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Fiche" }));
    const content = within(document.querySelector("#content") as HTMLElement);

    expect(content.getByTestId("Race")).toBeVisible();
  });

  const emptyByDefault = [
    ["Name", "Nom du personnage"],
    ["Class", "Classe"],
    ["Race", "Race"],
    ["Theme", "Thème"],
    ["Sex", "Sexe"],
    ["Home world", "Monde natal"],
    ["Alignment", "Alignement"],
    ["Deity", "Divinité"],
  ];

  test.each(emptyByDefault)("has %s empty by default", async (_, label) => {
    const view = screen.getByTestId(label);
    expect(within(view).queryByText(label)).not.toBeNull();
    expect(within(view).queryByText("-")).not.toBeNull();
  });

  const fixedValueByDefault = [
    ["Level", "Niveau", "1"],
    ["Size", "Taille", "Normale"],
    ["Speed", "Vitesse", "Normale"],
  ];

  test.each(fixedValueByDefault)("has %s has its default value", async (_, label, defaultValue) => {
    const view = screen.getByTestId(label);
    expect(within(view).queryByText(label)).not.toBeNull();
    expect(within(view).queryByText(defaultValue)).not.toBeNull();
  });

  test.each(races)("has Race updated for '$id'", async (race) => {
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Race" }));
    await user.selectOptions(screen.getByRole("combobox", { name: "Race" }), race.id);
    await user.click(screen.getByRole("button", { name: "Fiche" }));

    const view = screen.getByTestId("Race");
    expect(within(view).queryByText("Race")).toBeVisible();
    expect(within(view).queryByText("-")).toBeNull();
    expect(within(view).queryByText(race.label)).not.toBeNull();
  });

  test.each(themes)("has Theme updated for '$id'", async (theme) => {
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Race" }));
    await user.selectOptions(screen.getByRole("combobox", { name: "Race" }), races[0].id);
    await user.click(screen.getByRole("button", { name: "Thème" }));
    await user.selectOptions(screen.getByRole("combobox", { name: "Thème" }), theme.id);
    await user.click(screen.getByRole("button", { name: "Fiche" }));

    const view = screen.getByTestId("Thème");
    expect(within(view).queryByText("Thème")).toBeVisible();
    expect(within(view).queryByText("-")).toBeNull();
    expect(within(view).queryByText(theme.label)).not.toBeNull();
  });

  test.each(classes)("has Class updated for '$id'", async (klass) => {
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Race" }));
    await user.selectOptions(screen.getByRole("combobox", { name: "Race" }), races[0].id);
    await user.click(screen.getByRole("button", { name: "Thème" }));
    await user.selectOptions(screen.getByRole("combobox", { name: "Thème" }), themes[0].id);
    await user.click(screen.getByRole("button", { name: "Classe" }));
    await user.selectOptions(screen.getByRole("combobox", { name: "Classe" }), klass.id);
    await user.click(screen.getByRole("button", { name: "Fiche" }));

    const view = screen.getByTestId("Classe");
    expect(within(view).queryByText("Classe")).toBeVisible();
    expect(within(view).queryByText("-")).toBeNull();
    expect(within(view).queryByText(klass.label)).not.toBeNull();
  });

  const profileTexts = [
    ["Name", "Nom du personnage", "Bob"],
    ["Sex", "Sexe", "ABC"],
    ["Home world", "Monde natal", "Asgard"],
    ["Deity", "Divinité", "Ra"],
  ];
  test.each(profileTexts)("has %s updated", async (_, label, value) => {
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Race" }));
    await user.selectOptions(screen.getByRole("combobox", { name: "Race" }), races[0].id);
    await user.click(screen.getByRole("button", { name: "Thème" }));
    await user.selectOptions(screen.getByRole("combobox", { name: "Thème" }), themes[0].id);
    await user.click(screen.getByRole("button", { name: "Classe" }));
    await user.selectOptions(screen.getByRole("combobox", { name: "Classe" }), classes[0].id);
    await user.click(screen.getByRole("button", { name: "Profil" }));
    await user.type(screen.getByRole("textbox", { name: label }), value);
    await user.click(screen.getByRole("button", { name: "Fiche" }));

    const view = screen.getByTestId(label);
    expect(within(view).queryByText(label)).toBeVisible();
    expect(within(view).queryByText("-")).toBeNull();
    expect(within(view).queryByText(value)).not.toBeNull();
  });

  test("has Abilities empty by default", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Fiche" }));

    const view = screen.getByTestId("abilities");
    expect(within(view).queryByText("Pouvoirs")).toBeVisible();
    expect(within(view).queryByText("Androïde.")).toBeNull();
  });

  test.each(races)("has Abilities added by Race selection for '$id'", async (race) => {
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Race" }));
    await user.selectOptions(screen.getByRole("combobox", { name: "Race" }), race.id);
    await user.click(screen.getByRole("button", { name: "Fiche" }));

    const view = screen.getByTestId("abilities");
    expect(within(view).queryByText("Pouvoirs")).toBeVisible();
    for (const ability of race.abilities) {
      expect(within(view).queryByText(ability + ".")).not.toBeNull();
    }
  });

  test("has Abilities added by Race selection with alternate traits", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Race" }));
    await user.selectOptions(screen.getByRole("combobox", { name: "Race" }), races[0].id);
    await user.click(screen.getByRole("switch", { name: "Augmentations facilitées" }));
    await user.click(screen.getByRole("switch", { name: "Intégration à l’infosphère" }));
    await user.click(screen.getByRole("button", { name: "Fiche" }));

    const view = screen.getByTestId("abilities");
    expect(within(view).queryByText("Pouvoirs")).toBeVisible();
    expect(within(view).queryByText("Androïde.")).not.toBeNull();
    expect(within(view).queryByText("Fabriqué.")).not.toBeNull();
    expect(within(view).queryByText("Emotions contrôlées.")).not.toBeNull();
    expect(within(view).queryByText("Intégration à l’infosphère.")).not.toBeNull();
  });

  const themeMatrix = races.map((race) => themes.map((theme) => ({ race, theme }))).flat();
  test.each(themeMatrix)(
    "has Abilities added by Theme selection for '$race.id' and '$theme.id'",
    async ({ race, theme }) => {
      const user = userEvent.setup();
      await user.click(screen.getByRole("button", { name: "Race" }));
      await user.selectOptions(screen.getByRole("combobox", { name: "Race" }), race.id);
      await user.click(screen.getByRole("button", { name: "Thème" }));
      await user.selectOptions(screen.getByRole("combobox", { name: "Thème" }), theme.id);
      await user.click(screen.getByRole("button", { name: "Fiche" }));

      const view = screen.getByTestId("abilities");

      expect(within(view).queryByText("Pouvoirs")).toBeVisible();
      for (const ability of [...race.abilities, ...theme.abilities]) {
        expect(within(view).queryByText(ability + ".")).not.toBeNull();
      }
    }
  );

  const classMatrix = races
    .map((race) => themes.map((theme) => classes.map((klass) => ({ race, theme, klass }))))
    .flat();
  test.each(classMatrix)(
    "has Abilities added by Class selection for '$race.id', '$theme.id' and '$klass.id'",
    async ({ race, theme, klass }) => {
      const user = userEvent.setup();
      await user.click(screen.getByRole("button", { name: "Race" }));
      await user.selectOptions(screen.getByRole("combobox", { name: "Race" }), race.id);
      await user.click(screen.getByRole("button", { name: "Thème" }));
      await user.selectOptions(screen.getByRole("combobox", { name: "Thème" }), theme.id);
      await user.click(screen.getByRole("button", { name: "Classe" }));
      await user.selectOptions(screen.getByRole("combobox", { name: "Classe" }), klass.id);
      await user.click(screen.getByRole("button", { name: "Fiche" }));

      const view = screen.getByTestId("abilities");
      for (const ability of [...race.abilities, ...theme.abilities, ...klass.abilities]) {
        expect(within(view).queryByText(ability + ".")).not.toBeNull();
      }
    }
  );

  test.failing("has Avatar updated", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Race" }));
    await user.selectOptions(screen.getByRole("combobox", { name: "Race" }), races[0].id);
    await user.click(screen.getByRole("button", { name: "Thème" }));
    await user.selectOptions(screen.getByRole("combobox", { name: "Thème" }), themes[0].id);
    await user.click(screen.getByRole("button", { name: "Classe" }));
    await user.selectOptions(screen.getByRole("combobox", { name: "Classe" }), classes[0].id);
    await user.click(screen.getByRole("button", { name: "Profil" }));
    fireEvent.change(screen.getByRole("slider", { name: "Avatar" }), { target: { value: 1 } });
    await user.click(screen.getByRole("button", { name: "Fiche" }));

    const view = screen.getByTestId("Avatar");
    expect(within(view).queryByText("Avatar")).toBeVisible();
    expect(within(view).queryByText("-")).toBeNull();
    expect(within(view).queryByText("Avatar")).not.toBeNull();
  });
});

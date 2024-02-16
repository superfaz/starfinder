import { beforeAll, beforeEach, describe, expect, test } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Page from "../page";

const NO_CLASS = "Pas de classe sélectionnée";

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
  beforeAll(async () => {
    cleanup();
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
    cleanup();
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

  test.each(races)("has Race updated for $id", async (race) => {
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

  test.each(races)("has Abilities added by Race selection for $id", async (race) => {
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
    "has Abilities added by Theme selection for $race.id and $theme.id",
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
    "has Abilities added by Class selection for $race.id, $theme.id and $klass.id",
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

  test("has Avatar updated", async () => {
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

    const view = screen.getByTestId("avatar");
    expect(within(view).queryByText("Avatar")).toBeVisible();
    expect(within(view).queryByRole("img", { name: "avatar" })).not.toBeNull();
  });

  test("has Saving Throws initialized", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Fiche" }));

    const view = screen.getByTestId("savingThrows");
    expect(within(view).queryByText(NO_CLASS)).not.toBeNull();
  });

  test("has Saving Throws updated", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Race" }));
    await user.selectOptions(screen.getByRole("combobox", { name: "Race" }), races[0].id);
    await user.click(screen.getByRole("button", { name: "Thème" }));
    await user.selectOptions(screen.getByRole("combobox", { name: "Thème" }), themes[0].id);
    await user.click(screen.getByRole("button", { name: "Classe" }));
    await user.selectOptions(screen.getByRole("combobox", { name: "Classe" }), classes[0].id);
    await user.click(screen.getByRole("button", { name: "Fiche" }));

    const view = screen.getByTestId("savingThrows");
    expect(within(view).queryByText(NO_CLASS)).toBeNull();
    expect(within(view).queryByTestId("Vigueur")).not.toBeNull();
    expect(within(within(view).getByTestId("Vigueur")).queryByText("+0")).not.toBeNull();
    expect(within(view).queryByTestId("Réflexe")).not.toBeNull();
    expect(within(within(view).getByTestId("Réflexe")).queryByText("+3")).not.toBeNull();
    expect(within(view).queryByTestId("Volonté")).not.toBeNull();
    expect(within(within(view).getByTestId("Volonté")).queryByText("+2")).not.toBeNull();
  });

  test("has Attack Bonuses initialized", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Fiche" }));

    const view = screen.getByTestId("attackBonuses");
    expect(within(view).queryByText(NO_CLASS)).not.toBeNull();
  });

  const attackBonusTable = [
    { klass: "operative", base: "+0", melee: "+0", ranged: "+1", thrown: "+0" },
    { klass: "soldier", base: "+1", melee: "+1", ranged: "+2", thrown: "+1" },
  ];
  test.each(attackBonusTable)("has Attack Bonuses updated for $klass", async (dataset) => {
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Race" }));
    await user.selectOptions(screen.getByRole("combobox", { name: "Race" }), races[0].id);
    await user.click(screen.getByRole("button", { name: "Thème" }));
    await user.selectOptions(screen.getByRole("combobox", { name: "Thème" }), themes[0].id);
    await user.click(screen.getByRole("button", { name: "Classe" }));
    await user.selectOptions(screen.getByRole("combobox", { name: "Classe" }), dataset.klass);
    await user.click(screen.getByRole("button", { name: "Fiche" }));

    const view = screen.getByTestId("attackBonuses");
    expect(within(view).queryByText(NO_CLASS)).toBeNull();
    expect(within(view).queryByTestId("Bonus de base à l'attaque")).not.toBeNull();
    expect(within(within(view).getByTestId("Bonus de base à l'attaque")).queryByText(dataset.base)).not.toBeNull();
    expect(within(view).queryByTestId("Attaque au corps à corps")).not.toBeNull();
    expect(within(within(view).getByTestId("Attaque au corps à corps")).queryByText(dataset.melee)).not.toBeNull();
    expect(within(view).queryByTestId("Attaque à distance")).not.toBeNull();
    expect(within(within(view).getByTestId("Attaque à distance")).queryByText(dataset.ranged)).not.toBeNull();
    expect(within(view).queryByTestId("Attaque de lancer")).not.toBeNull();
    expect(within(within(view).getByTestId("Attaque de lancer")).queryByText(dataset.thrown)).not.toBeNull();
  });

  test("displays weapons proficiencies", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Race" }));
    await user.selectOptions(screen.getByRole("combobox", { name: "Race" }), races[0].id);
    await user.click(screen.getByRole("button", { name: "Thème" }));
    await user.selectOptions(screen.getByRole("combobox", { name: "Thème" }), themes[0].id);
    await user.click(screen.getByRole("button", { name: "Classe" }));
    await user.selectOptions(screen.getByRole("combobox", { name: "Classe" }), classes[0].id);
    await user.click(screen.getByRole("button", { name: "Fiche" }));

    const block = within(screen.getByTestId("weapons"));
    expect(block.queryByText(/Formations: Armes de corps à corps simples.*/i)).not.toBeNull();
  });

  test("displays armors proficiencies", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Race" }));
    await user.selectOptions(screen.getByRole("combobox", { name: "Race" }), races[0].id);
    await user.click(screen.getByRole("button", { name: "Thème" }));
    await user.selectOptions(screen.getByRole("combobox", { name: "Thème" }), themes[0].id);
    await user.click(screen.getByRole("button", { name: "Classe" }));
    await user.selectOptions(screen.getByRole("combobox", { name: "Classe" }), classes[0].id);
    await user.click(screen.getByRole("button", { name: "Fiche" }));

    const block = within(screen.getByTestId("armors"));
    expect(block.queryByText(/Formations: Armures légères.*/i)).not.toBeNull();
  });

  test("displays initiative bonus", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Race" }));
    await user.selectOptions(screen.getByRole("combobox", { name: "Race" }), races[0].id);
    await user.click(screen.getByRole("button", { name: "Thème" }));
    await user.selectOptions(screen.getByRole("combobox", { name: "Thème" }), themes[0].id);
    await user.click(screen.getByRole("button", { name: "Classe" }));
    await user.selectOptions(screen.getByRole("combobox", { name: "Classe" }), classes[0].id);
    await user.click(screen.getByRole("button", { name: "Fiche" }));

    const block = within(screen.getByTestId("initiative"));
    expect(block.queryByText("+2")).not.toBeNull();
  });

  test("displays stamina/health/resolve points", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Race" }));
    await user.selectOptions(screen.getByRole("combobox", { name: "Race" }), races[0].id);
    await user.click(screen.getByRole("button", { name: "Thème" }));
    await user.selectOptions(screen.getByRole("combobox", { name: "Thème" }), themes[0].id);
    await user.click(screen.getByRole("button", { name: "Classe" }));
    await user.selectOptions(screen.getByRole("combobox", { name: "Classe" }), classes[0].id);
    await user.click(screen.getByRole("button", { name: "Fiche" }));

    const block = within(screen.getByTestId("keypoints"));
    expect(block.queryByTestId(/points d'endurance/i)).not.toBeNull();
    expect(within(block.getByTestId(/points d'endurance/i)).queryByText(6)).not.toBeNull();
    expect(block.queryByTestId(/points de vie/i)).not.toBeNull();
    expect(within(block.getByTestId(/points de vie/i)).queryByText(10)).not.toBeNull();
    expect(block.queryByTestId(/points de persévérance/i)).not.toBeNull();
    expect(within(block.getByTestId(/points de persévérance/i)).queryByText(2)).not.toBeNull();
  });

  test("displays armor classes", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Race" }));
    await user.selectOptions(screen.getByRole("combobox", { name: "Race" }), races[0].id);
    await user.click(screen.getByRole("button", { name: "Thème" }));
    await user.selectOptions(screen.getByRole("combobox", { name: "Thème" }), themes[0].id);
    await user.click(screen.getByRole("button", { name: "Classe" }));
    await user.selectOptions(screen.getByRole("combobox", { name: "Classe" }), classes[0].id);
    await user.click(screen.getByRole("button", { name: "Fiche" }));

    const block = within(screen.getByTestId("armors"));
    expect(block.queryByTestId(/énergétique/i)).not.toBeNull();
    expect(within(block.getByTestId(/énergétique/i)).queryByText(11)).not.toBeNull();
    expect(block.queryByTestId(/cinétique/i)).not.toBeNull();
    expect(within(block.getByTestId(/cinétique/i)).queryByText(11)).not.toBeNull();
    expect(block.queryByTestId(/manoeuvres/i)).not.toBeNull();
    expect(within(block.getByTestId(/manoeuvres/i)).queryByText(19)).not.toBeNull();
  });
});

import { beforeEach, describe, expect, test } from "@jest/globals";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Page from "../page";

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

    expect(content.getByTestId("Nom du personnage")).toBeVisible();
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

  test("has Race updated", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Race" }));
    await user.selectOptions(screen.getByRole("combobox", { name: "Race" }), "androids");
    await user.click(screen.getByRole("button", { name: "Fiche" }));

    const view = screen.getByTestId("Race");
    expect(within(view).queryByText("Race")).toBeVisible();
    expect(within(view).queryByText("-")).toBeNull();
    expect(within(view).queryByText("Androïdes")).not.toBeNull();
  });

  test("has Theme updated", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Race" }));
    await user.selectOptions(screen.getByRole("combobox", { name: "Race" }), "androids");
    await user.click(screen.getByRole("button", { name: "Thème" }));
    await user.selectOptions(screen.getByRole("combobox", { name: "Thème" }), "bounty-hunter");
    await user.click(screen.getByRole("button", { name: "Fiche" }));

    const view = screen.getByTestId("Thème");
    expect(within(view).queryByText("Thème")).toBeVisible();
    expect(within(view).queryByText("-")).toBeNull();
    expect(within(view).queryByText("Chasseur de primes")).not.toBeNull();
  });

  test("has Class updated", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Race" }));
    await user.selectOptions(screen.getByRole("combobox", { name: "Race" }), "androids");
    await user.click(screen.getByRole("button", { name: "Thème" }));
    await user.selectOptions(screen.getByRole("combobox", { name: "Thème" }), "bounty-hunter");
    await user.click(screen.getByRole("button", { name: "Classe" }));
    await user.selectOptions(screen.getByRole("combobox", { name: "Classe" }), "operative");
    await user.click(screen.getByRole("button", { name: "Fiche" }));

    const view = screen.getByTestId("Classe");
    expect(within(view).queryByText("Classe")).toBeVisible();
    expect(within(view).queryByText("-")).toBeNull();
    expect(within(view).queryByText("Agent")).not.toBeNull();
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
    await user.selectOptions(screen.getByRole("combobox", { name: "Race" }), "androids");
    await user.click(screen.getByRole("button", { name: "Thème" }));
    await user.selectOptions(screen.getByRole("combobox", { name: "Thème" }), "bounty-hunter");
    await user.click(screen.getByRole("button", { name: "Classe" }));
    await user.selectOptions(screen.getByRole("combobox", { name: "Classe" }), "operative");
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

  test("has Abilities added by Race selection", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Race" }));
    await user.selectOptions(screen.getByRole("combobox", { name: "Race" }), "androids");
    await user.click(screen.getByRole("button", { name: "Fiche" }));

    const view = screen.getByTestId("abilities");
    expect(within(view).queryByText("Pouvoirs")).toBeVisible();
    expect(within(view).queryByText("Androïde.")).not.toBeNull();
    expect(within(view).queryByText("Fabriqué.")).not.toBeNull();
    expect(within(view).queryByText("Vision nocturne.")).not.toBeNull();
    expect(within(view).queryByText("Vision dans le noir.")).not.toBeNull();
    expect(within(view).queryByText("Emotions contrôlées.")).not.toBeNull();
    expect(within(view).queryByText("Emplacement d'amélioration.")).not.toBeNull();
  });

  test("has Abilities added by Race selection with alternate traits", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Race" }));
    await user.selectOptions(screen.getByRole("combobox", { name: "Race" }), "androids");
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

  test("has Abilities added by Theme selection", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Race" }));
    await user.selectOptions(screen.getByRole("combobox", { name: "Race" }), "androids");
    await user.click(screen.getByRole("button", { name: "Thème" }));
    await user.selectOptions(screen.getByRole("combobox", { name: "Thème" }), "bounty-hunter");
    await user.click(screen.getByRole("button", { name: "Fiche" }));

    const view = screen.getByTestId("abilities");
    expect(within(view).queryByText("Pouvoirs")).toBeVisible();
    expect(within(view).queryByText("Androïde.")).not.toBeNull();
    expect(within(view).queryByText("Fabriqué.")).not.toBeNull();
    expect(within(view).queryByText("Vision nocturne.")).not.toBeNull();
    expect(within(view).queryByText("Vision dans le noir.")).not.toBeNull();
    expect(within(view).queryByText("Emotions contrôlées.")).not.toBeNull();
    expect(within(view).queryByText("Emplacement d'amélioration.")).not.toBeNull();
    expect(within(view).queryByText("Chasseur de primes.")).not.toBeNull();
  });
});

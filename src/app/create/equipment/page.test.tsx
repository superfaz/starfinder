import { cleanup, screen, within } from "@testing-library/react";
import { beforeAll, describe, expect, test } from "vitest";
import { createCharacter, renderWithData } from "../helpers-test";
import Page from "./page";
import userEvent from "@testing-library/user-event";

describe("/create/equipment", () => {
  beforeAll(async () => {
    cleanup();
    await renderWithData(<Page />);
  });

  test("is not displayed", async () => {
    const content = within(document.querySelector("#content") as HTMLElement);
    expect(content.queryByRole("heading", { level: 2, name: "Équipement disponible" })).toBeNull();
  });
});

describe("/create/equipment", () => {
  beforeAll(async () => {
    cleanup();
    const character = createCharacter()
      .updateRace("androids")
      .updateTheme("bounty-hunter")
      .updateClass("operative").character;
    await renderWithData(<Page />, character);
  });

  test("is displayed", async () => {
    const content = within(document.querySelector("#content") as HTMLElement);
    expect(content.queryByRole("heading", { level: 2, name: "Équipement disponible" })).not.toBeNull();
    expect(content.queryByRole("heading", { level: 2, name: "Crédits" })).not.toBeNull();
    expect(content.queryByRole("heading", { level: 2, name: "Armes" })).not.toBeNull();
    expect(content.queryByRole("heading", { level: 2, name: "Armures" })).not.toBeNull();
    expect(content.queryByRole("heading", { level: 2, name: "Autres" })).not.toBeNull();
  });

  test("has 1000 credits", async () => {
    const content = within(document.querySelector("#content") as HTMLElement);
    expect(content.getByLabelText("Capital initial")).toHaveValue(1000);
    expect(content.getByLabelText("Restant")).toHaveValue(1000);
  });

  const weapons = [
    { category: "advanced", expected: "Gantelet pulseur, tonnerre" },
    { category: "ammunition", expected: "Balles, arme légère" },
    { category: "basic", expected: "Gourdin" },
    { category: "grenade", expected: "Grenade fumigène" },
    { category: "heavy", expected: "Lance-flammes, ifrit" },
    { category: "long", expected: "Fusil pulseur" },
    { category: "small", expected: "Pistolet pulseur" },
    { category: "sniper", expected: "Fusil oeil de shirren, tactique" },
    { category: "solarian", expected: "Faux cristal" },
  ];
  test.each(weapons)("proposes weapons and ammunitions ($category)", async ({ category, expected }) => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByRole("combobox", { name: "Catégorie" }), "weapon");
    if (category !== "basic") {
      await user.selectOptions(screen.getByRole("combobox", { name: "Sous-catégorie" }), category);
    }

    const equipmentTable = within(screen.getByRole("table"));
    expect(equipmentTable.getByText(expected)).toBeInTheDocument();
    expect(equipmentTable.getByText(expected)).toBeVisible();
  });
});

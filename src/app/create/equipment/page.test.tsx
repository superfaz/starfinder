import { cleanup, within } from "@testing-library/react";
import { beforeAll, describe, expect, test } from "vitest";
import { createCharacter, renderWithData } from "../helpers-test";
import Page from "./page";

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
});

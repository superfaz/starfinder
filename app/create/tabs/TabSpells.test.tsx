import { beforeAll, beforeEach, describe, expect, test } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Page from "../page";

describe("TabSpells", () => {
  beforeAll(async () => {
    cleanup();
    render(await Page());
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Sorts" }));
  });

  test("is not displayed", async () => {
    expect(screen.queryByRole("heading", { level: 2, name: /Sorts de niveau 0/ })).toBeNull();
  });

  test("is not displayed for soldier", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Race" }));
    await user.selectOptions(screen.getByRole("combobox", { name: "Race" }), "androids");
    await user.click(screen.getByRole("button", { name: "Thème" }));
    await user.selectOptions(screen.getByRole("combobox", { name: "Thème" }), "bounty-hunter");
    await user.click(screen.getByRole("button", { name: "Classe" }));
    await user.selectOptions(screen.getByRole("combobox", { name: "Classe" }), "soldier");
    await user.click(screen.getByRole("button", { name: "Sorts" }));

    expect(screen.queryByRole("heading", { level: 2, name: /Sorts de niveau 0/ })).toBeNull();
  });
});

describe("TabSpells", () => {
  beforeEach(async () => {
    cleanup();
    render(await Page());

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Race" }));
    await user.selectOptions(screen.getByRole("combobox", { name: "Race" }), "androids");
    await user.click(screen.getByRole("button", { name: "Thème" }));
    await user.selectOptions(screen.getByRole("combobox", { name: "Thème" }), "bounty-hunter");
    await user.click(screen.getByRole("button", { name: "Classe" }));
    await user.selectOptions(screen.getByRole("combobox", { name: "Classe" }), "mystic");
    await user.click(screen.getByRole("button", { name: "Sorts" }));
  });

  test("is displayed", async () => {
    expect(screen.queryByRole("heading", { level: 2, name: /Sorts de niveau 0/ })).not.toBeNull();
  });

  test.each([0, 1])("displays filtered spells '%s'", async (level) => {
    const content = within(screen.getByTestId("spells-" + level));
    expect(content.queryByText("Shared level " + level), "shared spell not displayed").not.toBeNull();
    expect(content.queryByText("Mystic level " + level), "mystic spell not displayed").not.toBeNull();
    expect(content.queryByText("Technomancer level " + level), "technomancer spell displayed").toBeNull();
  });

  test.each([2, 3, 4, 5, 6])("displays filtered ranged spells '%s'", async (level) => {
    const content = within(screen.getByTestId("spells-" + level));
    expect(content.queryByText("Shared ranged " + level), "shared ranged not displayed").not.toBeNull();
    expect(content.queryByText("Mystic ranged " + level), "mystic ranged not displayed").not.toBeNull();
    expect(content.queryByText("Technomancer ranged " + level), "technomancer ranged displayed").toBeNull();
  });

  test.each([2, 3, 4, 5, 6])("displays evolutive spells", async (level) => {
    const content = within(screen.getByTestId("spells-" + level));
    expect(content.getByText(`Spell level 2 to 6 with ${level * 2}d6.`), "template not applied").toBeDefined();
  });
});

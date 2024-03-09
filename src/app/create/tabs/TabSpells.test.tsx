import { beforeAll, beforeEach, describe, expect, test } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Page from "../page";
import Layout from "../layout";
import { navigateToTab } from "./test-helpers";

describe("TabSpells", () => {
  beforeAll(async () => {
    cleanup();
    render(await Layout({ children: <Page /> }));
    const user = userEvent.setup();
    await navigateToTab(user, "Sorts");
  });

  test("is not displayed", async () => {
    expect(screen.queryByRole("heading", { level: 2, name: /Sorts de niveau 0/ })).toBeNull();
  });

  test("is not displayed for soldier", async () => {
    const user = userEvent.setup();
    await navigateToTab(user, "Race");
    await user.selectOptions(screen.getByRole("combobox", { name: "Race" }), "androids");
    await navigateToTab(user, "Thème");
    await user.selectOptions(screen.getByRole("combobox", { name: "Thème" }), "bounty-hunter");
    await navigateToTab(user, "Classe");
    await user.selectOptions(screen.getByRole("combobox", { name: "Classe" }), "soldier");
    await navigateToTab(user, "Sorts");

    expect(screen.queryByRole("heading", { level: 2, name: /Sorts de niveau 0/ })).toBeNull();
  });
});

describe("TabSpells", () => {
  beforeEach(async () => {
    cleanup();
    render(await Layout({ children: <Page /> }));

    const user = userEvent.setup();
    await navigateToTab(user, "Race");
    await user.selectOptions(screen.getByRole("combobox", { name: "Race" }), "androids");
    await navigateToTab(user, "Thème");
    await user.selectOptions(screen.getByRole("combobox", { name: "Thème" }), "bounty-hunter");
    await navigateToTab(user, "Classe");
    await user.selectOptions(screen.getByRole("combobox", { name: "Classe" }), "mystic");
    await navigateToTab(user, "Sorts");
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
    expect(content.queryByText("Shared ranged - niveau " + level), "shared ranged not displayed").not.toBeNull();
    expect(content.queryByText("Mystic ranged - niveau " + level), "mystic ranged not displayed").not.toBeNull();
    expect(content.queryByText("Technomancer ranged - niveau " + level), "technomancer ranged displayed").toBeNull();
  });

  test.each([2, 3, 4, 5, 6])("displays evolutive spells '%s'", async (level) => {
    const content = within(screen.getByTestId("spells-" + level));
    expect(content.getByText(`Spell level 2 to 6 with ${level * 2}d6.`), "template not applied").toBeDefined();
  });
});

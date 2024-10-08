import { beforeAll, describe, expect, test, vi } from "vitest";
import { cleanup, screen, within } from "@testing-library/react";
import { createCharacter, renderWithData } from "../helpers-test";
import { SpellsSelection } from "./SpellsSelection";

vi.mock("next/navigation", () => ({
  useParams: () => ({ character: 1 }),
  usePathname: () => "",
}));

describe("/edit/spells", () => {
  test("is not available per default", async () => {
    cleanup();
    await renderWithData(<SpellsSelection />);
    expect(screen.queryByRole("heading", { level: 2, name: /Sorts de niveau 0/ })).toBeNull();
  });

  test("is not displayed for soldier", async () => {
    cleanup();
    const character = createCharacter()
      .updateRace("androids")
      .updateTheme("bounty-hunter")
      .updateClass("soldier").character;
    await renderWithData(<SpellsSelection />, character);
    expect(screen.queryByRole("heading", { level: 2, name: /Sorts de niveau 0/ })).toBeNull();
  });
});

describe("/edit/spells", () => {
  beforeAll(async () => {
    cleanup();
    const character = createCharacter()
      .updateRace("androids")
      .updateTheme("bounty-hunter")
      .updateClass("mystic").character;

    await renderWithData(<SpellsSelection />, character);
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

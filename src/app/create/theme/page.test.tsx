import { beforeAll, describe, expect, test } from "vitest";
import { cleanup, screen, waitFor, within } from "@testing-library/react";
import { createCharacter, renderWithData } from "../helpers-test";
import { PageContent } from "./PageContent";
import userEvent from "@testing-library/user-event";

describe("/create/theme", () => {
  beforeAll(async () => {
    cleanup();
    await renderWithData(<PageContent />);
  });

  test("is not displayed by default", async () => {
    const content = within(document.querySelector("#content") as HTMLElement);
    expect(content.queryByRole("heading", { level: 2, name: "Thème" })).toBeNull();
  });
});

describe("/create/theme", () => {
  beforeAll(async () => {
    cleanup();
    const character = createCharacter().updateRace("androids").character;
    await renderWithData(<PageContent />, character);
  });

  test("displays ThemeSelection", async () => {
    const content = within(document.querySelector("#content") as HTMLElement);
    expect(content.queryByRole("heading", { level: 2, name: "Thème" })).not.toBeNull();
  });

  const themes = [
    { id: "bounty-hunter", expected: "Chasseur réactif" },
    { id: "scholar", expected: "Sur le bout de la langue" },
    { id: "themeless", expected: "Certitude" },
  ];
  test.each(themes)("displays details for theme '$id'", async (theme) => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByRole("combobox", { name: "Thème" }), theme.id);

    await waitFor(() => screen.getByRole("heading", { name: theme.expected }), { timeout: 1000 });
    expect(screen.getByRole("heading", { name: theme.expected })).not.toBeNull();
  });

  test("displays scholar specific components", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByRole("combobox", { name: "Thème" }), "scholar");

    await waitFor(() => screen.getByRole("combobox", { name: "Compétence de classe" }), { timeout: 1000 });
    expect(screen.getByRole("combobox", { name: "Spécialité" })).toBeVisible();
  });

  test("displays themeless specific components", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByRole("combobox", { name: "Thème" }), "themeless");

    await waitFor(() => screen.getByRole("combobox", { name: "Caractérisque du thème" }), { timeout: 1000 });
    expect(screen.getByRole("combobox", { name: "Caractérisque du thème" })).toBeVisible();
  });
});

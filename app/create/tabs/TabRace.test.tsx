import { beforeEach, describe, expect, test } from "@jest/globals";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Page from "../page";

describe("TabRace", () => {
  beforeEach(async () => {
    render(await Page());
  });

  test("is not displayed by default", async () => {
    const content = within(document.querySelector("#content") as HTMLElement);
    expect(content.queryByRole("heading", { level: 2, name: "Race" })).toBeNull();
  });
});

describe("TabRace", () => {
  beforeEach(async () => {
    render(await Page());
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Race" }));
  });

  test("displays RaceSelection", async () => {
    const content = within(document.querySelector("#content") as HTMLElement);
    expect(content.getByRole("heading", { level: 2, name: "Race" })).toBeDefined();
  });

  test("displays RaceTraits", async () => {
    const content = within(document.querySelector("#content") as HTMLElement);
    expect(content.getByRole("heading", { level: 2, name: "Traits raciaux" })).toBeDefined();
  });

  test("displays RaceAlternateTraits", async () => {
    const content = within(document.querySelector("#content") as HTMLElement);
    expect(content.getByRole("heading", { level: 2, name: "Traits alternatifs" })).toBeDefined();
  });

  test("displays the variants after race selection", async () => {
    const user = userEvent.setup();
    const content = within(document.querySelector("#content") as HTMLElement);
    expect(content.queryAllByRole("combobox", { name: "Variante" }).length).toBe(0);

    await user.selectOptions(content.getByRole("combobox", { name: "Race" }), "androids");

    expect(content.getByRole<HTMLInputElement>("combobox", { name: "Race" }).value).toBe("androids");
    expect(content.getByRole("combobox", { name: "Variante" })).toBeDefined();
  });
});

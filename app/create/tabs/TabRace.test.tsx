import { beforeEach, describe, expect, test } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import Page from "../page";

describe("TabRace", () => {
  beforeEach(() => {
    render(<Page />);
    fireEvent.click(screen.getByRole("button", { name: "Race" }), { bubbles: true });
  });

  test("RaceSelection is displayed", async () => {
    const content = within(document.querySelector("#content") as HTMLElement);
    expect(content.getByRole("heading", { level: 2, name: "Race" })).toBeDefined();
  });

  test("RaceTraits is displayed", async () => {
    const content = within(document.querySelector("#content") as HTMLElement);
    expect(content.getByRole("heading", { level: 2, name: "Traits raciaux" })).toBeDefined();
  });

  test("RaceAlternateTraits is displayed", async () => {
    const content = within(document.querySelector("#content") as HTMLElement);
    expect(content.getByRole("heading", { level: 2, name: "Traits alternatifs" })).toBeDefined();
  });

  test("Selecting a race displays the variants", async () => {
    const content = within(document.querySelector("#content") as HTMLElement);
    expect(content.queryAllByRole("combobox", { name: "Variante" }).length).toBe(0);
    fireEvent.change(content.getByRole("combobox", { name: "Race" }), { target: { value: "androids" } });
    expect(content.getByRole<HTMLInputElement>("combobox", { name: "Race" }).value).toBe("androids");
    expect(content.getByRole("combobox", { name: "Variante" })).toBeDefined();
  });
});

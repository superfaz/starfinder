import { beforeEach, describe, expect, test } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import Page from "../page";

describe("RaceSelection", () => {
  beforeEach(() => {
    render(<Page />);
    fireEvent.click(screen.getByRole("button", { name: "Race" }), { bubbles: true });
  });

  test("RaceSelection is displayed", async () => {
    expect(screen.getByRole("heading", { level: 2, name: "Race" })).toBeDefined();
  });

  test("Selecting a race displays the variants", async () => {
    expect(screen.queryAllByRole("combobox", { name: "Variante" }).length).toBe(0);
    fireEvent.change(screen.getByRole("combobox", { name: "Race" }), { target: { value: "androids" } });
    expect(screen.getByRole<HTMLInputElement>("combobox", { name: "Race" }).value).toBe("androids");
    expect(screen.getByRole("combobox", { name: "Variante" })).toBeDefined();
  });
});

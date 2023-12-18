import { beforeEach, describe, expect, test } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import Page from "../page";

describe("TabTheme", () => {
  beforeEach(() => {
    render(<Page />);
    fireEvent.click(screen.getByRole("button", { name: "Thème" }), { bubbles: true });
  });

  test("ThemeSelection is not displayed", async () => {
    const content = within(document.querySelector("#content") as HTMLElement);
    expect(content.queryByRole("heading", { level: 2, name: "Thème" })).toBeNull();
  });
});

describe("TabTheme", () => {
  beforeEach(() => {
    render(<Page />);
    fireEvent.click(screen.getByRole("button", { name: "Race" }), { bubbles: true });
    fireEvent.change(screen.getByRole("combobox", { name: "Race" }), { target: { value: "androids" } });
    fireEvent.click(screen.getByRole("button", { name: "Thème" }), { bubbles: true });
  });

  test("ThemeSelection is displayed", async () => {
    const content = within(document.querySelector("#content") as HTMLElement);
    expect(content.queryByRole("heading", { level: 2, name: "Thème" })).not.toBeNull();
  });
});

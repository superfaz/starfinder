import { beforeEach, describe, expect, test } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import Page from "../page";

describe("TabClass", () => {
  beforeEach(() => {
    render(<Page />);
    fireEvent.click(screen.getByRole("button", { name: "Classe" }), { bubbles: true });
  });

  test("ClassSelection is not displayed", async () => {
    const content = within(document.querySelector("#content") as HTMLElement);
    expect(content.queryByRole("heading", { level: 2, name: "Classe" })).toBeNull();
  });
});

describe("TabClass", () => {
  beforeEach(() => {
    render(<Page />);
    fireEvent.click(screen.getByRole("button", { name: "Race" }), { bubbles: true });
    fireEvent.change(screen.getByRole("combobox", { name: "Race" }), { target: { value: "androids" } });
    fireEvent.click(screen.getByRole("button", { name: "Thème" }), { bubbles: true });
    fireEvent.change(screen.getByRole("combobox", { name: "Thème" }), {
      target: { value: "aa401a3f-5c53-40d5-8157-9276b130735d" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Classe" }), { bubbles: true });
  });

  test("ClassSelection is displayed", async () => {
    const content = within(document.querySelector("#content") as HTMLElement);
    expect(content.queryByRole("heading", { level: 2, name: "Classe" })).not.toBeNull();
  });
});

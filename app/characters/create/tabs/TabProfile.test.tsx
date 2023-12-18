import { beforeEach, describe, expect, test } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import Page from "../page";

describe("TabProfile", () => {
  beforeEach(() => {
    render(<Page />);
    fireEvent.click(screen.getByRole("button", { name: "Profil" }), { bubbles: true });
  });

  test("Profile is not displayed", async () => {
    const content = within(document.querySelector("#content") as HTMLElement);
    expect(content.queryByRole("heading", { level: 2, name: "Profil" })).toBeNull();
  });
});

describe("TabProfile", () => {
  beforeEach(() => {
    render(<Page />);
    fireEvent.click(screen.getByRole("button", { name: "Race" }), { bubbles: true });
    fireEvent.change(screen.getByRole("combobox", { name: "Race" }), { target: { value: "androids" } });
    fireEvent.click(screen.getByRole("button", { name: "Thème" }), { bubbles: true });
    fireEvent.change(screen.getByRole("combobox", { name: "Thème" }), {
      target: { value: "aa401a3f-5c53-40d5-8157-9276b130735d" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Classe" }), { bubbles: true });
    fireEvent.change(screen.getByRole("combobox", { name: "Classe" }), { target: { value: "class-operative" } });
    fireEvent.click(screen.getByRole("button", { name: "Profil" }), { bubbles: true });
  });

  test("Profile is displayed", async () => {
    const content = within(document.querySelector("#content") as HTMLElement);
    expect(content.queryByRole("heading", { level: 2, name: "Profil" })).not.toBeNull();
  });

  test("Character name modified", async () => {
    const content = within(document.querySelector("#content") as HTMLElement);

    fireEvent.change(content.getByRole("textbox", { name: "Nom du personnage" }), { target: { value: "Bob" } });
    expect(content.getByRole<HTMLInputElement>("textbox", { name: "Nom du personnage" }).value).toBe("Bob");

    fireEvent.click(screen.getByRole("button", { name: "Fiche" }), { bubbles: true });
    expect(content.queryByText("Bob")).not.toBeNull();
  });

  test("Alignment modified", async () => {
    const content = within(document.querySelector("#content") as HTMLElement);

    fireEvent.change(content.getByRole("combobox", { name: "Alignement" }), { target: { value: "cn" } });
    expect(content.getByRole<HTMLInputElement>("combobox", { name: "Alignement" }).value).toBe("cn");

    fireEvent.click(screen.getByRole("button", { name: "Fiche" }), { bubbles: true });
    expect(content.queryByText("CN")).not.toBeNull();
  });

  test("Sex modified", async () => {
    const content = within(document.querySelector("#content") as HTMLElement);

    fireEvent.change(content.getByRole("textbox", { name: "Sexe" }), { target: { value: "F" } });
    expect(content.getByRole<HTMLInputElement>("textbox", { name: "Sexe" }).value).toBe("F");

    fireEvent.click(screen.getByRole("button", { name: "Fiche" }), { bubbles: true });
    expect(content.queryByText("F")).not.toBeNull();
  });

  test("Home world modified", async () => {
    const content = within(document.querySelector("#content") as HTMLElement);

    fireEvent.change(content.getByRole("textbox", { name: "Monde natal" }), { target: { value: "Abraxar" } });
    expect(content.getByRole<HTMLInputElement>("textbox", { name: "Monde natal" }).value).toBe("Abraxar");

    fireEvent.click(screen.getByRole("button", { name: "Fiche" }), { bubbles: true });
    expect(content.queryByText("Abraxar")).not.toBeNull();
  });

  test("Deity modified", async () => {
    const content = within(document.querySelector("#content") as HTMLElement);

    fireEvent.change(content.getByRole("textbox", { name: "Divinité" }), { target: { value: "Desna" } });
    expect(content.getByRole<HTMLInputElement>("textbox", { name: "Divinité" }).value).toBe("Desna");

    fireEvent.click(screen.getByRole("button", { name: "Fiche" }), { bubbles: true });
    expect(content.queryByText("Desna")).not.toBeNull();
  });
});

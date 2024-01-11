import { beforeEach, describe, expect, test } from "@jest/globals";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Page from "../page";

describe("TabProfile", () => {
  beforeEach(async () => {
    render(await Page());
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Profil" }));
  });

  test("is not displayed", async () => {
    const content = within(document.querySelector("#content") as HTMLElement);
    expect(content.queryByRole("heading", { level: 2, name: "Profil" })).toBeNull();
  });
});

describe("TabProfile", () => {
  beforeEach(async () => {
    render(await Page());
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Race" }));
    await user.selectOptions(screen.getByRole("combobox", { name: "Race" }), "androids");
    await user.click(screen.getByRole("button", { name: "Thème" }));
    await user.selectOptions(screen.getByRole("combobox", { name: "Thème" }), "caa91400-c6ef-4c16-bb00-3b09792dda92");
    await user.click(screen.getByRole("button", { name: "Classe" }));
    await user.selectOptions(screen.getByRole("combobox", { name: "Classe" }), "operative");
    await user.click(screen.getByRole("button", { name: "Profil" }));
  });

  test("is displayed", async () => {
    const content = within(document.querySelector("#content") as HTMLElement);
    expect(content.queryByRole("heading", { level: 2, name: "Profil" })).not.toBeNull();
  });

  test("can be used to modify the character name", async () => {
    const user = userEvent.setup();
    const content = within(document.querySelector("#content") as HTMLElement);

    await user.type(content.getByRole("textbox", { name: "Nom du personnage" }), "Bob");
    expect(content.getByRole<HTMLInputElement>("textbox", { name: "Nom du personnage" }).value).toBe("Bob");

    await user.click(screen.getByRole("button", { name: "Fiche" }));
    expect(content.queryByText("Bob")).not.toBeNull();
  });

  test("can be used to modify the alignment", async () => {
    const user = userEvent.setup();
    const content = within(document.querySelector("#content") as HTMLElement);

    await user.selectOptions(content.getByRole("combobox", { name: "Alignement" }), "cn");
    expect(content.getByRole<HTMLInputElement>("combobox", { name: "Alignement" }).value).toBe("cn");

    await user.click(screen.getByRole("button", { name: "Fiche" }));
    expect(content.queryByText("CN")).not.toBeNull();
  });

  test("can be used to modify the character sex", async () => {
    const user = userEvent.setup();
    const content = within(document.querySelector("#content") as HTMLElement);

    await user.type(content.getByRole("textbox", { name: "Sexe" }), "F");
    expect(content.getByRole<HTMLInputElement>("textbox", { name: "Sexe" }).value).toBe("F");

    await user.click(screen.getByRole("button", { name: "Fiche" }));
    expect(content.queryByText("F")).not.toBeNull();
  });

  test("can be used to modify the home world", async () => {
    const user = userEvent.setup();
    const content = within(document.querySelector("#content") as HTMLElement);

    await user.type(content.getByRole("textbox", { name: "Monde natal" }), "Abraxar");
    expect(content.getByRole<HTMLInputElement>("textbox", { name: "Monde natal" }).value).toBe("Abraxar");

    await user.click(screen.getByRole("button", { name: "Fiche" }));
    expect(content.queryByText("Abraxar")).not.toBeNull();
  });

  test("can be used to modify the deity", async () => {
    const user = userEvent.setup();
    const content = within(document.querySelector("#content") as HTMLElement);

    await user.type(content.getByRole("textbox", { name: "Divinité" }), "Desna");
    expect(content.getByRole<HTMLInputElement>("textbox", { name: "Divinité" }).value).toBe("Desna");

    await user.click(screen.getByRole("button", { name: "Fiche" }));
    expect(content.queryByText("Desna")).not.toBeNull();
  });
});

import { beforeAll, beforeEach, describe, expect, test } from "@jest/globals";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { addFetchMock } from "mocks/fetch";
import operativeDetails from "data/class-operative.json";
import Page from "../page";

describe("TabProfile", () => {
  beforeEach(async () => {
    render(await Page());
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Profil" }));
  });

  test("Profile is not displayed", async () => {
    const content = within(document.querySelector("#content") as HTMLElement);
    expect(content.queryByRole("heading", { level: 2, name: "Profil" })).toBeNull();
  });
});

describe("TabProfile", () => {
  beforeAll(() => {
    addFetchMock("/api/classes/operative/details", operativeDetails);
  });

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

  test("Profile is displayed", async () => {
    const content = within(document.querySelector("#content") as HTMLElement);
    expect(content.queryByRole("heading", { level: 2, name: "Profil" })).not.toBeNull();
  });

  test("Character name modified", async () => {
    const user = userEvent.setup();
    const content = within(document.querySelector("#content") as HTMLElement);

    await user.type(content.getByRole("textbox", { name: "Nom du personnage" }), "Bob");
    expect(content.getByRole<HTMLInputElement>("textbox", { name: "Nom du personnage" }).value).toBe("Bob");

    await user.click(screen.getByRole("button", { name: "Fiche" }));
    expect(content.queryByText("Bob")).not.toBeNull();
  });

  test("Alignment modified", async () => {
    const user = userEvent.setup();
    const content = within(document.querySelector("#content") as HTMLElement);

    await user.selectOptions(content.getByRole("combobox", { name: "Alignement" }), "cn");
    expect(content.getByRole<HTMLInputElement>("combobox", { name: "Alignement" }).value).toBe("cn");

    await user.click(screen.getByRole("button", { name: "Fiche" }));
    expect(content.queryByText("CN")).not.toBeNull();
  });

  test("Sex modified", async () => {
    const user = userEvent.setup();
    const content = within(document.querySelector("#content") as HTMLElement);

    await user.type(content.getByRole("textbox", { name: "Sexe" }), "F");
    expect(content.getByRole<HTMLInputElement>("textbox", { name: "Sexe" }).value).toBe("F");

    await user.click(screen.getByRole("button", { name: "Fiche" }));
    expect(content.queryByText("F")).not.toBeNull();
  });

  test("Home world modified", async () => {
    const user = userEvent.setup();
    const content = within(document.querySelector("#content") as HTMLElement);

    await user.type(content.getByRole("textbox", { name: "Monde natal" }), "Abraxar");
    expect(content.getByRole<HTMLInputElement>("textbox", { name: "Monde natal" }).value).toBe("Abraxar");

    await user.click(screen.getByRole("button", { name: "Fiche" }));
    expect(content.queryByText("Abraxar")).not.toBeNull();
  });

  test("Deity modified", async () => {
    const user = userEvent.setup();
    const content = within(document.querySelector("#content") as HTMLElement);

    await user.type(content.getByRole("textbox", { name: "Divinité" }), "Desna");
    expect(content.getByRole<HTMLInputElement>("textbox", { name: "Divinité" }).value).toBe("Desna");

    await user.click(screen.getByRole("button", { name: "Fiche" }));
    expect(content.queryByText("Desna")).not.toBeNull();
  });
});

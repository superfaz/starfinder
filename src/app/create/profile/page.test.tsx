import { cleanup, render, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, describe, expect, test } from "vitest";
import Page from "./page";
import Layout, { LayoutServer } from "../layout";
import { createCharacter } from "../helpers-test";

describe("/create/profile", () => {
  beforeAll(async () => {
    cleanup();
    render(await Layout({ children: <Page /> }));
  });

  test("is not displayed", async () => {
    const content = within(document.querySelector("#content") as HTMLElement);
    expect(content.queryByRole("heading", { level: 2, name: "Profil" })).toBeNull();
  });
});

describe("/create/profile", () => {
  beforeAll(async () => {
    cleanup();
    const character = createCharacter()
      .updateRace("androids")
      .updateTheme("bounty-hunter")
      .updateClass("operative").character;
    render(await LayoutServer({ children: <Page />, character }));
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
  });

  test("can be used to modify the alignment", async () => {
    const user = userEvent.setup();
    const content = within(document.querySelector("#content") as HTMLElement);

    await user.selectOptions(content.getByRole("combobox", { name: "Alignement" }), "cn");
    expect(content.getByRole<HTMLInputElement>("combobox", { name: "Alignement" }).value).toBe("cn");
  });

  test("can be used to modify the character sex", async () => {
    const user = userEvent.setup();
    const content = within(document.querySelector("#content") as HTMLElement);

    await user.type(content.getByRole("textbox", { name: "Sexe" }), "F");
    expect(content.getByRole<HTMLInputElement>("textbox", { name: "Sexe" }).value).toBe("F");
  });

  test("can be used to modify the home world", async () => {
    const user = userEvent.setup();
    const content = within(document.querySelector("#content") as HTMLElement);

    await user.type(content.getByRole("textbox", { name: "Monde natal" }), "Abraxar");
    expect(content.getByRole<HTMLInputElement>("textbox", { name: "Monde natal" }).value).toBe("Abraxar");
  });

  test("can be used to modify the deity", async () => {
    const user = userEvent.setup();
    const content = within(document.querySelector("#content") as HTMLElement);

    await user.type(content.getByRole("textbox", { name: "Divinité" }), "Desna");
    expect(content.getByRole<HTMLInputElement>("textbox", { name: "Divinité" }).value).toBe("Desna");
  });

  test("can be used to modify the description", async () => {
    const user = userEvent.setup();
    const content = within(document.querySelector("#content") as HTMLElement);

    await user.type(content.getByRole("textbox", { name: /Biographie & description/ }), "Biographie de Bob");
    expect(content.getByRole<HTMLInputElement>("textbox", { name: /Biographie & description/ }).value).toBe(
      "Biographie de Bob"
    );
  });
});

import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, beforeEach, describe, expect, test } from "vitest";
import Page from "../page";
import Layout from "../layout";
import { navigateToTab } from "./test-helpers";

describe("TabProfile", () => {
  beforeAll(async () => {
    cleanup();
    render(await Layout({ children: <Page /> }));
    const user = userEvent.setup();
    await navigateToTab(user, "Profil");
  });

  test("is not displayed", async () => {
    const content = within(document.querySelector("#content") as HTMLElement);
    expect(content.queryByRole("heading", { level: 2, name: "Profil" })).toBeNull();
  });
});

describe("TabProfile", () => {
  beforeAll(async () => {
    cleanup();
    render(await Layout({ children: <Page /> }));
    const user = userEvent.setup();
    await navigateToTab(user, "Race");
    await user.selectOptions(screen.getByRole("combobox", { name: "Race" }), "androids");
    await navigateToTab(user, "Thème");
    await user.selectOptions(screen.getByRole("combobox", { name: "Thème" }), "bounty-hunter");
    await navigateToTab(user, "Classe");
    await user.selectOptions(screen.getByRole("combobox", { name: "Classe" }), "operative");
  });

  beforeEach(async () => {
    const user = userEvent.setup();
    await navigateToTab(user, "Profil");
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

    await navigateToTab(user, "Fiche");
    expect(content.queryByText("Bob")).not.toBeNull();
  });

  test("can be used to modify the alignment", async () => {
    const user = userEvent.setup();
    const content = within(document.querySelector("#content") as HTMLElement);

    await user.selectOptions(content.getByRole("combobox", { name: "Alignement" }), "cn");
    expect(content.getByRole<HTMLInputElement>("combobox", { name: "Alignement" }).value).toBe("cn");

    await navigateToTab(user, "Fiche");
    expect(content.queryByText("CN")).not.toBeNull();
  });

  test("can be used to modify the character sex", async () => {
    const user = userEvent.setup();
    const content = within(document.querySelector("#content") as HTMLElement);

    await user.type(content.getByRole("textbox", { name: "Sexe" }), "F");
    expect(content.getByRole<HTMLInputElement>("textbox", { name: "Sexe" }).value).toBe("F");

    await navigateToTab(user, "Fiche");
    expect(content.queryByText("F")).not.toBeNull();
  });

  test("can be used to modify the home world", async () => {
    const user = userEvent.setup();
    const content = within(document.querySelector("#content") as HTMLElement);

    await user.type(content.getByRole("textbox", { name: "Monde natal" }), "Abraxar");
    expect(content.getByRole<HTMLInputElement>("textbox", { name: "Monde natal" }).value).toBe("Abraxar");

    await navigateToTab(user, "Fiche");
    expect(content.queryByText("Abraxar")).not.toBeNull();
  });

  test("can be used to modify the deity", async () => {
    const user = userEvent.setup();
    const content = within(document.querySelector("#content") as HTMLElement);

    await user.type(content.getByRole("textbox", { name: "Divinité" }), "Desna");
    expect(content.getByRole<HTMLInputElement>("textbox", { name: "Divinité" }).value).toBe("Desna");

    await navigateToTab(user, "Fiche");
    expect(content.queryByText("Desna")).not.toBeNull();
  });

  test("can be used to modify the description", async () => {
    const user = userEvent.setup();
    const content = within(document.querySelector("#content") as HTMLElement);

    await user.type(content.getByRole("textbox", { name: /Biographie & description/ }), "Biographie de Bob");
    expect(content.getByRole<HTMLInputElement>("textbox", { name: /Biographie & description/ }).value).toBe(
      "Biographie de Bob"
    );

    await navigateToTab(user, "Fiche");
    expect(within(screen.getByTestId("description")).queryByText(/Biographie de Bob/)).not.toBeNull();
  });
});

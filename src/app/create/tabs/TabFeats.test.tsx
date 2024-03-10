import { beforeAll, beforeEach, describe, expect, test } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Page from "../page";
import Layout, { LayoutServer } from "../layout";
import { navigateToTab } from "./test-helpers";
import { Character, EmptyCharacter } from "model";

export async function setup(klass: string = "operative") {
  cleanup();
  const character: Character = {
    ...EmptyCharacter,
    race: "androids",
    raceVariant: "4a7b68dd-8d74-4b5f-9c9b-4a5c208d2fb7",
  };

  render(await LayoutServer({ children: <Page />, character }));
  const user = userEvent.setup();
  await navigateToTab(user, "Thème");
  await user.selectOptions(screen.getByRole("combobox", { name: "Thème" }), "bounty-hunter");
  await navigateToTab(user, "Classe");
  await user.selectOptions(screen.getByRole("combobox", { name: "Classe" }), klass);
}

describe("TabFeats", () => {
  beforeAll(async () => {
    cleanup();
    render(await Layout({ children: <Page /> }));
    const user = userEvent.setup();
    await navigateToTab(user, "Don(s)");
  });

  test("is not displayed", async () => {
    const content = within(document.querySelector("#content") as HTMLElement);
    expect(content.queryByRole("heading", { level: 2, name: "Dons disponibles" })).toBeNull();
  });
});

describe("TabFeats", () => {
  beforeAll(async () => {
    await setup("operative");
  });

  beforeEach(async () => {
    const user = userEvent.setup();
    await navigateToTab(user, "Don(s)");
  });

  test("is displayed", async () => {
    const content = within(document.querySelector("#content") as HTMLElement);
    expect(content.getByRole("heading", { level: 2, name: "Dons disponibles" })).not.toBeNull();
    expect(content.getByRole("heading", { level: 2, name: "Don(s) acqui(s)" })).not.toBeNull();
  });
});

describe("TabFeats feat types", () => {
  beforeAll(async () => {
    await setup("operative");
  });

  beforeEach(async () => {
    const user = userEvent.setup();
    await navigateToTab(user, "Don(s)");

    const block = screen.queryByTestId("feats-selected");
    if (block !== null) {
      const buttons = within(block).queryAllByRole("button");
      await Promise.all(buttons.map(async (button) => await user.click(button)));
    }
  });

  test("displays simple feat", async () => {
    const block = within(screen.getByTestId("feats"));
    expect(block.getByRole("heading", { name: /Simple feat/ })).not.toBeNull();
  });

  test("displays targeted feat", async () => {
    const block = within(screen.getByTestId("feats"));
    expect(block.getByRole("heading", { name: /Targeted feat/ })).not.toBeNull();
  });

  test("displays multi feat", async () => {
    const block = within(screen.getByTestId("feats"));
    expect(block.getByRole("heading", { name: /Multiple feat/ })).not.toBeNull();
  });

  test("allows simple feat selection one time only", async () => {
    const block = within(screen.getByTestId("feats"));
    const button = within(block.getByTestId(/simple-feat/)).getByRole("button");

    expect(button).not.toBeDisabled();
    expect(block.getByRole("heading", { name: /Simple feat/ })).not.toBeNull();

    const user = userEvent.setup();
    await user.click(button);

    expect(block.queryByRole("heading", { name: /Simple feat/ })).toBeNull();
  });

  test("allows targeted feat selection one time only", async () => {
    const block = within(screen.getByTestId("feats"));
    const button = within(block.getByTestId(/targeted-feat/)).getByRole("button");

    expect(button).not.toBeDisabled();
    expect(block.getByRole("heading", { name: /Targeted feat/ })).not.toBeNull();

    const user = userEvent.setup();
    await user.click(button);

    expect(block.queryByRole("heading", { name: /Targeted feat/ })).toBeNull();
  });

  test("allows multiple feat selection more than one time", async () => {
    const block = within(screen.getByTestId("feats"));
    const button = within(block.getByTestId(/multiple-feat/)).getByRole("button");

    expect(button).not.toBeDisabled();
    expect(block.getByRole("heading", { name: /Multiple feat/ })).not.toBeNull();

    const user = userEvent.setup();
    await user.click(button);

    expect(block.queryByRole("heading", { name: /Multiple feat/ })).not.toBeNull();
  });
});

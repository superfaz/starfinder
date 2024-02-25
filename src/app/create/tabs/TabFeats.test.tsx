import { beforeAll, beforeEach, describe, expect, test } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Page from "../page";

export async function setup(klass: string = "operative") {
  cleanup();
  render(await Page());
  const user = userEvent.setup();
  await user.click(screen.getByRole("button", { name: "Race" }));
  await user.selectOptions(screen.getByRole("combobox", { name: "Race" }), "androids");
  await user.click(screen.getByRole("button", { name: "Thème" }));
  await user.selectOptions(screen.getByRole("combobox", { name: "Thème" }), "bounty-hunter");
  await user.click(screen.getByRole("button", { name: "Classe" }));
  await user.selectOptions(screen.getByRole("combobox", { name: "Classe" }), klass);
}

describe("TabFeats", () => {
  beforeAll(async () => {
    cleanup();
    render(await Page());
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Don(s)" }));
  });

  test("is not displayed", async () => {
    const content = within(document.querySelector("#content") as HTMLElement);
    expect(content.queryByRole("heading", { level: 2, name: "Dons disponibles" })).toBeNull();
  });
});

describe("TabFeats feat types", () => {
  beforeAll(async () => {
    await setup("operative");
  });

  beforeEach(async () => {
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Don(s)" }));

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

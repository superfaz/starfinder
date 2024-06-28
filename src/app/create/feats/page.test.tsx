import { beforeAll, beforeEach, describe, expect, test } from "vitest";
import { cleanup, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createCharacter, renderWithData } from "../helpers-test";
import { PageContent } from "./PageContent";

export async function setup(klass: string = "operative") {
  cleanup();
  const character = createCharacter().updateRace("androids").updateTheme("bounty-hunter").updateClass(klass).character;
  await renderWithData(<PageContent />, character);
}

describe("/create/feats", () => {
  test("is not displayed", async () => {
    cleanup();
    await renderWithData(<PageContent />);
    const content = within(document.querySelector("#content") as HTMLElement);
    expect(content.queryByRole("heading", { level: 2, name: "Dons disponibles" })).toBeNull();
  });

  test("is displayed", async () => {
    await setup("operative");
    const content = within(document.querySelector("#content") as HTMLElement);
    expect(content.getByRole("heading", { level: 2, name: "Dons disponibles" })).not.toBeNull();
  });
});

describe("/create/feats feat types", () => {
  beforeAll(async () => {
    await setup("operative");
  });

  beforeEach(async () => {
    const user = userEvent.setup();
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

import { beforeAll, beforeEach, describe, expect, test } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Page from "../page";

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

describe("TabFeats with operative", () => {
  beforeAll(async () => {
    cleanup();
    render(await Page());
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Race" }));
    await user.selectOptions(screen.getByRole("combobox", { name: "Race" }), "androids");
    await user.click(screen.getByRole("button", { name: "Thème" }));
    await user.selectOptions(screen.getByRole("combobox", { name: "Thème" }), "bounty-hunter");
    await user.click(screen.getByRole("button", { name: "Classe" }));
    await user.selectOptions(screen.getByRole("combobox", { name: "Classe" }), "operative");
  });

  beforeEach(async () => {
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Don(s)" }));
  });

  test("is displayed", async () => {
    const content = within(document.querySelector("#content") as HTMLElement);
    expect(content.queryByRole("heading", { level: 2, name: "Dons disponibles" })).not.toBeNull();
  });

  test("handle abilityScore prerequisites - not available", async () => {
    const block = within(screen.getByTestId("feats"));
    expect(block.queryByText(/ability score 20/i)).toBeNull();
  });

  test("handle abilityScore prerequisites - available", async () => {
    const block = within(screen.getByTestId("feats"));
    expect(block.queryByText(/ability score 10/i)).not.toBeNull();
  });

  test("handle arms prerequisites - not available", async () => {
    const block = within(screen.getByTestId("feats"));
    expect(block.queryByText(/arms/i)).toBeNull();
  });

  test("handle baseAttack prerequisites - not available", async () => {
    const block = within(screen.getByTestId("feats"));
    expect(block.queryByText(/base attack 10/i)).toBeNull();
  });

  test("handle class prerequisites", async () => {
    const block = within(screen.getByTestId("feats"));
    expect(block.queryByText(/class not operative/i)).toBeNull();
    expect(block.queryByText(/class operative/i)).not.toBeNull();
  });

  test("handle combatFeat prerequisites - not available", async () => {
    const block = within(screen.getByTestId("feats"));
    expect(block.queryByText(/combat feat \(combat\)/i)).toBeNull();
  });

  test("handle level prerequisites - not available", async () => {
    const block = within(screen.getByTestId("feats"));
    expect(block.queryByText(/level 3/i)).toBeNull();
  });

  test("handle skillRank prerequisites - not available", async () => {
    const block = within(screen.getByTestId("feats"));
    expect(block.queryByText(/skill rank cult 1/i)).toBeNull();
  });

  test("handle skillRank prerequisites - available", async () => {
    const block = within(screen.getByTestId("feats"));
    expect(block.queryByText(/skill rank acro 1/i)).not.toBeNull();
  });

  test("handle weaponProficiency prerequisites - not available", async () => {
    const block = within(screen.getByTestId("feats"));
    expect(block.queryByText(/weapon heavy/i)).toBeNull();
  });

  test("handle weaponProficiency prerequisites - available", async () => {
    const block = within(screen.getByTestId("feats"));
    expect(block.queryByText(/weapon basic/i)).not.toBeNull();
  });

  test("handle feat prerequisites - not available", async () => {
    const block = within(screen.getByTestId("feats"));
    expect(block.queryByText(/feat weapon basic/i)).toBeNull();
  });

  test("handle feat prerequisites - available", async () => {
    const user = userEvent.setup();
    const block = within(screen.getByTestId("feats"));

    await user.click(
      within(block.getByText(/weapon basic/i).parentElement as HTMLElement).getByRole("button", {
        name: "Ajouter",
      })
    );

    expect(block.queryByText(/feat weapon basic/i)).not.toBeNull();
  });
});

describe("TabFeats with soldier", () => {
  beforeAll(async () => {
    cleanup();
    render(await Page());
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Race" }));
    await user.selectOptions(screen.getByRole("combobox", { name: "Race" }), "androids");
    await user.click(screen.getByRole("button", { name: "Thème" }));
    await user.selectOptions(screen.getByRole("combobox", { name: "Thème" }), "bounty-hunter");
    await user.click(screen.getByRole("button", { name: "Classe" }));
    await user.selectOptions(screen.getByRole("combobox", { name: "Classe" }), "soldier");
  });

  beforeEach(async () => {
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Don(s)" }));
  });

  test("handle baseAttack prerequisites - available", async () => {
    const block = within(screen.getByTestId("feats"));
    expect(block.queryByText(/base attack 1/i)).not.toBeNull();
  });
});

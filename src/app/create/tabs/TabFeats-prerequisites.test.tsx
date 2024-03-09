import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, beforeEach, describe, expect, test } from "vitest";
import { setup } from "./TabFeats.test";
import { navigateToTab } from "./test-helpers";

describe("TabFeats prerequisites with operative", () => {
  beforeAll(async () => {
    await setup("operative");
  });

  beforeEach(async () => {
    const user = userEvent.setup();
    await navigateToTab(user, "Don(s)");
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

  test("handle savingThrow prerequisites - not available", async () => {
    const block = within(screen.getByTestId("feats"));
    expect(block.queryByText(/savingThrow fortitude 1/i)).toBeNull();
    expect(block.queryByText(/savingThrow reflex 1/i)).not.toBeNull();
  });

  test("handle notSpellCaster prerequisites - available", async () => {
    const block = within(screen.getByTestId("feats"));
    expect(block.getByText(/Not spell caster/)).toBeDefined();
  });

  test("handle spellCaster prerequisites - not available", async () => {
    const block = within(screen.getByTestId("feats"));
    expect(block.queryByText(/Spell caster/)).toBeNull();
  });
});

describe("TabFeats prerequisites with soldier", () => {
  beforeAll(async () => {
    await setup("soldier");
  });

  beforeEach(async () => {
    const user = userEvent.setup();
    await navigateToTab(user, "Don(s)");
  });

  test("handle baseAttack prerequisites - available", async () => {
    const block = within(screen.getByTestId("feats"));
    expect(block.queryByText(/base attack 1/i)).not.toBeNull();
  });
});

describe("TabFeats prerequisites with mystic", () => {
  beforeAll(async () => {
    await setup("mystic");
  });

  beforeEach(async () => {
    const user = userEvent.setup();
    await navigateToTab(user, "Don(s)");
  });

  test("handle notSpellCaster prerequisites - not available", async () => {
    const block = within(screen.getByTestId("feats"));
    expect(block.queryByText(/Not spell caster/)).toBeNull();
  });

  test("handle spellCaster prerequisites - available", async () => {
    const block = within(screen.getByTestId("feats"));
    expect(block.getByText(/Spell caster/)).toBeDefined();
  });
});

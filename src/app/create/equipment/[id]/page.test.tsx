import { cleanup, screen, waitFor, within } from "@testing-library/react";
import { createCharacter, renderWithData } from "app/create/helpers-test";
import { beforeAll, describe, expect, test } from "vitest";
import Page from "./page";
import { EquipmentDescriptor } from "model";
import { dump } from "app/test-helpers";

describe("/create/equipment/id", () => {
  beforeAll(async () => {
    cleanup();
    await renderWithData(<Page params={{ id: "test-id" }} />);
  });

  test("is not displayed", async () => {
    const content = within(document.querySelector("#content") as HTMLElement);
    expect(content.queryByRole("heading", { level: 2, name: "Arme modifiée" })).toBeNull();
  });
});

describe("/create/equipment/id", () => {
  beforeAll(async () => {
    cleanup();
    const descriptor: EquipmentDescriptor = {
      id: "test-id",
      type: "unique",
      category: "weapon",
      equipmentId: "2b7340aa-9a60-4715-9246-8e910b5868dc",
      quantity: 1,
      secondaryType: "basic",
      unitaryCost: 100,
    };
    const character = createCharacter()
      .updateRace("androids")
      .updateTheme("bounty-hunter")
      .updateClass("operative")
      .addEquipment(descriptor).character;
    await renderWithData(<Page params={{ id: "test-id" }} />, character);
    await waitFor(() => screen.getByRole("heading", { level: 2, name: "Crédits" }));
  });

  test("is displayed", async () => {
    const content = within(document.querySelector("#content") as HTMLElement);
    expect(content.queryByRole("heading", { level: 2, name: "Arme modifiée" })).not.toBeNull();
    expect(content.queryByRole("heading", { level: 2, name: "Crédits" })).not.toBeNull();
    expect(content.queryByRole("heading", { level: 4, name: "Fusions" })).not.toBeNull();
  });
});

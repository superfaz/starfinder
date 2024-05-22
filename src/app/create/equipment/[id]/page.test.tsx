import { cleanup, screen, waitFor, within } from "@testing-library/react";
import { createCharacter, renderWithData } from "app/create/helpers-test";
import { beforeAll, beforeEach, describe, expect, test, vi } from "vitest";
import Page from "./page";
import { EquipmentDescriptor } from "model";
import Layout from "../layout";

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

const weaponDescriptors: EquipmentDescriptor[] = [
  {
    id: "test-id",
    type: "unique",
    category: "weapon",
    equipmentId: "2b7340aa-9a60-4715-9246-8e910b5868dc",
    quantity: 1,
    secondaryType: "basic",
    unitaryCost: 100,
  },
  {
    id: "test-id",
    type: "unique",
    category: "weapon",
    equipmentId: "2ee717f8-a4f4-4919-86fd-9136caba11b6",
    quantity: 1,
    secondaryType: "advanced",
    unitaryCost: 100,
  },
  {
    id: "test-id",
    type: "unique",
    category: "weapon",
    equipmentId: "70c9e827-d25b-47c6-8ffe-c8101129bf5b",
    quantity: 1,
    secondaryType: "small",
    unitaryCost: 100,
  },
  {
    id: "test-id",
    type: "unique",
    category: "weapon",
    equipmentId: "74b929fc-b4a7-4e96-a30d-e6ee8b8b54d3",
    quantity: 1,
    secondaryType: "long",
    unitaryCost: 100,
  },
  {
    id: "test-id",
    type: "unique",
    category: "weapon",
    equipmentId: "d6366816-29bf-4dd5-be10-df77b2063f75",
    quantity: 1,
    secondaryType: "heavy",
    unitaryCost: 100,
  },
  {
    id: "test-id",
    type: "unique",
    category: "weapon",
    equipmentId: "39be97e5-e678-4a78-b0b3-0d262b35d096",
    quantity: 1,
    secondaryType: "sniper",
    unitaryCost: 100,
  },
];

describe("/create/equipment/id for weapons", () => {
  beforeEach(async () => {
    cleanup();

    vi.mock("next/navigation", () => ({
      useParams: () => ({ id: "test-id" }),
      usePathname: () => "",
    }));
  });

  test.each(weaponDescriptors)("$secondaryType", async (descriptor) => {
    const character = createCharacter()
      .updateRace("androids")
      .updateTheme("bounty-hunter")
      .updateClass("operative")
      .addEquipment(descriptor).character;
    await renderWithData(
      <Layout>
        <Page params={{ id: descriptor.id }} />
      </Layout>,
      character
    );
    await waitFor(() => screen.getByRole("heading", { level: 2, name: "Crédits" }));

    const content = within(document.querySelector("#content") as HTMLElement);
    expect(content.queryByRole("heading", { level: 2, name: "Arme modifiée" })).not.toBeNull();
    expect(content.queryByRole("heading", { level: 2, name: "Crédits" })).not.toBeNull();

    await waitFor(() => content.getByRole("heading", { level: 4, name: "Fusions" }));
    if (["basic", "advanced"].includes(descriptor.secondaryType)) {
      expect(content.getByRole("combobox", { name: "Matériau" })).not.toBeDisabled();
    } else {
      expect(content.getByRole("combobox", { name: "Matériau" })).toBeDisabled();
    }
  });
});

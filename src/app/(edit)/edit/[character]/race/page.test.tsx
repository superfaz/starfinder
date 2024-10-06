import { beforeAll, describe, expect, test, vi } from "vitest";
import { cleanup, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import races from "mocks/races.json";
import { RaceSchema } from "model";
import { createCharacter, renderWithData } from "../helpers-test";
import { PageContent } from "./PageContent";
import { createState } from "./actions";

vi.mock("next/navigation", () => ({
  useParams: () => ({ character: 1 }),
  usePathname: () => "",
}));

vi.mock("@kinde-oss/kinde-auth-nextjs/server", () => ({
  isAuthenticated: () => true,
  getUser: () => ({ id: "test_user_1" }),
}));

describe("/edit/[character]/race", () => {
  beforeAll(async () => {
    cleanup();
    const character = createCharacter().updateName("Test").character;
    const initial = await createState({ ...character, userId: "test_user_1" });
    await renderWithData(<PageContent races={races.map((r: unknown) => RaceSchema.parse(r))} initial={initial} />);
  });

  test("displays RaceSelection", async () => {
    expect(screen.getByRole("heading", { level: 2, name: "Race" })).toBeDefined();
  });

  test("displays RaceTraits", async () => {
    expect(screen.getByRole("heading", { level: 2, name: "Traits raciaux" })).toBeDefined();
  });

  test("displays RaceAlternateTraits", async () => {
    expect(screen.getByRole("heading", { level: 2, name: "Traits alternatifs" })).toBeDefined();
  });

  test("displays the variants after race selection", async () => {
    const user = userEvent.setup();
    expect(screen.queryAllByRole("combobox", { name: "Variante" }).length).toBe(0);

    await user.selectOptions(screen.getByRole("combobox", { name: "Race" }), "androids");

    expect(screen.getByRole<HTMLInputElement>("combobox", { name: "Race" }).value).toBe("androids");
    expect(screen.getByRole("combobox", { name: "Variante" })).toBeDefined();
  });
});

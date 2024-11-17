import { beforeAll, describe, expect, test, vi } from "vitest";
import { cleanup, screen, within } from "@testing-library/react";
import { DataSource } from "data";
import { ViewBuilder } from "view/server";
import { createCharacter, renderWithData } from "./helpers-test";
import { PageContent } from "./PageContent";

vi.mock("next/navigation", () => ({
  useParams: () => ({ character: 1 }),
  usePathname: () => "",
}));

vi.mock("@kinde-oss/kinde-auth-nextjs/server", () => ({
  getKindeServerSession: () => ({}),
}));

vi.mock("next/cache", () => ({
  unstable_cache: (f: unknown) => f,
}));

describe("Page", () => {
  beforeAll(async () => {
    cleanup();

    const character = createCharacter()
      .updateRace("androids")
      .updateTheme("bounty-hunter")
      .updateClass("operative").character;
    const viewBuilder = new ViewBuilder(new DataSource());
    const view = await viewBuilder.createCharacterDetailed(character);

    await renderWithData(<PageContent character={view} alerts={{}} />, character);
  });

  test("is live", async () => {
    expect(screen.getByRole("heading", { level: 3, name: "Race" })).toBeDefined();
    expect(screen.getByRole("heading", { level: 3, name: "Thème" })).toBeDefined();
    expect(screen.getByRole("heading", { level: 3, name: "Classe" })).toBeDefined();
  });

  const entries = [
    { code: "race", title: "Race", value: "Androïdes" },
    { code: "theme", title: "Thème", value: "Chasseur de primes" },
    { code: "class", title: "Classe", value: "Agent" },
  ];
  test.each(entries)("displays the detailed data - $code", async (entry) => {
    const block = within(screen.getByTestId(entry.code));
    expect(await block.findByRole("heading", { level: 3, name: entry.title })).toBeDefined();
    expect(await block.findByText(entry.value)).toBeDefined();
  });
});

import { beforeAll, describe, expect, test, vi } from "vitest";
import { cleanup, screen } from "@testing-library/react";
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

describe("Page", () => {
  beforeAll(async () => {
    cleanup();

    const character = createCharacter()
      .updateRace("androids")
      .updateTheme("bounty-hunter")
      .updateClass("operative").character;
    console.error(character);
    const viewBuilder = new ViewBuilder(new DataSource());
    const view = await viewBuilder.createCharacterDetailed(character);

    await renderWithData(<PageContent character={view} alerts={{}} />, character);
  });

  test("Page is live", async () => {
    expect(screen.getByRole("heading", { level: 2, name: "Introduction" })).toBeDefined();
  });
});

import { beforeAll, describe, expect, test } from "vitest";
import { cleanup, within } from "@testing-library/react";
import { createCharacter, renderWithData } from "../helpers-test";
import { PageContent } from "./PageContent";

describe("/create/theme", () => {
  beforeAll(async () => {
    cleanup();
    await renderWithData(<PageContent />);
  });

  test("is not displayed by default", async () => {
    const content = within(document.querySelector("#content") as HTMLElement);
    expect(content.queryByRole("heading", { level: 2, name: "Thème" })).toBeNull();
  });
});

describe("/create/theme", () => {
  beforeAll(async () => {
    cleanup();
    const character = createCharacter().updateRace("androids").character;
    await renderWithData(<PageContent />, character);
  });

  test("displays ThemeSelection", async () => {
    const content = within(document.querySelector("#content") as HTMLElement);
    expect(content.queryByRole("heading", { level: 2, name: "Thème" })).not.toBeNull();
  });
});

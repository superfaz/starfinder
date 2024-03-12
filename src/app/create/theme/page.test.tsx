import { beforeAll, describe, expect, test } from "vitest";
import { cleanup, within } from "@testing-library/react";
import Page from "./page";
import { createCharacter, renderWithData } from "../helpers-test";

describe("/create/theme", () => {
  beforeAll(async () => {
    cleanup();
    await renderWithData(<Page />);
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
    await renderWithData(<Page />, character);
  });

  test("displays ThemeSelection", async () => {
    const content = within(document.querySelector("#content") as HTMLElement);
    expect(content.queryByRole("heading", { level: 2, name: "Thème" })).not.toBeNull();
  });
});

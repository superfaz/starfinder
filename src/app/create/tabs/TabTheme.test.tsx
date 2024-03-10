import { beforeAll, beforeEach, describe, expect, test } from "vitest";
import { cleanup, render, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Page from "../page";
import Layout, { LayoutServer } from "../layout";
import { navigateToTab } from "./test-helpers";
import { Character, EmptyCharacter } from "model";

describe("TabTheme", () => {
  beforeAll(async () => {
    cleanup();
    render(await Layout({ children: <Page /> }));
    const user = userEvent.setup();
    await navigateToTab(user, "Thème");
  });

  test("is not displayed by default", async () => {
    const content = within(document.querySelector("#content") as HTMLElement);
    expect(content.queryByRole("heading", { level: 2, name: "Thème" })).toBeNull();
  });
});

describe("TabTheme", () => {
  beforeAll(async () => {
    cleanup();
    const character: Character = {
      ...EmptyCharacter,
      race: "androids",
      raceVariant: "4a7b68dd-8d74-4b5f-9c9b-4a5c208d2fb7",
    };
    render(await LayoutServer({ children: <Page />, character }));
  });

  beforeEach(async () => {
    const user = userEvent.setup();
    await navigateToTab(user, "Thème");
  });

  test("displays ThemeSelection", async () => {
    const content = within(document.querySelector("#content") as HTMLElement);
    expect(content.queryByRole("heading", { level: 2, name: "Thème" })).not.toBeNull();
  });
});

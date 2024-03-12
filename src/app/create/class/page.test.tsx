import { beforeAll, describe, expect, test } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Page from "./page";
import Layout, { LayoutServer } from "../layout";
import { createCharacter } from "../helpers-test";

describe("/create/class", () => {
  beforeAll(async () => {
    cleanup();
    render(await Layout({ children: <Page /> }));
  });

  test("is not displayed", async () => {
    const content = within(document.querySelector("#content") as HTMLElement);
    expect(content.queryByRole("heading", { level: 2, name: "Classe" })).toBeNull();
  });
});

describe("/create/class", () => {
  beforeAll(async () => {
    cleanup();
    const character = createCharacter().updateRace("androids").updateTheme("bounty-hunter").character;
    render(await LayoutServer({ children: <Page />, character }));
  });

  test("is displayed", async () => {
    const content = within(document.querySelector("#content") as HTMLElement);
    expect(content.queryByRole("heading", { level: 2, name: "Classe" })).not.toBeNull();
  });

  const classes = [
    { id: "operative", expected: "Spécialisation" },
    { id: "soldier", expected: "Don de combat" },
  ];
  test.each(classes)(
    "displays details for class '$id'",
    async (klass) => {
      const user = userEvent.setup();
      await user.selectOptions(screen.getByRole("combobox", { name: "Classe" }), klass.id);
      const content = within(document.querySelector("#content") as HTMLElement);
      const view = content.getByRole("heading", { level: 2, name: "Abilités de classe" }).parentElement;
      if (view === null) {
        throw new Error("view is null");
      }

      expect(within(view).getByRole("heading", { name: klass.expected })).not.toBeNull();
    },
    { timeout: 10000 }
  );
});

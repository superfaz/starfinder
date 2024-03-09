import { beforeAll, beforeEach, describe, expect, test } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Page from "../page";
import Layout from "../layout";
import { navigateToTab } from "./test-helpers";

describe("TabClass", () => {
  beforeAll(async () => {
    cleanup();
    render(await Layout({ children: <Page /> }));
    const user = userEvent.setup();
    await navigateToTab(user, "Classe");
  });

  test("is not displayed", async () => {
    const content = within(document.querySelector("#content") as HTMLElement);
    expect(content.queryByRole("heading", { level: 2, name: "Classe" })).toBeNull();
  });
});

describe("TabClass", () => {
  beforeAll(async () => {
    cleanup();
    render(await Layout({ children: <Page /> }));
    const user = userEvent.setup();
    await navigateToTab(user, "Race");
    await user.selectOptions(screen.getByRole("combobox", { name: "Race" }), "androids");
    await navigateToTab(user, "Thème");
    await user.selectOptions(screen.getByRole("combobox", { name: "Thème" }), "bounty-hunter");
  });

  beforeEach(async () => {
    const user = userEvent.setup();
    await navigateToTab(user, "Classe");
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

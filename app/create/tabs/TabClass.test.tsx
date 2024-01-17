import { beforeEach, describe, expect, test } from "@jest/globals";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Page from "../page";

describe("TabClass", () => {
  beforeEach(async () => {
    render(await Page());
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Classe" }));
  });

  test("is not displayed", async () => {
    const content = within(document.querySelector("#content") as HTMLElement);
    expect(content.queryByRole("heading", { level: 2, name: "Classe" })).toBeNull();
  });
});

describe("TabClass", () => {
  beforeEach(async () => {
    render(await Page());
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Race" }));
    await user.selectOptions(screen.getByRole("combobox", { name: "Race" }), "androids");
    await user.click(screen.getByRole("button", { name: "Thème" }));
    await user.selectOptions(screen.getByRole("combobox", { name: "Thème" }), "bounty-hunter");
    await user.click(screen.getByRole("button", { name: "Classe" }));
  });

  test("is displayed", async () => {
    const content = within(document.querySelector("#content") as HTMLElement);
    expect(content.queryByRole("heading", { level: 2, name: "Classe" })).not.toBeNull();
  });

  const classes = [
    { id: "operative", expected: "Avantage de l'agent (EXT)" },
    { id: "soldier", expected: "Don de combat" },
  ];
  test.each(classes)("displays details for class '$id'", async (klass) => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByRole("combobox", { name: "Classe" }), klass.id);

    const content = within(document.querySelector("#content") as HTMLElement);
    const view = content.getByRole("heading", { level: 2, name: "Abilités de classe" }).parentElement;
    if (view === null) {
      throw new Error("view is null");
    }

    expect(within(view).queryByText(klass.expected)).not.toBeNull();
  });
});

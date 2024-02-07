import { beforeAll, beforeEach, describe, expect, test } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Page from "../page";

describe("TabSpells", () => {
  beforeAll(async () => {
    cleanup();
    render(await Page());
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Sorts" }));
  });

  test("is not displayed", async () => {
    const content = within(document.querySelector("#content") as HTMLElement);
    expect(content.queryByRole("heading", { level: 2, name: /Sorts de niveau 0/ })).toBeNull();
  });

  test("is not displayed for soldier", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Race" }));
    await user.selectOptions(screen.getByRole("combobox", { name: "Race" }), "androids");
    await user.click(screen.getByRole("button", { name: "Thème" }));
    await user.selectOptions(screen.getByRole("combobox", { name: "Thème" }), "bounty-hunter");
    await user.click(screen.getByRole("button", { name: "Classe" }));
    await user.selectOptions(screen.getByRole("combobox", { name: "Classe" }), "soldier");
    await user.click(screen.getByRole("button", { name: "Sorts" }));

    const content = within(document.querySelector("#content") as HTMLElement);
    expect(content.queryByRole("heading", { level: 2, name: /Sorts de niveau 0/ })).toBeNull();
  });
});

describe("TabSpells", () => {
  beforeEach(async () => {
    cleanup();
    render(await Page());

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Race" }));
    await user.selectOptions(screen.getByRole("combobox", { name: "Race" }), "androids");
    await user.click(screen.getByRole("button", { name: "Thème" }));
    await user.selectOptions(screen.getByRole("combobox", { name: "Thème" }), "bounty-hunter");
    await user.click(screen.getByRole("button", { name: "Classe" }));
    await user.selectOptions(screen.getByRole("combobox", { name: "Classe" }), "mystic");
    await user.click(screen.getByRole("button", { name: "Sorts" }));
  });

  test("is displayed", async () => {
    const content = within(document.querySelector("#content") as HTMLElement);
    expect(content.queryByRole("heading", { level: 2, name: /Sorts de niveau 0/ })).not.toBeNull();
  });
});

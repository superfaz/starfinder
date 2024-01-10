import { beforeEach, describe, expect, test } from "@jest/globals";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Page from "../page";

describe("TabSheet", () => {
  beforeEach(async () => {
    render(await Page());
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Fiche" }));
  });

  test("Sheet is not displayed", async () => {
    const content = within(document.querySelector("#content") as HTMLElement);
    expect(content.queryByRole("heading", { level: 2, name: "Fiche de personnage" })).toBeNull();
  });
});

describe("TabSheet", () => {
  beforeEach(async () => {
    render(await Page());
  });

  test("Sheet is displayed", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Fiche" }));
    const content = within(document.querySelector("#content") as HTMLElement);

    expect(content.getByTestId("Nom du personnage")).toBeVisible();
  });

  test("Race is updated", async () => {
    const user = userEvent.setup();

    const view = screen.getByTestId("Race");
    expect(within(view).queryByText("Race")).not.toBeNull();
    expect(within(view).queryByText("-")).not.toBeNull();
    expect(within(view).queryByText("Androïdes")).toBeNull();
    expect(within(view).queryByText("Race")).not.toBeVisible();

    await user.click(screen.getByRole("button", { name: "Race" }));
    await user.selectOptions(screen.getByRole("combobox", { name: "Race" }), "androids");

    await user.click(screen.getByRole("button", { name: "Fiche" }));
    expect(within(view).queryByText("Race")).toBeVisible();
    expect(within(view).queryByText("-")).toBeNull();
    expect(within(view).queryByText("Androïdes")).not.toBeNull();
  });
});

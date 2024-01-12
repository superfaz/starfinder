import { beforeEach, describe, expect, test } from "@jest/globals";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Page from "../page";

describe("TabSkills", () => {
  beforeEach(async () => {
    render(await Page());
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Caractéristiques & Compétences" }));
  });

  test("is not displayed", async () => {
    const content = within(document.querySelector("#content") as HTMLElement);
    expect(content.queryByRole("heading", { level: 2, name: "Caractéristiques" })).toBeNull();
    expect(content.queryByRole("heading", { level: 2, name: "Compétences" })).toBeNull();
  });
});

describe("TabSkills", () => {
  beforeEach(async () => {
    render(await Page());
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Race" }));
    await user.selectOptions(screen.getByRole("combobox", { name: "Race" }), "androids");
    await user.click(screen.getByRole("button", { name: "Thème" }));
    await user.selectOptions(screen.getByRole("combobox", { name: "Thème" }), "bounty-hunter");
    await user.click(screen.getByRole("button", { name: "Classe" }));
    await user.selectOptions(screen.getByRole("combobox", { name: "Classe" }), "operative");
    await user.click(screen.getByRole("button", { name: "Caractéristiques & Compétences" }));
  });

  test("is displayed", async () => {
    const content = within(document.querySelector("#content") as HTMLElement);
    expect(content.queryByRole("heading", { level: 2, name: "Caractéristiques" })).not.toBeNull();
    expect(content.queryByRole("heading", { level: 2, name: "Compétences" })).not.toBeNull();
  });

  test("displays calculated minimal ability scores", async () => {
    const content = within(document.querySelector("#content") as HTMLElement);
    expect(content.getByRole("spinbutton", { name: "Force" })).toHaveProperty("value", "10");
    expect(content.getByRole("spinbutton", { name: "Dextérité +2" })).toHaveProperty("value", "12");
    expect(content.getByRole("spinbutton", { name: "Constitution +1" })).toHaveProperty("value", "11");
    expect(content.getByRole("spinbutton", { name: "Intelligence +2" })).toHaveProperty("value", "12");
    expect(content.getByRole("spinbutton", { name: "Sagesse" })).toHaveProperty("value", "10");
    expect(content.getByRole("spinbutton", { name: "Charisme -2" })).toHaveProperty("value", "8");
  });

  test.failing("add +1 when the theme skill is already a class skill", async () => {
    const content = within(document.querySelector("#content") as HTMLElement);
    const view = within(content.getByTestId("surv"));
    expect(view.getByText("+1")).not.toBeNull();
  });
});

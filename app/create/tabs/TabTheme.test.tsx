import { beforeEach, describe, expect, test } from "@jest/globals";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Page from "../page";

describe("TabTheme", () => {
  beforeEach(async () => {
    render(await Page());
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Thème" }));
  });

  test("is not displayed by default", async () => {
    const content = within(document.querySelector("#content") as HTMLElement);
    expect(content.queryByRole("heading", { level: 2, name: "Thème" })).toBeNull();
  });
});

describe("TabTheme", () => {
  beforeEach(async () => {
    render(await Page());
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Race" }));
    await user.selectOptions(screen.getByRole("combobox", { name: "Race" }), "androids");
    await user.click(screen.getByRole("button", { name: "Thème" }));
  });

  test("displays ThemeSelection", async () => {
    const content = within(document.querySelector("#content") as HTMLElement);
    expect(content.queryByRole("heading", { level: 2, name: "Thème" })).not.toBeNull();
  });
});

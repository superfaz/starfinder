import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Page from "../page";

describe("TabClass", () => {
  beforeEach(async () => {
    render(<Page />);
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Classe" }));
  });

  test("ClassSelection is not displayed", async () => {
    const content = within(document.querySelector("#content") as HTMLElement);
    expect(content.queryByRole("heading", { level: 2, name: "Classe" })).toBeNull();
  });
});

describe("TabClass", () => {
  beforeEach(async () => {
    render(<Page />);
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Race" }));
    await user.selectOptions(screen.getByRole("combobox", { name: "Race" }), "androids");
    await user.click(screen.getByRole("button", { name: "Thème" }));
    await user.selectOptions(screen.getByRole("combobox", { name: "Thème" }), "aa401a3f-5c53-40d5-8157-9276b130735d");
    await user.click(screen.getByRole("button", { name: "Classe" }));
  });

  test("ClassSelection is displayed", async () => {
    const content = within(document.querySelector("#content") as HTMLElement);
    expect(content.queryByRole("heading", { level: 2, name: "Classe" })).not.toBeNull();
  });
});

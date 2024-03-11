import { describe, beforeAll, test, expect, beforeEach } from "vitest";
import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Page from "../page";
import referential from "./page.test.json";
import Layout, { LayoutServer } from "../layout";
import { navigateToTab } from "../tabs/test-helpers";
import { Character, EmptyCharacter } from "model";

describe("TabSkills", () => {
  beforeAll(async () => {
    cleanup();
    render(await Layout({ children: <Page /> }));
    const user = userEvent.setup();
    await navigateToTab(user, referential.title);
  });

  test("is not displayed", async () => {
    const content = within(document.querySelector("#content") as HTMLElement);
    expect(content.queryByRole("heading", { level: 2, name: "Caractéristiques" })).toBeNull();
    expect(content.queryByRole("heading", { level: 2, name: "Compétences" })).toBeNull();
  });
});

describe("TabSkills", () => {
  beforeAll(async () => {
    cleanup();
    const character: Character = {
      ...EmptyCharacter,
      race: "androids",
      raceVariant: "4a7b68dd-8d74-4b5f-9c9b-4a5c208d2fb7",
      traits: [
        "62551516-da4e-4adb-9d4e-af52ade0d7fa",
        "1653ddac-b66e-4da0-9a97-35dfcd5a71e3",
        "07b883eb-4568-4e24-bec4-293ced40adc2",
        "470b64bd-f308-4192-99fd-17656e9bc386",
      ],
    };

    render(await LayoutServer({ children: <Page />, character }));
    const user = userEvent.setup();
    await navigateToTab(user, "Thème");
    await user.selectOptions(screen.getByRole("combobox", { name: "Thème" }), "bounty-hunter");
    await navigateToTab(user, "Classe");
    await user.selectOptions(screen.getByRole("combobox", { name: "Classe" }), "operative");
  });

  beforeEach(async () => {
    const user = userEvent.setup();
    await navigateToTab(user, referential.title);
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

  test("displays modifiers", async () => {
    const content = within(document.querySelector("#content") as HTMLElement);
    expect(content.getByRole("heading", { name: "Modificateurs", level: 2 })).not.toBeNull();
    const section = content.getByRole("heading", { name: "Modificateurs", level: 2 }).parentElement;
    if (section !== null) {
      expect(within(section).getByText("Emotions contrôlées"), "Can't display modifiers from race").toBeVisible();
      expect(within(section).getByText("Skill Focus - Acrobaties"), "Can't display modifiers from feats").toBeVisible();
    } else {
      expect(true).toBeFalsy();
    }
  });

  test("adds +1 when the theme skill is already a class skill", async () => {
    // Survival is expected to be at +2:
    //   Wisdom: 10       --> +0
    //   Class skills x2  --> +1
    //   Class: Operative --> +1 (all)
    const content = within(document.querySelector("#content") as HTMLElement);
    const view = within(content.getByTestId("surv"));
    expect(view.getByText("+2")).not.toBeNull();
  });

  test("applies 'skill' modifiers", async () => {
    // Sens motive is expected to be at -1:
    //   Wisdom: 10       --> +0
    //   Race: Android    --> -2 (sens)
    //   Class: Operative --> +1 (all)
    const view = within(screen.getByTestId("sens"));
    expect(view.getByText("-1")).not.toBeNull();
  });

  test("calculates skill rank points", async () => {
    // skill rank points is expected to be 9:
    //   Class: Operative --> +8
    //   Intelligence: 12 --> +1
    const control = screen.getByRole("textbox", {
      name: /rangs de compétence à distribuer/i,
    }) as HTMLInputElement;

    expect(control).not.toBeNull();
    expect(control.value).toBe("9");
  });

  test.each(["acro", "athl"])("applies 'rank' modifiers for '%s'", async (skill) => {
    const view = within(screen.getByTestId(skill));
    const control = view.queryByRole("checkbox", { name: /compétence de classe/i });
    expect(control).not.toBeNull();
    expect(control).toBeChecked();
    expect(control).toBeDisabled();
  });

  test("enable skills with mandatory ranks", async () => {
    const user = userEvent.setup();
    await navigateToTab(user, "Classe");
    await user.selectOptions(screen.getByRole("combobox", { name: "Classe" }), "operative");
    await waitFor(() => expect(screen.queryByRole("combobox", { name: "Spécialisation" })).not.toBeNull());
    await user.selectOptions(
      screen.getByRole("combobox", { name: "Spécialisation" }),
      "7d74e198-2856-4496-8fff-4685a6187ed3"
    );
    await navigateToTab(user, referential.title);

    const view = within(screen.getByTestId("cult"));
    const control = view.queryByRole("checkbox", { name: /culture \(int\)$/i });
    expect(control).not.toBeNull();
    expect(control).toBeChecked();
    expect(control).toBeDisabled();
    expect(view.getByText("+9")).not.toBeNull();
  });
});

describe("TabSkills", () => {
  beforeAll(async () => {
    cleanup();
    const character: Character = {
      ...EmptyCharacter,
      race: "androids",
      raceVariant: "4a7b68dd-8d74-4b5f-9c9b-4a5c208d2fb7",
      traits: [
        "62551516-da4e-4adb-9d4e-af52ade0d7fa",
        "1653ddac-b66e-4da0-9a97-35dfcd5a71e3",
        "07b883eb-4568-4e24-bec4-293ced40adc2",
        "470b64bd-f308-4192-99fd-17656e9bc386",
      ],
    };
    render(await LayoutServer({ children: <Page />, character }));
  });

  const matrix = referential.classes.flatMap((klass) => referential.themes.map((theme) => ({ klass, theme })));
  test.each(matrix)(
    "displays the class skills based on theme $theme.id and class $klass.id",
    async ({ theme, klass }) => {
      const user = userEvent.setup();
      await navigateToTab(user, "Thème");
      await user.selectOptions(screen.getByRole("combobox", { name: "Thème" }), theme.id);
      await navigateToTab(user, "Classe");
      await user.selectOptions(screen.getByRole("combobox", { name: "Classe" }), klass.id);
      await navigateToTab(user, referential.title);

      for (const skill of [...klass.classSkills, ...theme.classSkills]) {
        const control = screen.queryByRole("checkbox", { name: skill + " - Compétence de classe" });
        expect(control).not.toBeNull();
        expect(control).toBeChecked();
        expect(control).toBeDisabled();
      }
    }
  );
});

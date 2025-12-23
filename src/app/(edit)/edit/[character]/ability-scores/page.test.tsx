import { cleanup, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, beforeAll, test, expect, beforeEach, vi } from "vitest";
import { createCharacter, renderWithData } from "../helpers-test";
import referential from "./page.test.json";
import { PageContent } from "./PageContent";

vi.mock("next/navigation", () => ({
  useParams: () => ({ character: 1 }),
  usePathname: () => "",
}));

describe("/edit/skills", () => {
  beforeAll(async () => {
    cleanup();

    const character = createCharacter()
      .updateRace("androids")
      .updateTheme("bounty-hunter")
      .updateClass("operative").character;
    await renderWithData(<PageContent />, character);
  });

  test("is displayed", async () => {
    const content = within(document.querySelector("#content") as HTMLElement);
    expect(content.queryByRole("heading", { level: 2, name: "Caractéristiques" })).not.toBeNull();
    expect(content.queryByRole("heading", { level: 2, name: "Compétences" })).not.toBeNull();
  });

  test("displays calculated minimal ability scores", async () => {
    const view = within(screen.getByTestId("ability-scores"));
    expect(view.getByRole("spinbutton", { name: "Force" })).toHaveProperty("value", "10");
    expect(view.getByRole("spinbutton", { name: "Dextérité +2" })).toHaveProperty("value", "12");
    expect(view.getByRole("spinbutton", { name: "Constitution +1" })).toHaveProperty("value", "11");
    expect(view.getByRole("spinbutton", { name: "Intelligence +2" })).toHaveProperty("value", "12");
    expect(view.getByRole("spinbutton", { name: "Sagesse" })).toHaveProperty("value", "10");
    expect(view.getByRole("spinbutton", { name: "Charisme -2" })).toHaveProperty("value", "8");
  });

  test("displays modifiers", async () => {
    const view = within(screen.getByTestId("modifiers"));
    expect(view.getByRole("heading", { name: "Modificateurs", level: 2 })).not.toBeNull();
    expect(view.getByText("Emotions contrôlées"), "Can't display modifiers from race").toBeVisible();
    expect(view.getByText("Skill Focus - Acrobaties"), "Can't display modifiers from feats").toBeVisible();
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
    const control = screen.getByRole<HTMLInputElement>("textbox", {
      name: /rangs de compétence à distribuer/i,
    });

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

  test("manages multiples bonuses with the same category", async () => {
    // Acrobaties is expected to be at +8:
    //   Dexterity: 12    --> +1
    //   Skill focus:     --> +3 insight
    //   Class: Operative --> +1 insight (all)
    //   Class: Operative --> +4 automatic rank
    const content = within(document.querySelector("#content") as HTMLElement);
    const view = within(content.getByTestId("acro"));
    expect(view.getByText("+8")).not.toBeNull();
  });

  test("displays additional languages", async () => {
    await waitFor(() => screen.getByTestId("languages"));
    const view = within(screen.getByTestId("languages"));
    expect(view.getByRole("spinbutton")).toHaveValue(1);

    const user = userEvent.setup();
    await user.click(view.getByRole("button", { name: /ajouter/i }));

    expect(view.getByText("Langue additionnelle")).not.toBeNull();
  });
});

describe("/edit/skills", () => {
  beforeEach(async () => {
    cleanup();
  });

  test("is not displayed", async () => {
    await renderWithData(<PageContent />);
    const content = within(document.querySelector("#content") as HTMLElement);
    expect(content.queryByRole("heading", { level: 2, name: "Caractéristiques" })).toBeNull();
    expect(content.queryByRole("heading", { level: 2, name: "Compétences" })).toBeNull();
  });

  const matrix = referential.classes.flatMap((klass) => referential.themes.map((theme) => ({ klass, theme })));
  test.each(matrix)(
    "displays the class skills based on theme $theme.id and class $klass.id",
    async ({ theme, klass }) => {
      const character = createCharacter().updateRace("androids").updateTheme(theme.id).updateClass(klass.id).character;
      await renderWithData(<PageContent />, character);

      for (const skill of [...klass.classSkills, ...theme.classSkills]) {
        const control = screen.queryByRole("checkbox", { name: skill + " - Compétence de classe" });
        expect(control).not.toBeNull();
        expect(control).toBeChecked();
        expect(control).toBeDisabled();
      }
    }
  );
});

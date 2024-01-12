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

  const classes = [
    {
      id: "operative",
      classSkills: [
        "Acrobaties (DEX)",
        "Athlétisme (FOR)",
        "Bluff (CHA)",
        "Culture (INT)",
        "Déguisement (CHA)",
        "Discrétion (DEX)",
        "Escamotage (DEX)",
        "Informatique (INT)",
        "Ingénierie (INT)",
        "Intimidation (CHA)",
        "Médecine (INT)",
        "Perception (SAG)",
        "Pilotage (DEX)",
        "Profession",
        "Psychologie (SAG)",
        "Survie (SAG)",
      ],
    },
    {
      id: "soldier",
      classSkills: [
        "Acrobaties (DEX)",
        "Athlétisme (FOR)",
        "Ingénierie (INT)",
        "Intimidation (CHA)",
        "Médecine (INT)",
        "Pilotage (DEX)",
        "Profession",
        "Survie (SAG)",
      ],
    },
  ];

  const themes = [
    {
      id: "bounty-hunter",
      classSkills: ["Survie (SAG)"],
    },
    {
      id: "scholar",
      classSkills: ["Science de la vie (INT)"],
    },
    {
      id: "themeless",
      classSkills: [],
    },
  ];

  const matrix = classes.flatMap((klass) => themes.map((theme) => ({ klass, theme })));
  test.each(matrix)(
    "displays the class skills based on theme '$theme.id' and class '$klass.id'",
    async ({ theme, klass }) => {
      const user = userEvent.setup();
      await user.click(screen.getByRole("button", { name: "Classe" }));
      await user.selectOptions(screen.getByRole("combobox", { name: "Classe" }), klass.id);
      await user.click(screen.getByRole("button", { name: "Thème" }));
      await user.selectOptions(screen.getByRole("combobox", { name: "Thème" }), theme.id);
      await user.click(screen.getByRole("button", { name: "Caractéristiques & Compétences" }));

      const content = within(document.querySelector("#content") as HTMLElement);

      for (const skill of [...klass.classSkills, ...theme.classSkills]) {
        expect(content.queryByRole("checkbox", { name: skill })).not.toBeNull();
        expect(content.getByRole("checkbox", { name: skill })).toBeChecked();
      }
    }
  );

  test("add +1 when the theme skill is already a class skill", async () => {
    const content = within(document.querySelector("#content") as HTMLElement);
    const view = within(content.getByTestId("surv"));
    expect(view.getByText("+1")).not.toBeNull();
  });
});

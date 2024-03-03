import * as fs from "node:fs/promises";
import {
  AbilityScore,
  Alignment,
  Armor,
  Avatar,
  Book,
  Class,
  ClassEnvoy,
  ClassOperative,
  ClassSoldier,
  FeatTemplate,
  IModel,
  Profession,
  Race,
  SavingThrow,
  SkillDefinition,
  Theme,
  ThemeScholar,
  Weapon,
} from "model";
import { describe, expect, test } from "vitest";

const datasets = [
  {
    file: "ability-scores.json",
    array: true,
    schema: AbilityScore.strict(),
  },
  {
    file: "alignments.json",
    array: true,
    schema: Alignment.strict(),
  },
  {
    file: "armors.json",
    array: true,
    schema: Armor.strict(),
  },
  {
    file: "books.json",
    array: true,
    schema: Book.strict(),
  },
  {
    file: "avatars.json",
    array: true,
    schema: Avatar.strict(),
  },
  {
    file: "class-envoy.json",
    array: false,
    schema: ClassEnvoy.strict(),
  },
  {
    file: "class-operative.json",
    array: false,
    schema: ClassOperative.strict(),
  },
  {
    file: "class-soldier.json",
    array: false,
    schema: ClassSoldier.strict(),
  },
  {
    file: "classes.json",
    array: true,
    schema: Class.strict(),
  },
  {
    file: "feats.json",
    array: true,
    schema: FeatTemplate,
  },
  {
    file: "professions.json",
    array: true,
    schema: Profession.strict(),
  },
  {
    file: "races.json",
    array: true,
    schema: Race.strict(),
  },
  {
    file: "saving-throws.json",
    array: true,
    schema: SavingThrow.strict(),
  },
  {
    file: "skills.json",
    array: true,
    schema: SkillDefinition.strict(),
  },
  {
    file: "themes-details.json",
    array: true,
    schema: ThemeScholar.strict(),
  },
  {
    file: "themes.json",
    array: true,
    schema: Theme.strict(),
  },
  {
    file: "weapons.json",
    array: true,
    schema: Weapon.strict(),
  },
];

describe.each(datasets)("$file", (dataset) => {
  test("exists", async () => {
    expect(await fs.readFile("mocks/" + dataset.file, "utf-8")).not.toBeNull();
  });

  test("can be read", async () => {
    const raw = await fs.readFile("mocks/" + dataset.file, "utf-8");
    expect(() => JSON.parse(raw)).not.toThrow();
  });

  test("can be mapped to its model type", async () => {
    const raw = await fs.readFile("mocks/" + dataset.file, "utf-8");
    const data = JSON.parse(raw);

    if (dataset.array && data instanceof Array) {
      for (const element of data) {
        expect(() => IModel.parse(element)).not.toThrow();
        expect(() => dataset.schema.parse(element)).not.toThrow();
      }
    } else {
      expect(() => dataset.schema.parse(data)).not.toThrow();
    }
  });
});

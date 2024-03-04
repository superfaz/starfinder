import * as fs from "node:fs/promises";
import {
  AbilityScoreSchema,
  AlignmentSchema,
  ArmorTypeSchema,
  AvatarSchema,
  BookSchema,
  ClassSchema,
  ClassEnvoySchema,
  ClassOperativeSchema,
  ClassSoldierSchema,
  FeatTemplateSchema,
  IModelSchema,
  ProfessionSchema,
  RaceSchema,
  SavingThrowSchema,
  SkillDefinitionSchema,
  ThemeSchema,
  ThemeScholarSchema,
  WeaponTypeSchema,
} from "model";
import { describe, expect, test } from "vitest";

const datasets = [
  {
    file: "ability-scores.json",
    array: true,
    schema: AbilityScoreSchema.strict(),
  },
  {
    file: "alignments.json",
    array: true,
    schema: AlignmentSchema.strict(),
  },
  {
    file: "armors.json",
    array: true,
    schema: ArmorTypeSchema.strict(),
  },
  {
    file: "books.json",
    array: true,
    schema: BookSchema.strict(),
  },
  {
    file: "avatars.json",
    array: true,
    schema: AvatarSchema.strict(),
  },
  {
    file: "class-envoy.json",
    array: false,
    schema: ClassEnvoySchema.strict(),
  },
  {
    file: "class-operative.json",
    array: false,
    schema: ClassOperativeSchema.strict(),
  },
  {
    file: "class-soldier.json",
    array: false,
    schema: ClassSoldierSchema.strict(),
  },
  {
    file: "classes.json",
    array: true,
    schema: ClassSchema.strict(),
  },
  {
    file: "feats.json",
    array: true,
    schema: FeatTemplateSchema,
  },
  {
    file: "professions.json",
    array: true,
    schema: ProfessionSchema.strict(),
  },
  {
    file: "races.json",
    array: true,
    schema: RaceSchema.strict(),
  },
  {
    file: "saving-throws.json",
    array: true,
    schema: SavingThrowSchema.strict(),
  },
  {
    file: "skills.json",
    array: true,
    schema: SkillDefinitionSchema.strict(),
  },
  {
    file: "themes-details.json",
    array: true,
    schema: ThemeScholarSchema.strict(),
  },
  {
    file: "themes.json",
    array: true,
    schema: ThemeSchema.strict(),
  },
  {
    file: "weapons.json",
    array: true,
    schema: WeaponTypeSchema.strict(),
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
        expect(() => IModelSchema.parse(element)).not.toThrow();
        expect(() => dataset.schema.parse(element)).not.toThrow();
      }
    } else {
      expect(() => dataset.schema.parse(data)).not.toThrow();
    }
  });
});

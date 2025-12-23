import * as fs from "node:fs/promises";
import {
  AbilityScoreSchema,
  AlignmentSchema,
  ArmorTypeSchema,
  AvatarSchema,
  BookSchema,
  ClassSchema,
  FeatTemplateSchema,
  IModelSchema,
  ProfessionSchema,
  OriginSchema,
  SavingThrowSchema,
  SkillDefinitionSchema,
  ThemeSchema,
  ThemeScholarSchema,
  WeaponTypeSchema,
  CriticalHitEffectSchema,
  DamageTypeSchema,
  EquipmentWeaponMeleeSchema,
  EquipmentWeaponAmmunitionSchema,
  EquipmentWeaponGrenadeSchema,
  EquipmentWeaponRangedSchema,
  EquipmentWeaponSolarianSchema,
  EquipmentArmorHeavySchema,
  EquipmentArmorLightSchema,
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
    file: "armor-types.json",
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
    file: "classes.json",
    array: true,
    schema: ClassSchema.strict(),
  },
  {
    file: "critical-hit-effects.json",
    array: true,
    schema: CriticalHitEffectSchema.strict(),
  },
  {
    file: "damage-types.json",
    array: true,
    schema: DamageTypeSchema.strict(),
  },
  {
    file: "equipment-armors-heavy.json",
    array: true,
    schema: EquipmentArmorHeavySchema.strict(),
  },
  {
    file: "equipment-armors-light.json",
    array: true,
    schema: EquipmentArmorLightSchema.strict(),
  },
  {
    file: "equipment-weapons-advanced.json",
    array: true,
    schema: EquipmentWeaponMeleeSchema.strict(),
  },
  {
    file: "equipment-weapons-ammunition.json",
    array: true,
    schema: EquipmentWeaponAmmunitionSchema.strict(),
  },
  {
    file: "equipment-weapons-basic.json",
    array: true,
    schema: EquipmentWeaponMeleeSchema.strict(),
  },
  {
    file: "equipment-weapons-grenade.json",
    array: true,
    schema: EquipmentWeaponGrenadeSchema.strict(),
  },
  {
    file: "equipment-weapons-heavy.json",
    array: true,
    schema: EquipmentWeaponRangedSchema.strict(),
  },
  {
    file: "equipment-weapons-long.json",
    array: true,
    schema: EquipmentWeaponRangedSchema.strict(),
  },
  {
    file: "equipment-weapons-small.json",
    array: true,
    schema: EquipmentWeaponRangedSchema.strict(),
  },
  {
    file: "equipment-weapons-sniper.json",
    array: true,
    schema: EquipmentWeaponRangedSchema.strict(),
  },
  {
    file: "equipment-weapons-solarian.json",
    array: true,
    schema: EquipmentWeaponSolarianSchema.strict(),
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
    schema: OriginSchema.strict(),
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
    file: "weapon-types.json",
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
        expect(() => IModelSchema.parse(element), element.id).not.toThrow();
        expect(() => dataset.schema.parse(element), element.id).not.toThrow();
      }
    } else {
      expect(() => dataset.schema.parse(data)).not.toThrow();
    }
  });
});

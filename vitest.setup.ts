import { beforeAll, vi } from "vitest";
import { DataSetBuilder, IDataSet } from "data";
import {
  AbilityScoreSchema,
  AlignmentSchema,
  ArmorTypeSchema,
  AvatarSchema,
  BookSchema,
  ClassSchema,
  CriticalHitEffectSchema,
  DamageTypeSchema,
  EquipmentWeaponMeleeSchema,
  FeatTemplateSchema,
  ProfessionSchema,
  RaceSchema,
  SavingThrowSchema,
  SkillDefinitionSchema,
  SpellSchema,
  ThemeSchema,
  ThemeScholarSchema,
  WeaponCategorySchema,
  WeaponSpecialPropertySchema,
  WeaponTypeSchema,
} from "model";
import { addFetchMock, mockFetch } from "./mocks/fetch";
import envoyDetails from "./mocks/class-envoy.json";
import operativeDetails from "./mocks/class-operative.json";
import scholarDetails from "./mocks/themes-details.json";
import soldierDetails from "./mocks/class-soldier.json";
import equipmentWeaponMelee from "./mocks/equipment-weapon-melee.json";

import "@testing-library/jest-dom/vitest";

process.env.STARFINDER_COSMOS_ENDPOINT = "https://localhost:8081";
process.env.STARFINDER_COSMOS_KEY =
  "C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==";
process.env.STARFINDER_COSMOS_DATABASE = "starfinder";

async function mockBuild(): Promise<IDataSet> {
  return {
    getAbilityScores: async () =>
      AbilityScoreSchema.array().parse((await import("./mocks/ability-scores.json")).default),
    getAlignments: async () => AlignmentSchema.array().parse((await import("./mocks/alignments.json")).default),
    getArmorTypes: async () => ArmorTypeSchema.array().parse((await import("./mocks/armor-types.json")).default),
    getBooks: async () => BookSchema.array().parse((await import("./mocks/books.json")).default),
    getAvatars: async () => AvatarSchema.array().parse((await import("./mocks/avatars.json")).default),
    getClasses: async () => ClassSchema.array().parse((await import("./mocks/classes.json")).default),
    getClassDetails: async (classId) => (await import(`./mocks/class-${classId}.json`)).default,
    getCriticalHitEffects: async () =>
      CriticalHitEffectSchema.array().parse((await import("./mocks/critical-hit-effects.json")).default),
    getDamageTypes: async () => DamageTypeSchema.array().parse((await import("./mocks/damage-types.json")).default),
    getEquipmentWeaponMelee: async () =>
      EquipmentWeaponMeleeSchema.array().parse((await import("./mocks/equipment-weapon-melee.json")).default),
    getFeats: async () => FeatTemplateSchema.array().parse((await import("./mocks/feats.json")).default),
    getProfessions: async () => ProfessionSchema.array().parse((await import("./mocks/professions.json")).default),
    getRaces: async () => RaceSchema.array().parse((await import("./mocks/races.json")).default),
    getSpells: async () => SpellSchema.array().parse((await import("./mocks/spells.json")).default),
    getThemes: async () => ThemeSchema.array().parse((await import("./mocks/themes.json")).default),
    getThemeDetails: async () => ThemeScholarSchema.parse((await import("./mocks/themes-details.json")).default),
    getSavingThrows: async () => SavingThrowSchema.array().parse((await import("./mocks/saving-throws.json")).default),
    getSkills: async () => SkillDefinitionSchema.array().parse((await import("./mocks/skills.json")).default),
    getWeaponCategories: async () =>
      WeaponCategorySchema.array().parse((await import("./mocks/weapon-categories.json")).default),
    getWeaponSpecialProperties: async () =>
      WeaponSpecialPropertySchema.array().parse((await import("./mocks/weapon-special-properties.json")).default),
    getWeaponTypes: async () => WeaponTypeSchema.array().parse((await import("./mocks/weapon-types.json")).default),
  };
}

beforeAll(() => {
  vi.spyOn(DataSetBuilder.prototype, "build").mockImplementation(mockBuild);

  vi.stubGlobal("fetch", mockFetch);
  addFetchMock("/api/classes/envoy/details", envoyDetails);
  addFetchMock("/api/classes/operative/details", operativeDetails);
  addFetchMock("/api/classes/soldier/details", soldierDetails);
  addFetchMock("/api/equipments/weapon/basic", equipmentWeaponMelee);
  addFetchMock("/api/themes/scholar", scholarDetails);
});

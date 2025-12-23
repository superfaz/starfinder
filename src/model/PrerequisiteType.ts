import { z } from "zod";

export const PrerequisiteTypeSchema = z.enum([
  "abilityScore",
  "armorProficiency",
  "arms",
  "baseAttack",
  "class",
  "combatFeatCount",
  "feat",
  "level",
  "savingThrow",
  "skillRank",
  "spellCaster",
  "notSpellCaster",
  "spellCasterLevel",
  "weaponProficiency",
]);

export type PrerequisiteType = z.infer<typeof PrerequisiteTypeSchema>;

export const PrerequisiteTypes = PrerequisiteTypeSchema.enum;

export function isPrerequisiteType(value: unknown): value is PrerequisiteType {
  return PrerequisiteTypeSchema.safeParse(value).success;
}

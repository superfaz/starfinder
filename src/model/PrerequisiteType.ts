import { z } from "zod";

export const PrerequisiteType = z.enum([
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

export type PrerequisiteType = z.infer<typeof PrerequisiteType>;

export const PrerequisiteTypes = PrerequisiteType.enum;

export function isPrerequisiteType(value: unknown): value is PrerequisiteType {
  return PrerequisiteType.safeParse(value).success;
}

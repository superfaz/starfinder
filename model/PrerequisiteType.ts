import { z } from "zod";

export const PrerequisiteType = z.enum([
  "abilityScore",
  "arms",
  "baseAttack",
  "class",
  "combatFeatCount",
  "feat",
  "level",
  "savingThrow",
  "skillRank",
  "spellCasterLevel",
  "weaponProficiency",
]);

export type PrerequisiteType = z.infer<typeof PrerequisiteType>;

export function isPrerequisiteType(value: unknown): value is PrerequisiteType {
  return PrerequisiteType.safeParse(value).success;
}

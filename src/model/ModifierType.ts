import { z } from "zod";

export const ModifierTypeSchema = z.enum([
  "ability",
  "armorCheckPenalty",
  "armorClass",
  "armorSpeedAdjustment",
  "attack",
  "armorProficiency",
  "bodyParts",
  "classSkill",
  "damage",
  "damageReduction",
  "equipment",
  "featCount",
  "feat",
  "hitPoints",
  "initiative",
  "languageCount",
  "rank",
  "rankSkill",
  "resistance",
  "resolve",
  "savingThrow",
  "savingThrowBonus",
  "size",
  "skill",
  "skillTrained",
  "speed",
  "spell",
  "stamina",
  "weaponProficiency",
]);

export type ModifierType = z.infer<typeof ModifierTypeSchema>;

export const ModifierTypes = ModifierTypeSchema.enum;

export function isModifierType(value: unknown): value is ModifierType {
  return ModifierTypeSchema.safeParse(value).success;
}

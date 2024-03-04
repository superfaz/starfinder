import { z } from "zod";

export const ModifierTypeSchema = z.enum([
  "ability",
  "attack",
  "armorProficiency",
  "classSkill",
  "featCount",
  "feat",
  "hitPoints",
  "initiative",
  "languageCount",
  "rank",
  "rankSkill",
  "resolve",
  "savingThrow",
  "savingThrowBonus",
  "skill",
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

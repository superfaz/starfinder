import { z } from "zod";

export const ModifierType = z.enum([
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

export type ModifierType = z.infer<typeof ModifierType>;

export const ModifierTypes = ModifierType.enum;

export function isModifierType(value: unknown): value is ModifierType {
  return ModifierType.safeParse(value).success;
}

import { z } from "zod";

export const ModifierType = z.enum([
  "ability",
  "classSkill",
  "featCount",
  "feat",
  "hitPoints",
  "initiative",
  "languageCount",
  "rank",
  "rankSkill",
  "savingThrow",
  "skill",
  "speed",
  "spell",
]);

export type ModifierType = z.infer<typeof ModifierType>;

export function isModifierType(value: unknown): value is ModifierType {
  return ModifierType.safeParse(value).success;
}

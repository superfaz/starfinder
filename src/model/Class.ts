import { z } from "zod";
import { VariableSchema } from "./helper";
import { AbilityScoreIdSchema } from "./AbilityScore";
import { ArmorTypeIdSchema } from "./ArmorType";
import { ClassSkillModifierSchema, WeaponProficiencyModifierSchema } from "./Modifier";
import { IEntrySchema } from "./IEntry";

const ClassModifierSchema = z.discriminatedUnion("type", [ClassSkillModifierSchema, WeaponProficiencyModifierSchema]);

export const ClassSchema = IEntrySchema.extend({
  hitPoints: z.number(),
  staminaPoints: z.number(),
  primaryAbilityScore: z.union([AbilityScoreIdSchema, VariableSchema]),
  secondaryAbilityScores: z.array(AbilityScoreIdSchema),
  spellCaster: z.boolean().default(false),
  skillRank: z.number(),
  modifiers: z.array(ClassModifierSchema),
  armors: z.array(ArmorTypeIdSchema),
  baseAttack: z.enum(["low", "high"]),
  savingThrows: z.object({
    fortitude: z.enum(["low", "high"]),
    reflex: z.enum(["low", "high"]),
    will: z.enum(["low", "high"]),
  }),
});

export type Class = z.infer<typeof ClassSchema>;

export function isClass(data: unknown): data is Class {
  return ClassSchema.safeParse(data).success;
}

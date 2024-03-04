import { z } from "zod";
import { INamedModelSchema } from "./INamedModel";
import { DescriptionSchema, ReferenceSchema, VariableSchema } from "./helper";
import { AbilityScoreIdSchema } from "./AbilityScore";
import { ArmorIdSchema } from "./Armor";
import { WeaponIdSchema } from "./Weapon";

export const ClassSchema = INamedModelSchema.extend({
  description: DescriptionSchema,
  reference: ReferenceSchema,
  hitPoints: z.number(),
  staminaPoints: z.number(),
  primaryAbilityScore: z.union([AbilityScoreIdSchema, VariableSchema]),
  secondaryAbilityScores: z.array(AbilityScoreIdSchema),
  spellCaster: z.boolean().default(false),
  skillRank: z.number(),
  classSkills: z.array(z.string()),
  armors: z.array(ArmorIdSchema),
  weapons: z.array(WeaponIdSchema),
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

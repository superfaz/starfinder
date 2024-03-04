import { z } from "zod";
import { INamedModel } from "./INamedModel";
import { Description, Reference, Variable } from "./helper";
import { AbilityScoreIdSchema } from "./AbilityScore";
import { ArmorId } from "./Armor";
import { WeaponId } from "./Weapon";

export const Class = INamedModel.extend({
  description: Description,
  reference: Reference,
  hitPoints: z.number(),
  staminaPoints: z.number(),
  primaryAbilityScore: z.union([AbilityScoreIdSchema, Variable]),
  secondaryAbilityScores: z.array(AbilityScoreIdSchema),
  spellCaster: z.boolean().default(false),
  skillRank: z.number(),
  classSkills: z.array(z.string()),
  armors: z.array(ArmorId),
  weapons: z.array(WeaponId),
  baseAttack: z.enum(["low", "high"]),
  savingThrows: z.object({
    fortitude: z.enum(["low", "high"]),
    reflex: z.enum(["low", "high"]),
    will: z.enum(["low", "high"]),
  }),
});

export type Class = z.infer<typeof Class>;

export function isClass(data: unknown): data is Class {
  return Class.safeParse(data).success;
}

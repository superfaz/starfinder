import { z } from "zod";
import { INamedModel } from "./INamedModel";

export const Class = INamedModel.extend({
  description: z.string(),
  refs: z.array(z.string()),
  hitPoints: z.number(),
  staminaPoints: z.number(),
  primaryAbilityScore: z.string(),
  secondaryAbilityScores: z.array(z.string()),
  skillRank: z.number(),
  classSkills: z.array(z.string()),
  armors: z.array(z.string()),
  weapons: z.array(z.string()),
}).strict();

export type Class = z.infer<typeof Class>;

export function isClass(data: unknown): data is Class {
  return Class.safeParse(data).success;
}

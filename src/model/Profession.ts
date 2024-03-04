import { z } from "zod";
import { AbilityScoreIdSchema } from "./AbilityScore";
import { INamedModelSchema } from "./INamedModel";

export const Profession = INamedModelSchema.extend({
  abilityScore: AbilityScoreIdSchema,
});

export type Profession = z.infer<typeof Profession>;

export function isProfession(obj: unknown): obj is Profession {
  return Profession.safeParse(obj).success;
}

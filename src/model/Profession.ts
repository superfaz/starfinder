import type { z } from "zod";
import { AbilityScoreIdSchema } from "./AbilityScore";
import { INamedModelSchema } from "./INamedModel";

export const ProfessionSchema = INamedModelSchema.extend({
  abilityScore: AbilityScoreIdSchema,
});

export type Profession = z.infer<typeof ProfessionSchema>;

export function isProfession(obj: unknown): obj is Profession {
  return ProfessionSchema.safeParse(obj).success;
}

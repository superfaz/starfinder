import { z } from "zod";
import { AbilityScoreIdSchema } from "./AbilityScore";
import { INamedModel } from "./INamedModel";
import { Description } from "./helper";

export const Variant = INamedModel.extend({
  description: z.optional(Description),
  abilityScores: z.record(AbilityScoreIdSchema, z.number()),
});

export type Variant = z.infer<typeof Variant>;

export function isVariant(obj: unknown): obj is Variant {
  return Variant.safeParse(obj).success;
}

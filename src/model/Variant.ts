import { z } from "zod";
import { AbilityScoreIdSchema } from "./AbilityScore";
import { INamedModelSchema } from "./INamedModel";
import { DescriptionSchema } from "./helper";

export const VariantSchema = INamedModelSchema.extend({
  description: z.optional(DescriptionSchema),
  abilityScores: z.record(AbilityScoreIdSchema, z.number()),
});

export type Variant = z.infer<typeof VariantSchema>;

export function isVariant(obj: unknown): obj is Variant {
  return VariantSchema.safeParse(obj).success;
}

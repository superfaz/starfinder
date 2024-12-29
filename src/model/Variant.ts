import { z } from "zod";
import { AbilityScoreIdSchema } from "./AbilityScore";
import { IEntrySchema } from "./IEntry";

export const VariantSchema = IEntrySchema.extend({
  abilityScores: z.record(AbilityScoreIdSchema, z.number()),
});

export type Variant = z.infer<typeof VariantSchema>;

export function isVariant(obj: unknown): obj is Variant {
  return VariantSchema.safeParse(obj).success;
}

import { z } from "zod";
import { FeatureTemplateSchema } from "./FeatureTemplate";
import { DescriptionSchema, IdSchema, ReferenceSchema } from "./helper";
import { INamedModelSchema } from "./INamedModel";
import { HitPointsModifierSchema, SizeModifierSchema } from "./Modifier";
import { VariantSchema } from "./Variant";

export const RaceModifierSchema = z.discriminatedUnion("type", [HitPointsModifierSchema, SizeModifierSchema]);

export type RaceModifier = z.infer<typeof RaceModifierSchema>;

export const RaceSchema = INamedModelSchema.extend({
  description: DescriptionSchema,
  reference: ReferenceSchema,
  modifiers: z.array(RaceModifierSchema),
  variants: z.array(VariantSchema),
  names: z.array(z.string()),
  language: z.optional(IdSchema),
  traits: z.array(FeatureTemplateSchema),
  secondaryTraits: z.array(FeatureTemplateSchema),
});

export type Race = z.infer<typeof RaceSchema>;

export function isRace(obj: unknown): obj is Race {
  return RaceSchema.safeParse(obj).success;
}

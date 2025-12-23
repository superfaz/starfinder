import { z } from "zod";
import { FeatureTemplateSchema } from "./FeatureTemplate";
import { BodyPartModifierSchema, HitPointsModifierSchema, SizeModifierSchema } from "./Modifier";
import { VariantSchema } from "./Variant";
import { IEntrySchema } from "./IEntry";
import { IdSchema } from "./helper";

export const OriginModifierSchema = z.discriminatedUnion("type", [
  BodyPartModifierSchema,
  HitPointsModifierSchema,
  SizeModifierSchema,
]);

export type RaceModifier = z.infer<typeof OriginModifierSchema>;

export const OriginSchema = IEntrySchema.extend({
  category: z.enum(["core", "legacy", "other"]),
  modifiers: z.array(OriginModifierSchema),
  variants: z.array(VariantSchema),
  names: z.array(z.string()),
  language: z.optional(IdSchema),
  traits: z.array(FeatureTemplateSchema),
  secondaryTraits: z.array(FeatureTemplateSchema),
});

export type Origin = z.infer<typeof OriginSchema>;

export function isOrigin(obj: unknown): obj is Origin {
  return OriginSchema.safeParse(obj).success;
}

import { z } from "zod";
import { FeatureTemplateSchema } from "./FeatureTemplate";
import { BodyPartModifierSchema, HitPointsModifierSchema, SizeModifierSchema } from "./Modifier";
import { VariantSchema } from "./Variant";
import { IEntrySchema } from "./IEntry";
import { IdSchema } from "./helper";

export const RaceModifierSchema = z.discriminatedUnion("type", [
  BodyPartModifierSchema,
  HitPointsModifierSchema,
  SizeModifierSchema,
]);

export type RaceModifier = z.infer<typeof RaceModifierSchema>;

export const IRaceEntrySchema = IEntrySchema.extend({
  category: z.enum(["core", "legacy", "other"]),
});

export type IRaceEntry = z.infer<typeof IRaceEntrySchema>;

export const RaceSchema = IRaceEntrySchema.extend({
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

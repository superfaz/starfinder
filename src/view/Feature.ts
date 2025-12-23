import { z } from "zod";
import { DescriptionSchema, EvolutionsSchema, FeatureCategorySchema, INamedModelSchema, ModifierSchema } from "model";

const BaseFeatureSchema = INamedModelSchema.extend({
  description: z.optional(DescriptionSchema),
  modifiers: z.array(ModifierSchema),
  level: z.number(),
  category: z.optional(FeatureCategorySchema),
});

export const OriginFeatureSchema = BaseFeatureSchema.extend({
  source: z.literal("origin"),

  /**
   * The IDs and names of the replaced origin traits - for secondary origin traits.
   */
  replace: z.array(INamedModelSchema),
}).strict();

export type OriginFeature = z.infer<typeof OriginFeatureSchema>;

export const ThemeFeatureSchema = BaseFeatureSchema.extend({
  source: z.literal("theme"),
}).strict();

export type ThemeFeature = z.infer<typeof ThemeFeatureSchema>;

export const ClassFeatureSchema = BaseFeatureSchema.extend({
  source: z.literal("class"),

  /**
   * The evolutions of the feature, indexed by level - for class features.
   */
  evolutions: EvolutionsSchema,
}).strict();

export type ClassFeature = z.infer<typeof ClassFeatureSchema>;

export const DroneFeatureSchema = BaseFeatureSchema.extend({
  source: z.literal("drone"),
});

export type DroneFeature = z.infer<typeof DroneFeatureSchema>;

/**
 * Represents a racial trait as well as a thematic or a class feature that can be applied to a character.
 */
export const FeatureSchema = z.discriminatedUnion("source", [
  OriginFeatureSchema,
  ThemeFeatureSchema,
  ClassFeatureSchema,
]);

export type Feature = z.infer<typeof FeatureSchema>;

export function isFeature(data: unknown): data is Feature {
  return FeatureSchema.safeParse(data).success;
}

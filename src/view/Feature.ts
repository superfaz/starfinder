import { z } from "zod";
import { DescriptionSchema, EvolutionsSchema, FeatureCategorySchema, INamedModelSchema, ModifierSchema } from "model";

const BaseFeatureSchema = INamedModelSchema.extend({
  description: z.optional(DescriptionSchema),
  modifiers: z.array(ModifierSchema),
  level: z.number(),
  category: z.optional(FeatureCategorySchema),
});

export const RaceFeatureSchema = BaseFeatureSchema.extend({
  source: z.literal("race"),

  /**
   * The IDs of the replaced racial traits - for secondary racial traits.
   */
  replace: z.array(z.string()),
}).strict();

export type RaceFeature = z.infer<typeof RaceFeatureSchema>;

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
  RaceFeatureSchema,
  ThemeFeatureSchema,
  ClassFeatureSchema,
]);

export type Feature = z.infer<typeof FeatureSchema>;

export function isFeature(data: unknown): data is Feature {
  return FeatureSchema.safeParse(data).success;
}

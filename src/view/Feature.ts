import { z } from "zod";
import { Description, Evolutions, FeatureCategory, INamedModel } from "model";
import { Modifier } from "./Modifier";

const BaseFeature = INamedModel.extend({
  description: z.optional(Description),
  modifiers: z.array(Modifier),
  level: z.number(),
  category: z.optional(FeatureCategory),
});

export const RaceFeature = BaseFeature.extend({
  source: z.literal("race"),

  /**
   * The IDs of the replaced racial traits - for secondary racial traits.
   */
  replace: z.array(z.string()),
}).strict();

export type RaceFeature = z.infer<typeof RaceFeature>;

export const ThemeFeature = BaseFeature.extend({
  source: z.literal("theme"),
}).strict();

export type ThemeFeature = z.infer<typeof ThemeFeature>;

export const ClassFeature = BaseFeature.extend({
  source: z.literal("class"),

  /**
   * The evolutions of the feature, indexed by level - for class features.
   */
  evolutions: Evolutions,
}).strict();

export type ClassFeature = z.infer<typeof ClassFeature>;

/**
 * Represents a racial trait as well as a thematic or a class feature that can be applied to a character.
 */
export const Feature = z.discriminatedUnion("source", [RaceFeature, ThemeFeature, ClassFeature]);

export type Feature = z.infer<typeof Feature>;

export function isFeature(data: unknown): data is Feature {
  return Feature.safeParse(data).success;
}

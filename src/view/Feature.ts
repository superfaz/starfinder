import { z } from "zod";
import { Description, Evolutions, FeatureCategory, INamedModel } from "model";
import { Modifier } from "./Modifier";

/**
 * Represents a racial trait as well as a thematic or a class feature that can be applied to a character.
 */
export const Feature = INamedModel.extend({
  description: z.optional(Description),
  modifiers: z.array(Modifier),
  level: z.number(),
  category: z.optional(FeatureCategory),

  /**
   * The evolutions of the feature, indexed by level - for class features.
   */
  evolutions: Evolutions,

  /**
   * The IDs of the replaced racial traits - for secondary racial traits.
   */
  replace: z.array(z.string()),
});

export const FeatureCategories = FeatureCategory.enum;

export type Feature = z.infer<typeof Feature>;

export function isFeature(data: unknown): data is Feature {
  return Feature.safeParse(data).success;
}
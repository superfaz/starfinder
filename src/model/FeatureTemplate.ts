import { z } from "zod";
import { INamedModel } from "./INamedModel";
import { ModifierTemplate } from "./ModifierTemplate";
import { Description, Evolutions } from "./helper";

export const FeatureCategorySchema = z.enum(["ex", "ma", "su"]);

export type FeatureCategory = z.infer<typeof FeatureCategorySchema>;

export const FeatureCategories = FeatureCategorySchema.enum;

/**
 * Represents a racial trait or a thematic or a class feature that can be applied to a character.
 */
export const FeatureTemplateSchema = INamedModel.extend({
  description: z.optional(Description),
  modifiers: z.optional(z.array(ModifierTemplate)),
  level: z.number(),

  /**
   * The type of feature.
   */
  category: z.optional(FeatureCategorySchema),

  /**
   * The evolutions of the feature, indexed by level - for class features.
   */
  evolutions: z.optional(Evolutions),

  /**
   * The IDs of the replaced racial traits - for secondary racial traits.
   */
  replace: z.optional(z.array(z.string())),
}).strict();

export type FeatureTemplate = z.infer<typeof FeatureTemplateSchema>;

export function isFeatureTemplate(data: unknown): data is FeatureTemplate {
  return FeatureTemplateSchema.safeParse(data).success;
}

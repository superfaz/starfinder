import { z } from "zod";
import { INamedModel } from "./INamedModel";
import { Modifier } from "./Modifier";

/**
 * Represents a racial trait as well as a thematic or a class feature that can be applied to a character.
 */
export const Feature = INamedModel.extend({
  description: z.optional(z.string()),
  modifiers: z.array(Modifier),
  level: z.number(),
  category: z.optional(z.string()), //TODO: z.enum(["ex", "ma", "su"]),

  /**
   * The evolutions of the feature, indexed by level - for class features.
   */
  evolutions: z.record(z.record(z.union([z.string(), z.number()]))),

  /**
   * The IDs of the replaced racial traits - for secondary racial traits.
   */
  replace: z.array(z.string()),
});

export type Feature = z.infer<typeof Feature>;

export function isFeature(data: unknown): data is Feature {
  return Feature.safeParse(data).success;
}

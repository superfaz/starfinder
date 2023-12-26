import { IModel, ModifierTemplate } from ".";

/**
 * Represents a racial trait or a thematic or a class feature that can be applied to a character.
 */
export interface FeatureTemplate extends IModel {
  id: string;
  name: string;
  description?: string;
  modifiers?: ModifierTemplate[];
  level: number;

  /**
   * The type of feature.
   *
   * @example "ex", "ma", "su"
   */
  category?: string;

  /**
   * The evolutions of the feature, indexed by level - for class features.
   */
  evolutions?: Record<string, Record<string, string | number | null | undefined> | null | undefined>;

  /**
   * The IDs of the replaced racial traits - for secondary racial traits.
   */
  replace?: string[];
}

import { IModel, Modifier } from ".";

/**
 * Represents a racial trait as well as a thematic or a class feature that can be applied to a character.
 */
export interface Feature extends IModel {
  id: string;
  name: string;
  description?: string;
  modifiers: Modifier[];
  level: number;
  category?: "ex" | "ma" | "su";

  /**
   * The evolutions of the feature, indexed by level - for class features.
   */
  evolutions: Record<string, Record<string, string | number>>;

  /**
   * The IDs of the replaced racial traits - for secondary racial traits.
   */
  replace: string[];
}

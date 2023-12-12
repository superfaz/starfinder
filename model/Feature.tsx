import { ModifierTemplate } from ".";

/**
 * Represents a racial trait as well as a thematic or a class feature that can be applied to a character.
 */
export interface Feature {
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

  evolutions?: Record<string, Record<string, string | number | null | undefined> | null | undefined>;
}

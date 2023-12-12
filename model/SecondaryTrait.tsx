import { Feature } from ".";

/**
 * Represents a secondary racial trait and provides the replaced racial traits when selected.
 */
export interface SecondaryTrait extends Feature {
  /**
   * The IDs of the replaced racial traits.
   */
  replace: string[];
}

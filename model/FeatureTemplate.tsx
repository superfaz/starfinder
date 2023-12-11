import { Trait } from ".";

export interface FeatureTemplate extends Trait {
  level: number;

  /**
   * The type of feature.
   *
   * @example "ex", "ma", "su"
   */
  category?: string;

  evolutions?: Record<string, Record<string, string | number | null | undefined> | null | undefined>;
}

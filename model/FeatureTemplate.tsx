import { Trait } from ".";

export interface FeatureTemplate extends Trait {
  level: number;
  category?: "ex" | "ma" | "su";
  evolutions?: Record<string, Record<string, string | number | null>>;
}

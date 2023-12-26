import { FeatureTemplate, Variant } from ".";

export interface Race {
  id: string;
  name: string;
  description: string;
  refs: string[];
  hitPoints: number;
  variants: Variant[];
  names: string[];
  traits: FeatureTemplate[];
  secondaryTraits: FeatureTemplate[];
}

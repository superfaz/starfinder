import { FeatureTemplate, IModel, Variant } from ".";

export interface Race extends IModel {
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

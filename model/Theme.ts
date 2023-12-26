import { FeatureTemplate, IModel } from ".";

export interface Theme extends IModel {
  id: string;
  name: string;
  description: string;
  refs: string[];
  abilityScores: Record<string, number | undefined>;
  features: FeatureTemplate[];
}

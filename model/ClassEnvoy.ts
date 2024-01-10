import { FeatureTemplate, IModel } from ".";

export interface ClassEnvoy extends IModel {
  id: string;
  features: FeatureTemplate[];
}

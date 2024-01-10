import { FeatureTemplate, IModel, NamedModel } from ".";

export interface ClassOperativeSpecialization extends NamedModel {
  description: string;
  variables: Record<string, string | number>;
  features: FeatureTemplate[];
}

export interface ClassOperative extends IModel {
  id: string;
  specializations: ClassOperativeSpecialization[];
  features: FeatureTemplate[];
}

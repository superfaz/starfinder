import { FeatureTemplate, NamedModel } from ".";

export interface ClassOperativeSpecialization extends NamedModel {
  description: string;
  variables: Record<string, string | number>;
  features: FeatureTemplate[];
}

export interface ClassOperative {
  specializations: ClassOperativeSpecialization[];
  features: FeatureTemplate[];
}

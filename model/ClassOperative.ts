import { FeatureTemplate } from "./FeatureTemplate";
import { IModel } from "./IModel";
import { INamedModel } from "./INamedModel";

export interface ClassOperativeSpecialization extends INamedModel {
  description: string;
  variables: Record<string, string | number>;
  features: FeatureTemplate[];
}

export interface ClassOperative extends IModel {
  id: string;
  specializations: ClassOperativeSpecialization[];
  features: FeatureTemplate[];
}

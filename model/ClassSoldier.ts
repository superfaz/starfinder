import { FeatureTemplate } from "./FeatureTemplate";
import { IModel } from "./IModel";
import { INamedModel } from "./INamedModel";

export interface ClassSoldierStyle extends INamedModel {
  description: string;
  variables: Record<string, string | number>;
  features: FeatureTemplate[];
}

export interface ClassSoldier extends IModel {
  id: string;
  features: FeatureTemplate[];
  styles: ClassSoldierStyle[];
}

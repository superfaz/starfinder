import { FeatureTemplate, IModel, NamedModel } from ".";

export interface ClassSoldierStyle extends NamedModel {
  description: string;
  variables: Record<string, string | number>;
  features: FeatureTemplate[];
}

export interface ClassSoldier extends IModel {
  id: string;
  features: FeatureTemplate[];
  fightingStyles: ClassSoldierStyle[];
}

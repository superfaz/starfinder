import { IModel } from "./IModel";

export interface Variant extends IModel {
  id: string;
  name: string;
  description: string;
  abilityScores: Record<string, number | undefined>;
}

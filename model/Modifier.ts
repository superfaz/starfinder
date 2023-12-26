import { IModel, ModifierType } from ".";

export interface Modifier extends IModel {
  id: string;
  type: ModifierType;
  level?: number;
  name?: string;
  description?: string;
  target?: string;
  value?: number;
}

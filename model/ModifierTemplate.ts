import { IModel, ModifierType } from ".";

export interface ModifierTemplate extends IModel {
  id: string;
  type: ModifierType | string;
  level?: number;
  name?: string;
  description?: string;
  target?: string;
  value?: string | number;
}

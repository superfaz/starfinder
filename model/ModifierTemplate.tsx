import { ModifierType } from ".";

export interface ModifierTemplate {
  id: string;
  type: ModifierType | string;
  level?: number;
  name?: string;
  description?: string;
  target?: string;
  value?: string | number;
}

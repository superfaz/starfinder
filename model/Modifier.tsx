import { ModifierType } from ".";

export interface Modifier {
  id: string;
  type: ModifierType | string;
  level?: number;
  name?: string;
  description?: string;
  target?: string;
  value?: string | number;
}

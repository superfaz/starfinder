import { ModifierType } from ".";

export interface Modifier {
  id: string;
  type: ModifierType;
  level?: number;
  name?: string;
  description?: string;
  target?: string;
  value?: number;
}

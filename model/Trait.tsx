import { Modifier } from ".";

export interface Trait {
  id: string;
  name: string;
  description?: string;
  modifiers?: Modifier[];
}

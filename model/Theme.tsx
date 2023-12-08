import { Feature } from ".";

export interface Theme {
  id: string;
  name: string;
  description: string;
  refs: string[];
  abilityScores: Record<string, number>;
  features: Feature[];
}

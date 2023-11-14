export interface Option {
  id: string;
  name: string;
  description: string;
  abilityScores: Record<string, number>;
}

export interface Component {
  id: string;
  type: "ability" | "savingThrow" | "skill";
  title?: string;
  description?: string;
  target?: string;
  value?: number;
}

export interface Trait {
  id: string;
  name: string;
  description?: string;
  components?: Component[];
}

export interface Race {
  id: string;
  name: string;
  description: string;
  refs: string[];
  hitPoints: number;
  options: Option[];
  names: string[];
  traits: Trait[];
}

export interface Theme {
  id: string;
  name: string;
  description: string;
  refs: string[];
  abilityScores: Record<string, number>;
}

export interface Option {
  id: string;
  name: string;
  description: string;
  abilities: Record<string, number>;
}

export interface Ability {
  id: string;
  description: string;
}

export interface Trait {
  id: string;
  name: string;
  description: string;
  abilities: Ability[];
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

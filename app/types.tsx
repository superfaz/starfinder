export interface Option {
  id: string;
  name: string;
  description: string;
  abilities: Record<string, number>;
}

export interface Trait {
  id: string;
  name: string;
  description: string;
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

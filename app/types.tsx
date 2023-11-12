export interface Option {
  id: string;
  name: string;
  description: string;
  abilities: Record<string, number>;
}

export interface Component {
  id: string;
  type: "ability" | "savingThrow";
  title: string;
  description: string;
}

export interface Trait {
  id: string;
  name: string;
  description: string;
  components: Component[];
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

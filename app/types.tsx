export interface Option {
  id: string;
  name: string;
  description: string;
  abilityScores: Record<string, number>;
}

export interface Component {
  id: string;
  type: "ability" | "savingThrow" | "skill" | "classSkill";
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

export interface Advantage {
  id: string;
  name: string;
  level: number;
  description?: string;
  components?: Component[];
}

export interface Theme {
  id: string;
  name: string;
  description: string;
  refs: string[];
  abilityScores: Record<string, number>;
  advantages: Advantage[];
}

export interface Class {
  id: string;
  name: string;
  description: string;
  refs: string[];
  hitPoints: number;
  staminaPoints: number;
  keyAbilityScore: string | string[];
  SecondaryAbilityScore: string[];
}

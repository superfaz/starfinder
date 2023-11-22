export interface Option {
  id: string;
  name: string;
  description: string;
  abilityScores: Record<string, number>;
}

export enum ComponentType {
  ability = "ability",
  savingThrow = "savingThrow",
  skill = "skill",
  spell = "spell",
  classSkill = "classSkill",
  featCount = "featCount",
  feat = "feat",
  skillRank = "skillRank",
}

export interface Component {
  id: string;
  type: ComponentType;
  level?: number;
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
  secondaryAbilityScore: string[];
}

export interface Skill {
  code: string;
  name: string;
  abilityScore: string;
  trainedOnly: boolean;
  armorCheckPenalty: boolean;
}

export interface AbilityScore {
  id: string;
  code: string;
  name: string;
}

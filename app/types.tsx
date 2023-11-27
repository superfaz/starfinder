export interface Variant {
  id: string;
  name: string;
  description: string;
  abilityScores: Record<string, number>;
}

export enum ComponentType {
  ability = "ability",
  hitPoints = "hitPoints",
  savingThrow = "savingThrow",
  skill = "skill",
  spell = "spell",
  classSkill = "classSkill",
  featCount = "featCount",
  feat = "feat",
  skillRank = "skillRank",
  languageCount = "languageCount",
}

export interface Component {
  id: string;
  type: ComponentType;
  level?: number;
  name?: string;
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

export interface SecondaryTrait extends Trait {
  replace: string[];
}

export interface Race {
  id: string;
  name: string;
  description: string;
  refs: string[];
  hitPoints: number;
  variants: Variant[];
  names: string[];
  traits: Trait[];
  secondaryTraits: SecondaryTrait[];
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
  id: string;
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

export type Special = Record<string, string[]>;

export interface Alignment {
  id: string;
  code: string;
  name: string;
}

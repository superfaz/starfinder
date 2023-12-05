export interface Variant {
  id: string;
  name: string;
  description: string;
  abilityScores: Record<string, number>;
}

export enum ModifierType {
  ability = "ability",
  classSkill = "classSkill",
  featCount = "featCount",
  feat = "feat",
  hitPoints = "hitPoints",
  initiative = "initiative",
  languageCount = "languageCount",
  savingThrow = "savingThrow",
  skill = "skill",
  skillRank = "skillRank",
  spell = "spell",
}

export interface Modifier {
  id: string;
  type: ModifierType | string;
  level?: number;
  name?: string;
  description?: string;
  target?: string;
  value?: string | number;
}

export interface Trait {
  id: string;
  name: string;
  description?: string;
  modifiers?: Modifier[];
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

export interface Feature extends Trait {
  level: number;
  category?: "ex" | "ma" | "su";
  evolutions?: Record<string, Record<string, string | number | null>>;
}

export interface Theme {
  id: string;
  name: string;
  description: string;
  refs: string[];
  abilityScores: Record<string, number | undefined>;
  features: Feature[];
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
  skillRank: number;
  armors: string[];
  weapons: string[];
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

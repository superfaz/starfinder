import { AbilityScore, Alignment, Class, Race, Skill, Special, Theme } from "../../types";

export interface ClientComponentData {
  races: Race[];
  themes: Theme[];
  classes: Class[];
  skills: Skill[];
  abilityScores: AbilityScore[];
  specials: Record<string, Special>;
  alignments: Alignment[];
}

export class Character {
  race: string;
  raceVariant: string;
  raceOptions?: Record<string, string>;
  theme: string;
  themeOptions?: Record<string, string>;
  class: string;
  classOptions?: Record<string, string>;
  traits: string[];
  traitsOptions?: Record<string, string>;
  abilityScores: Record<string, number>;
}

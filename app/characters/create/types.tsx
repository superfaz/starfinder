import { AbilityScore, Alignment, Class, Race, Skill, Special, Theme } from "../../types";

export interface ClientComponentData {
  races: Race[];
  themes: Theme[];
  classes: Class[];
  skills: Skill[];
  abilityScores: AbilityScore[];
  specials: Record<string, Special>;
  alignments: Alignment[];
  armors: Record<string, string>;
  weapons: Record<string, string>;
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

  constructor() {
    this.race = "";
    this.raceVariant = "";
    this.theme = "";
    this.class = "";
    this.traits = [];
    this.abilityScores = { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 };
  }
}

export type Context = Record<string, string | number>;

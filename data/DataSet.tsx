import { AbilityScore, Alignment, Class, Race, Skill, Special, Theme } from "model";

export interface DataSet {
  abilityScores: AbilityScore[];
  alignments: Alignment[];
  classes: Class[];
  races: Race[];
  skills: Skill[];
  specials: Record<string, Special>;
  themes: Theme[];
  armors: Record<string, string>;
  weapons: Record<string, string>;
}

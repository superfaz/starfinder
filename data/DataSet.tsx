import { AbilityScore, Alignment, Avatar, Class, Race, SkillDefinition, Special, Theme } from "model";

export interface DataSet {
  abilityScores: AbilityScore[];
  alignments: Alignment[];
  avatars: Avatar[];
  classes: Class[];
  races: Race[];
  skills: SkillDefinition[];
  specials: Record<string, Special>;
  themes: Theme[];
  armors: Record<string, string>;
  weapons: Record<string, string>;
}

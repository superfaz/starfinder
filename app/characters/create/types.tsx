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

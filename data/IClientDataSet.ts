import { AbilityScore, Alignment, Avatar, Class, INamedModel, Race, SkillDefinition, Theme } from "model";

export interface IClientDataSet {
  abilityScores: AbilityScore[];
  alignments: Alignment[];
  avatars: Avatar[];
  classes: Class[];
  races: Race[];
  skills: SkillDefinition[];
  themes: Theme[];
  armors: INamedModel[];
  weapons: INamedModel[];
}

export const EmptyClientDataSet: IClientDataSet = {
  abilityScores: [],
  alignments: [],
  avatars: [],
  classes: [],
  races: [],
  skills: [],
  themes: [],
  armors: [],
  weapons: [],
};

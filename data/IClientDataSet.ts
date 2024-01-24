import { AbilityScore, Alignment, Avatar, Class, INamedModel, Race, SavingThrow, SkillDefinition, Theme } from "model";

export interface IClientDataSet {
  abilityScores: AbilityScore[];
  alignments: Alignment[];
  avatars: Avatar[];
  classes: Class[];
  races: Race[];
  savingThrows: SavingThrow[];
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
  savingThrows: [],
  skills: [],
  themes: [],
  armors: [],
  weapons: [],
};

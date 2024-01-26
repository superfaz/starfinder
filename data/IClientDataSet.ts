import {
  AbilityScore,
  Alignment,
  Avatar,
  Class,
  Feat,
  INamedModel,
  Race,
  SavingThrow,
  SkillDefinition,
  Theme,
} from "model";

export interface IClientDataSet {
  abilityScores: AbilityScore[];
  alignments: Alignment[];
  avatars: Avatar[];
  classes: Class[];
  feats: Feat[];
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
  feats: [],
  races: [],
  savingThrows: [],
  skills: [],
  themes: [],
  armors: [],
  weapons: [],
};

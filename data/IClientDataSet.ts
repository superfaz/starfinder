import {
  AbilityScore,
  Alignment,
  Armor,
  Avatar,
  Class,
  FeatTemplate,
  Race,
  SavingThrow,
  SkillDefinition,
  Theme,
  Weapon,
} from "model";

export interface IClientDataSet {
  abilityScores: AbilityScore[];
  alignments: Alignment[];
  avatars: Avatar[];
  classes: Class[];
  feats: FeatTemplate[];
  races: Race[];
  savingThrows: SavingThrow[];
  skills: SkillDefinition[];
  themes: Theme[];
  armors: Armor[];
  weapons: Weapon[];
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

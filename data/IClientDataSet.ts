import {
  AbilityScore,
  Alignment,
  Armor,
  Avatar,
  Class,
  FeatTemplate,
  Profession,
  Race,
  SavingThrow,
  SkillDefinition,
  Spell,
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
  spells: Spell[];
  themes: Theme[];
  armors: Armor[];
  weapons: Weapon[];
  professions: Profession[];
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
  spells: [],
  themes: [],
  armors: [],
  weapons: [],
  professions: [],
};

import { Avatar, Class, CodedModel, NamedModel, Race, SkillDefinition, Theme } from "model";

export interface IClientDataSet {
  abilityScores: CodedModel[];
  alignments: CodedModel[];
  avatars: Avatar[];
  classes: Class[];
  races: Race[];
  skills: SkillDefinition[];
  themes: Theme[];
  armors: NamedModel[];
  weapons: NamedModel[];
}

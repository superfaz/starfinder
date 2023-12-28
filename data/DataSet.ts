import { Avatar, Class, CodedModel, NamedModel, Race, SkillDefinition, Theme } from "model";

export interface DataSet {
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

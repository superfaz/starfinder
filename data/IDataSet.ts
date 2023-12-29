import { Avatar, Class, CodedModel, NamedModel, Race, SkillDefinition, Theme } from "model";

export interface IDataSet {
  getAbilityScores(): Promise<CodedModel[]>;
  getAlignments(): Promise<CodedModel[]>;
  getAvatars(): Promise<Avatar[]>;
  getClasses(): Promise<Class[]>;
  getClassDetails(classId: string): Promise<unknown>;
  getRaces(): Promise<Race[]>;
  getSkills(): Promise<SkillDefinition[]>;
  getThemes(): Promise<Theme[]>;
  getThemeDetails(themeId: string): Promise<unknown>;
  getArmors(): Promise<NamedModel[]>;
  getWeapons(): Promise<NamedModel[]>;
}

import { Avatar, Class, ICodedModel, INamedModel, Race, SkillDefinition, Theme } from "model";

export interface IDataSet {
  getAbilityScores(): Promise<ICodedModel[]>;
  getAlignments(): Promise<ICodedModel[]>;
  getAvatars(): Promise<Avatar[]>;
  getClasses(): Promise<Class[]>;
  getClassDetails(classId: string): Promise<unknown>;
  getRaces(): Promise<Race[]>;
  getSkills(): Promise<SkillDefinition[]>;
  getThemes(): Promise<Theme[]>;
  getThemeDetails(themeId: string): Promise<unknown>;
  getArmors(): Promise<INamedModel[]>;
  getWeapons(): Promise<INamedModel[]>;
}

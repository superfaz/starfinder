import { AbilityScore, Alignment, Avatar, Class, FeatTemplate, INamedModel, Race, SavingThrow, SkillDefinition, Theme } from "model";

export interface IDataSet {
  getAbilityScores(): Promise<AbilityScore[]>;
  getAlignments(): Promise<Alignment[]>;
  getAvatars(): Promise<Avatar[]>;
  getClasses(): Promise<Class[]>;
  getClassDetails(classId: string): Promise<unknown>;
  getFeats(): Promise<FeatTemplate[]>;
  getRaces(): Promise<Race[]>;
  getSavingThrows(): Promise<SavingThrow[]>;
  getSkills(): Promise<SkillDefinition[]>;
  getThemes(): Promise<Theme[]>;
  getThemeDetails(themeId: string): Promise<unknown>;
  getArmors(): Promise<INamedModel[]>;
  getWeapons(): Promise<INamedModel[]>;
}

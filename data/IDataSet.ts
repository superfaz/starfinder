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
  getSpells(): Promise<Spell[]>;
  getThemes(): Promise<Theme[]>;
  getThemeDetails(themeId: string): Promise<unknown>;
  getArmors(): Promise<Armor[]>;
  getWeapons(): Promise<Weapon[]>;
  getProfessions(): Promise<Profession[]>;
}

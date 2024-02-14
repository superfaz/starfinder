import {
  AbilityScore,
  Alignment,
  Armor,
  Avatar,
  Class,
  DamageType,
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
  getArmors(): Promise<Armor[]>;
  getAvatars(): Promise<Avatar[]>;
  getClasses(): Promise<Class[]>;
  getClassDetails(classId: string): Promise<unknown>;
  getDamageTypes(): Promise<DamageType[]>;
  getFeats(): Promise<FeatTemplate[]>;
  getProfessions(): Promise<Profession[]>;
  getRaces(): Promise<Race[]>;
  getSavingThrows(): Promise<SavingThrow[]>;
  getSkills(): Promise<SkillDefinition[]>;
  getSpells(): Promise<Spell[]>;
  getThemes(): Promise<Theme[]>;
  getThemeDetails(themeId: string): Promise<unknown>;
  getWeapons(): Promise<Weapon[]>;
}

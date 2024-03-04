import type {
  AbilityScore,
  Alignment,
  ArmorType,
  Avatar,
  Book,
  Class,
  DamageType,
  FeatTemplate,
  Profession,
  Race,
  SavingThrow,
  SkillDefinition,
  Spell,
  Theme,
  WeaponType,
} from "model";

export interface IDataSet {
  getAbilityScores(): Promise<AbilityScore[]>;
  getAlignments(): Promise<Alignment[]>;
  getArmorTypes(): Promise<ArmorType[]>;
  getAvatars(): Promise<Avatar[]>;
  getBooks(): Promise<Book[]>;
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
  getWeaponTypes(): Promise<WeaponType[]>;
}

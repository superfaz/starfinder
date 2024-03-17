import type {
  AbilityScore,
  Alignment,
  ArmorType,
  Avatar,
  Book,
  Class,
  CriticalHitEffect,
  DamageType,
  EquipmentWeaponMelee,
  FeatTemplate,
  Profession,
  Race,
  SavingThrow,
  SkillDefinition,
  Spell,
  Theme,
  WeaponCategory,
  WeaponSpecialProperty,
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
  getCriticalHitEffects(): Promise<CriticalHitEffect[]>;
  getDamageTypes(): Promise<DamageType[]>;
  getEquipmentWeaponMelee(): Promise<EquipmentWeaponMelee[]>;
  getFeats(): Promise<FeatTemplate[]>;
  getProfessions(): Promise<Profession[]>;
  getRaces(): Promise<Race[]>;
  getSavingThrows(): Promise<SavingThrow[]>;
  getSkills(): Promise<SkillDefinition[]>;
  getSpells(): Promise<Spell[]>;
  getThemes(): Promise<Theme[]>;
  getThemeDetails(themeId: string): Promise<unknown>;
  getWeaponCategories(): Promise<WeaponCategory[]>;
  getWeaponSpecialProperties(): Promise<WeaponSpecialProperty[]>;
  getWeaponTypes(): Promise<WeaponType[]>;
}

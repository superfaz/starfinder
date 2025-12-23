import { Schema } from "zod";
import {
  type AbilityScore,
  type Alignment,
  type ArmorType,
  type Avatar,
  type Book,
  type Class,
  type CriticalHitEffect,
  type DamageType,
  type EquipmentWeaponMelee,
  type FeatTemplate,
  type Profession,
  type Origin,
  type SavingThrow,
  type SkillDefinition,
  type Spell,
  type Theme,
  type WeaponCategory,
  type WeaponSpecialProperty,
  type WeaponType,
} from "model";

export interface Descriptor<T> {
  type: "simple" | "named" | "ordered";
  name: string;
  schema: Schema<T>;
}

export interface IDataSet {
  get<T>(descriptor: Descriptor<T>): Promise<T[]>;
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
  getRaces(): Promise<Origin[]>;
  getSavingThrows(): Promise<SavingThrow[]>;
  getSkills(): Promise<SkillDefinition[]>;
  getSpells(): Promise<Spell[]>;
  getThemes(): Promise<Theme[]>;
  getThemeDetails(themeId: string): Promise<unknown>;
  getWeaponCategories(): Promise<WeaponCategory[]>;
  getWeaponSpecialProperties(): Promise<WeaponSpecialProperty[]>;
  getWeaponTypes(): Promise<WeaponType[]>;
}

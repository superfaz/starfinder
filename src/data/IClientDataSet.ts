import type {
  AbilityScore,
  Alignment,
  ArmorType,
  Avatar,
  Book,
  Class,
  CriticalHitEffect,
  DamageType,
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
import { IDataSource } from "./interfaces";
import { DataSets } from "./DataSets";

export interface IClientDataSet {
  abilityScores: AbilityScore[];
  alignments: Alignment[];
  armorTypes: ArmorType[];
  avatars: Avatar[];
  books: Book[];
  classes: Class[];
  criticalHitEffects: CriticalHitEffect[];
  damageTypes: DamageType[];
  feats: FeatTemplate[];
  professions: Profession[];
  races: Race[];
  savingThrows: SavingThrow[];
  skills: SkillDefinition[];
  spells: Spell[];
  themes: Theme[];
  weaponCategories: WeaponCategory[];
  weaponSpecialProperties: WeaponSpecialProperty[];
  weaponTypes: WeaponType[];
}

export const EmptyClientDataSet: IClientDataSet = {
  abilityScores: [],
  alignments: [],
  armorTypes: [],
  avatars: [],
  books: [],
  classes: [],
  criticalHitEffects: [],
  damageTypes: [],
  feats: [],
  professions: [],
  races: [],
  savingThrows: [],
  skills: [],
  spells: [],
  themes: [],
  weaponCategories: [],
  weaponSpecialProperties: [],
  weaponTypes: [],
};

export async function convert(dataSource: IDataSource): Promise<IClientDataSet> {
  return {
    abilityScores: await dataSource.get(DataSets.AbilityScore).then((d) => d.getAll()),
    alignments: await dataSource.get(DataSets.Alignment).then((d) => d.getAll()),
    armorTypes: await dataSource.get(DataSets.ArmorType).then((d) => d.getAll()),
    avatars: await dataSource.get(DataSets.Avatar).then((d) => d.getAll()),
    books: await dataSource.get(DataSets.Book).then((d) => d.getAll()),
    classes: await dataSource.get(DataSets.Class).then((d) => d.getAll()),
    criticalHitEffects: await dataSource.get(DataSets.CriticalHitEffect).then((d) => d.getAll()),
    damageTypes: await dataSource.get(DataSets.DamageType).then((d) => d.getAll()),
    feats: await dataSource.get(DataSets.Feat).then((d) => d.getAll()),
    professions: await dataSource.get(DataSets.Profession).then((d) => d.getAll()),
    races: await dataSource.get(DataSets.Races).then((d) => d.getAll()),
    savingThrows: await dataSource.get(DataSets.SavingThrows).then((d) => d.getAll()),
    skills: await dataSource.get(DataSets.Skills).then((d) => d.getAll()),
    spells: await dataSource.get(DataSets.Spells).then((d) => d.getAll()),
    themes: await dataSource.get(DataSets.Themes).then((d) => d.getAll()),
    weaponCategories: await dataSource.get(DataSets.WeaponCategories).then((d) => d.getAll()),
    weaponSpecialProperties: await dataSource.get(DataSets.WeaponSpecialProperties).then((d) => d.getAll()),
    weaponTypes: await dataSource.get(DataSets.WeaponTypes).then((d) => d.getAll()),
  };
}

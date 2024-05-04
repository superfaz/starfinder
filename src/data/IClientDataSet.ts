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
  Size,
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
  sizes: Size[];
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
  sizes: [],
  skills: [],
  spells: [],
  themes: [],
  weaponCategories: [],
  weaponSpecialProperties: [],
  weaponTypes: [],
};

export async function convert(dataSource: IDataSource): Promise<IClientDataSet> {
  return {
    abilityScores: await dataSource.get(DataSets.AbilityScore).getAll(),
    alignments: await dataSource.get(DataSets.Alignment).getAll(),
    armorTypes: await dataSource.get(DataSets.ArmorType).getAll(),
    avatars: await dataSource.get(DataSets.Avatar).getAll(),
    books: await dataSource.get(DataSets.Book).getAll(),
    classes: await dataSource.get(DataSets.Class).getAll(),
    criticalHitEffects: await dataSource.get(DataSets.CriticalHitEffect).getAll(),
    damageTypes: await dataSource.get(DataSets.DamageType).getAll(),
    feats: await dataSource.get(DataSets.Feat).getAll(),
    professions: await dataSource.get(DataSets.Profession).getAll(),
    races: await dataSource.get(DataSets.Races).getAll(),
    savingThrows: await dataSource.get(DataSets.SavingThrows).getAll(),
    sizes: await dataSource.get(DataSets.Sizes).getAll(),
    skills: await dataSource.get(DataSets.Skills).getAll(),
    spells: await dataSource.get(DataSets.Spells).getAll(),
    themes: await dataSource.get(DataSets.Themes).getAll(),
    weaponCategories: await dataSource.get(DataSets.WeaponCategories).getAll(),
    weaponSpecialProperties: await dataSource.get(DataSets.WeaponSpecialProperties).getAll(),
    weaponTypes: await dataSource.get(DataSets.WeaponTypes).getAll(),
  };
}

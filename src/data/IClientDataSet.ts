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
import { IDataSet } from "./IDataSet";

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

export async function convert(serverData: IDataSet): Promise<IClientDataSet> {
  return {
    abilityScores: await serverData.getAbilityScores(),
    alignments: await serverData.getAlignments(),
    armorTypes: await serverData.getArmorTypes(),
    avatars: await serverData.getAvatars(),
    books: await serverData.getBooks(),
    classes: await serverData.getClasses(),
    criticalHitEffects: await serverData.getCriticalHitEffects(),
    damageTypes: await serverData.getDamageTypes(),
    feats: await serverData.getFeats(),
    professions: await serverData.getProfessions(),
    races: await serverData.getRaces(),
    savingThrows: await serverData.getSavingThrows(),
    skills: await serverData.getSkills(),
    spells: await serverData.getSpells(),
    themes: await serverData.getThemes(),
    weaponCategories: await serverData.getWeaponCategories(),
    weaponSpecialProperties: await serverData.getWeaponSpecialProperties(),
    weaponTypes: await serverData.getWeaponTypes(),
  };
}

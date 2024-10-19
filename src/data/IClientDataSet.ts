import type {
  AbilityScore,
  Alignment,
  ArmorType,
  Avatar,
  BodyPart,
  BonusCategory,
  Book,
  Class,
  CriticalHitEffect,
  DamageType,
  EquipmentMaterial,
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

export interface IClientDataSet {
  abilityScores: AbilityScore[];
  alignments: Alignment[];
  armorTypes: ArmorType[];
  avatars: Avatar[];
  bodyParts: BodyPart[];
  bonusCategories: BonusCategory[];
  books: Book[];
  classes: Class[];
  criticalHitEffects: CriticalHitEffect[];
  damageTypes: DamageType[];
  equipmentMaterials: EquipmentMaterial[];
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
  bodyParts: [],
  bonusCategories: [],
  books: [],
  classes: [],
  criticalHitEffects: [],
  damageTypes: [],
  equipmentMaterials: [],
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

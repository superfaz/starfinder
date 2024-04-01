import {
  AbilityScoreSchema,
  AlignmentSchema,
  ArmorTypeSchema,
  AvatarSchema,
  BookSchema,
  ClassSchema,
  DamageTypeSchema,
  FeatTemplateSchema,
  ProfessionSchema,
  RaceSchema,
  SavingThrowSchema,
  SkillDefinitionSchema,
  SpellSchema,
  ThemeSchema,
  WeaponCategorySchema,
  WeaponTypeSchema,
  EquipmentWeaponMeleeSchema,
  CriticalHitEffectSchema,
  WeaponSpecialPropertySchema,
  AbilityScore,
  Alignment,
  ArmorType,
  Book,
  Avatar,
  Class,
  CriticalHitEffect,
  DamageType,
  EquipmentWeaponMelee,
  Race,
  FeatTemplate,
  Profession,
  Spell,
  Theme,
  SavingThrow,
  SkillDefinition,
  WeaponCategory,
  WeaponSpecialProperty,
  WeaponType,
  IModelSchema,
  IModel,
  EquipmentWeaponRangedSchema,
  EquipmentWeaponRanged,
  EquipmentWeaponGrenadeSchema,
  EquipmentWeaponGrenade,
  EquipmentWeaponSolarian,
  EquipmentWeaponSolarianSchema,
  EquipmentWeaponAmmunition,
  EquipmentWeaponAmmunitionSchema,
} from "model";
import { IDescriptor } from "./interfaces";

export const DataSets = {
  AbilityScore: { type: "ordered", name: "ability-scores", schema: AbilityScoreSchema } as IDescriptor<AbilityScore>,
  Alignment: { type: "ordered", name: "alignments", schema: AlignmentSchema } as IDescriptor<Alignment>,
  ArmorType: { type: "ordered", name: "armor-types", schema: ArmorTypeSchema } as IDescriptor<ArmorType>,
  Avatar: { type: "simple", name: "avatars", schema: AvatarSchema } as IDescriptor<Avatar>,
  Book: { type: "simple", name: "books", schema: BookSchema } as IDescriptor<Book>,
  Class: { type: "named", name: "classes", schema: ClassSchema } as IDescriptor<Class>,
  ClassDetails: { type: "simple", name: "classes-details", schema: IModelSchema } as IDescriptor<IModel>,
  CriticalHitEffect: {
    type: "named",
    name: "critical-hit-effects",
    schema: CriticalHitEffectSchema,
  } as IDescriptor<CriticalHitEffect>,
  DamageType: { type: "named", name: "damage-types", schema: DamageTypeSchema } as IDescriptor<DamageType>,
  EquipmentWeaponBasic: {
    type: "simple",
    name: "equipment-weapons-basic",
    schema: EquipmentWeaponMeleeSchema,
  } as IDescriptor<EquipmentWeaponMelee>,
  EquipmentWeaponAdvanced: {
    type: "simple",
    name: "equipment-weapons-advanced",
    schema: EquipmentWeaponMeleeSchema,
  } as IDescriptor<EquipmentWeaponMelee>,
  EquipmentWeaponSmall: {
    type: "simple",
    name: "equipment-weapons-small",
    schema: EquipmentWeaponRangedSchema,
  } as IDescriptor<EquipmentWeaponRanged>,
  EquipmentWeaponLong: {
    type: "simple",
    name: "equipment-weapons-long",
    schema: EquipmentWeaponRangedSchema,
  } as IDescriptor<EquipmentWeaponRanged>,
  EquipmentWeaponHeavy: {
    type: "simple",
    name: "equipment-weapons-heavy",
    schema: EquipmentWeaponRangedSchema,
  } as IDescriptor<EquipmentWeaponRanged>,
  EquipmentWeaponSniper: {
    type: "simple",
    name: "equipment-weapons-sniper",
    schema: EquipmentWeaponRangedSchema,
  } as IDescriptor<EquipmentWeaponRanged>,
  EquipmentWeaponGrenade: {
    type: "simple",
    name: "equipment-weapons-grenade",
    schema: EquipmentWeaponGrenadeSchema,
  } as IDescriptor<EquipmentWeaponGrenade>,
  EquipmentWeaponSolarian: {
    type: "simple",
    name: "equipment-weapons-solarian",
    schema: EquipmentWeaponSolarianSchema,
  } as IDescriptor<EquipmentWeaponSolarian>,
  EquipmentWeaponAmmunition: {
    type: "simple",
    name: "equipment-weapons-ammunition",
    schema: EquipmentWeaponAmmunitionSchema,
  } as IDescriptor<EquipmentWeaponAmmunition>,
  Feat: { type: "named", name: "feats", schema: FeatTemplateSchema } as IDescriptor<FeatTemplate>,
  Profession: { type: "named", name: "professions", schema: ProfessionSchema } as IDescriptor<Profession>,
  Races: { type: "named", name: "races", schema: RaceSchema } as IDescriptor<Race>,
  Spells: { type: "named", name: "spells", schema: SpellSchema } as IDescriptor<Spell>,
  Themes: { type: "named", name: "themes", schema: ThemeSchema } as IDescriptor<Theme>,
  ThemeDetails: { type: "simple", name: "themes-details", schema: IModelSchema } as IDescriptor<IModel>,
  SavingThrows: { type: "ordered", name: "saving-throws", schema: SavingThrowSchema } as IDescriptor<SavingThrow>,
  Skills: { type: "named", name: "skills", schema: SkillDefinitionSchema } as IDescriptor<SkillDefinition>,
  WeaponCategories: {
    type: "named",
    name: "weapon-categories",
    schema: WeaponCategorySchema,
  } as IDescriptor<WeaponCategory>,
  WeaponSpecialProperties: {
    type: "named",
    name: "weapon-special-properties",
    schema: WeaponSpecialPropertySchema,
  } as IDescriptor<WeaponSpecialProperty>,
  WeaponTypes: { type: "ordered", name: "weapon-types", schema: WeaponTypeSchema } as IDescriptor<WeaponType>,
};

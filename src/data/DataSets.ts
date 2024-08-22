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
  SizeSchema,
  Size,
  EquipmentMaterial,
  EquipmentMaterialSchema,
  EquipmentWeaponFusionSchema,
  EquipmentWeaponFusion,
  EquipmentArmorHeavy,
  EquipmentArmorLight,
  EquipmentArmorLightSchema,
  EquipmentArmorHeavySchema,
  EquipmentArmorPoweredSchema,
  EquipmentArmorPowered,
  EquipmentArmorUpgradeSchema,
  EquipmentArmorUpgrade,
  WorldSchema,
  World,
  DeitySchema,
  Deity,
  INamedModelSchema,
  INamedModel,
  BonusCategorySchema,
  BonusCategory,
  EquipmentAugmentationSchema,
  EquipmentAugmentation,
  BodyPartSchema,
  BodyPart,
} from "model";
import { IStaticDescriptor } from "./interfaces";

export const DataSets = {
  AbilityScore: {
    mode: "static",
    type: "ordered",
    name: "ability-scores",
    schema: AbilityScoreSchema,
  } as IStaticDescriptor<AbilityScore>,
  Alignment: {
    mode: "static",
    type: "ordered",
    name: "alignments",
    schema: AlignmentSchema,
  } as IStaticDescriptor<Alignment>,
  ArmorType: {
    mode: "static",
    type: "ordered",
    name: "armor-types",
    schema: ArmorTypeSchema,
  } as IStaticDescriptor<ArmorType>,
  Avatar: { mode: "static", type: "simple", name: "avatars", schema: AvatarSchema } as IStaticDescriptor<Avatar>,
  BodyParts: {
    mode: "static",
    type: "named",
    name: "body-parts",
    schema: BodyPartSchema,
  } as IStaticDescriptor<BodyPart>,
  BonusCategories: {
    mode: "static",
    type: "named",
    name: "bonus-categories",
    schema: BonusCategorySchema,
  } as IStaticDescriptor<BonusCategory>,
  Book: { mode: "static", type: "simple", name: "books", schema: BookSchema } as IStaticDescriptor<Book>,
  Class: { mode: "static", type: "named", name: "classes", schema: ClassSchema } as IStaticDescriptor<Class>,
  ClassDetails: {
    mode: "static",
    type: "simple",
    name: "classes-details",
    schema: IModelSchema,
  } as IStaticDescriptor<IModel>,
  CriticalHitEffects: {
    mode: "static",
    type: "named",
    name: "critical-hit-effects",
    schema: CriticalHitEffectSchema,
  } as IStaticDescriptor<CriticalHitEffect>,
  DamageTypes: {
    mode: "static",
    type: "named",
    name: "damage-types",
    schema: DamageTypeSchema,
  } as IStaticDescriptor<DamageType>,
  Deities: { mode: "static", type: "named", name: "deities", schema: DeitySchema } as IStaticDescriptor<Deity>,
  EquipmentArmorLight: {
    mode: "static",
    type: "simple",
    name: "equipment-armors-light",
    schema: EquipmentArmorLightSchema,
  } as IStaticDescriptor<EquipmentArmorLight>,
  EquipmentArmorHeavy: {
    mode: "static",
    type: "simple",
    name: "equipment-armors-heavy",
    schema: EquipmentArmorHeavySchema,
  } as IStaticDescriptor<EquipmentArmorHeavy>,
  EquipmentArmorPowered: {
    mode: "static",
    type: "simple",
    name: "equipment-armors-powered",
    schema: EquipmentArmorPoweredSchema,
  } as IStaticDescriptor<EquipmentArmorPowered>,
  EquipmentArmorUpgrade: {
    mode: "static",
    type: "simple",
    name: "equipment-armors-upgrades",
    schema: EquipmentArmorUpgradeSchema,
  } as IStaticDescriptor<EquipmentArmorUpgrade>,
  EquipmentMaterial: {
    mode: "static",
    type: "ordered",
    name: "equipment-material",
    schema: EquipmentMaterialSchema,
  } as IStaticDescriptor<EquipmentMaterial>,
  EquipmentOtherAugmentation: {
    mode: "static",
    type: "simple",
    name: "equipment-others-augmentations",
    schema: EquipmentAugmentationSchema,
  } as IStaticDescriptor<EquipmentAugmentation>,
  EquipmentWeaponBasic: {
    mode: "static",
    type: "simple",
    name: "equipment-weapons-basic",
    schema: EquipmentWeaponMeleeSchema,
  } as IStaticDescriptor<EquipmentWeaponMelee>,
  EquipmentWeaponAdvanced: {
    mode: "static",
    type: "simple",
    name: "equipment-weapons-advanced",
    schema: EquipmentWeaponMeleeSchema,
  } as IStaticDescriptor<EquipmentWeaponMelee>,
  EquipmentWeaponSmall: {
    mode: "static",
    type: "simple",
    name: "equipment-weapons-small",
    schema: EquipmentWeaponRangedSchema,
  } as IStaticDescriptor<EquipmentWeaponRanged>,
  EquipmentWeaponLong: {
    mode: "static",
    type: "simple",
    name: "equipment-weapons-long",
    schema: EquipmentWeaponRangedSchema,
  } as IStaticDescriptor<EquipmentWeaponRanged>,
  EquipmentWeaponHeavy: {
    mode: "static",
    type: "simple",
    name: "equipment-weapons-heavy",
    schema: EquipmentWeaponRangedSchema,
  } as IStaticDescriptor<EquipmentWeaponRanged>,
  EquipmentWeaponSniper: {
    mode: "static",
    type: "simple",
    name: "equipment-weapons-sniper",
    schema: EquipmentWeaponRangedSchema,
  } as IStaticDescriptor<EquipmentWeaponRanged>,
  EquipmentWeaponGrenade: {
    mode: "static",
    type: "simple",
    name: "equipment-weapons-grenade",
    schema: EquipmentWeaponGrenadeSchema,
  } as IStaticDescriptor<EquipmentWeaponGrenade>,
  EquipmentWeaponSolarian: {
    mode: "static",
    type: "simple",
    name: "equipment-weapons-solarian",
    schema: EquipmentWeaponSolarianSchema,
  } as IStaticDescriptor<EquipmentWeaponSolarian>,
  EquipmentWeaponAmmunition: {
    mode: "static",
    type: "named",
    name: "equipment-weapons-ammunition",
    schema: EquipmentWeaponAmmunitionSchema,
  } as IStaticDescriptor<EquipmentWeaponAmmunition>,
  EquipmentWeaponFusions: {
    mode: "static",
    type: "named",
    name: "equipment-weapons-fusion",
    schema: EquipmentWeaponFusionSchema,
  } as IStaticDescriptor<EquipmentWeaponFusion>,
  Feat: { mode: "static", type: "named", name: "feats", schema: FeatTemplateSchema } as IStaticDescriptor<FeatTemplate>,
  Languages: {
    mode: "static",
    type: "simple",
    name: "languages",
    schema: INamedModelSchema,
  } as IStaticDescriptor<INamedModel>,
  Profession: {
    mode: "static",
    type: "named",
    name: "professions",
    schema: ProfessionSchema,
  } as IStaticDescriptor<Profession>,
  Races: { mode: "static", type: "named", name: "races", schema: RaceSchema } as IStaticDescriptor<Race>,
  Spells: { mode: "static", type: "named", name: "spells", schema: SpellSchema } as IStaticDescriptor<Spell>,
  Themes: { mode: "static", type: "named", name: "themes", schema: ThemeSchema } as IStaticDescriptor<Theme>,
  ThemeDetails: {
    mode: "static",
    type: "simple",
    name: "themes-details",
    schema: IModelSchema,
  } as IStaticDescriptor<IModel>,
  SavingThrows: {
    mode: "static",
    type: "ordered",
    name: "saving-throws",
    schema: SavingThrowSchema,
  } as IStaticDescriptor<SavingThrow>,
  Sizes: { mode: "static", type: "ordered", name: "sizes", schema: SizeSchema } as IStaticDescriptor<Size>,
  Skills: {
    mode: "static",
    type: "named",
    name: "skills",
    schema: SkillDefinitionSchema,
  } as IStaticDescriptor<SkillDefinition>,
  WeaponCategories: {
    mode: "static",
    type: "named",
    name: "weapon-categories",
    schema: WeaponCategorySchema,
  } as IStaticDescriptor<WeaponCategory>,
  WeaponSpecialProperties: {
    mode: "static",
    type: "named",
    name: "weapon-special-properties",
    schema: WeaponSpecialPropertySchema,
  } as IStaticDescriptor<WeaponSpecialProperty>,
  WeaponTypes: {
    mode: "static",
    type: "ordered",
    name: "weapon-types",
    schema: WeaponTypeSchema,
  } as IStaticDescriptor<WeaponType>,
  Worlds: { mode: "static", type: "simple", name: "worlds", schema: WorldSchema } as IStaticDescriptor<World>,
};

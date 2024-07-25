import { z } from "zod";
import { BonusCategoryIdSchema } from "./BonusCategory";
import { DamageTypeIdSchema } from "./DamageType";
import { IModelSchema } from "./IModel";
import { ModifierTypes } from "./ModifierType";
import { SavingThrowIdSchema } from "./SavingThrow";
import { WeaponTypeIdSchema } from "./WeaponType";
import { ArmorTypeIdSchema } from "./ArmorType";
import { DescriptionSchema, IdSchema } from "./helper";
import { SizeIdSchema } from "./Size";
import { INamedModelSchema } from "./INamedModel";
import { BodyPartIdSchema } from "./BodyPart";
import { AbilityScoreIdSchema } from "./AbilityScore";
import { EquipmentWeaponSchema } from "./EquipmentWeapon";
import { EquipmentArmorSchema } from "./EquipmentArmor";

// #region Modifier with value
const BaseValueModifierSchema = IModelSchema.extend({
  level: z.number().optional(),
  value: z.coerce.number(),
});

export const AbilityScoreModifierSchema = BaseValueModifierSchema.extend({
  type: z.literal(ModifierTypes.abilityScore),
  target: AbilityScoreIdSchema,
}).strict();

export const ArmorCheckPenaltyModifierSchema = BaseValueModifierSchema.extend({
  type: z.literal(ModifierTypes.armorCheckPenalty),
}).strict();

export const ArmorSpeedAdjustmentModifierSchema = BaseValueModifierSchema.extend({
  type: z.literal(ModifierTypes.armorSpeedAdjustment),
}).strict();

export const BodyPartModifierSchema = BaseValueModifierSchema.extend({
  type: z.literal(ModifierTypes.bodyPart),
  target: BodyPartIdSchema,
}).strict();

export const DamageReductionModifierSchema = BaseValueModifierSchema.extend({
  type: z.literal(ModifierTypes.damageReduction),
}).strict();

export const FeatCountModifierSchema = BaseValueModifierSchema.extend({
  type: z.literal(ModifierTypes.featCount),
}).strict();

export const HitPointsModifierSchema = BaseValueModifierSchema.extend({
  type: z.literal(ModifierTypes.hitPoints),
}).strict();

export const LanguageCountModifierSchema = BaseValueModifierSchema.extend({
  type: z.literal(ModifierTypes.languageCount),
}).strict();

export const RankModifierSchema = BaseValueModifierSchema.extend({
  type: z.literal(ModifierTypes.rank),
}).strict();

export const ResolveModifierSchema = BaseValueModifierSchema.extend({
  type: z.literal(ModifierTypes.resolve),
}).strict();

export const StaminaModifierSchema = BaseValueModifierSchema.extend({
  type: z.literal(ModifierTypes.stamina),
}).strict();

export const ResistanceModifierSchema = BaseValueModifierSchema.extend({
  type: z.literal(ModifierTypes.resistance),
  target: DamageTypeIdSchema,
}).strict();

// #endregion
// #region Modifier with bonus category

const BaseCategoryModifierSchema = BaseValueModifierSchema.extend({
  category: BonusCategoryIdSchema,
});

export const AttackModifierSchema = BaseCategoryModifierSchema.extend({
  type: z.literal(ModifierTypes.attack),
  target: z.optional(WeaponTypeIdSchema),
}).strict();

export const ArmorClassModifierSchema = BaseCategoryModifierSchema.extend({
  type: z.literal(ModifierTypes.armorClass),
}).strict();

export const DamageModifierSchema = BaseCategoryModifierSchema.extend({
  type: z.literal(ModifierTypes.damage),
  target: WeaponTypeIdSchema,
}).strict();

export const InitiativeModifierSchema = BaseCategoryModifierSchema.extend({
  type: z.literal(ModifierTypes.initiative),
}).strict();

export const SavingThrowBonusModifierSchema = BaseCategoryModifierSchema.extend({
  type: z.literal(ModifierTypes.savingThrowBonus),
  target: SavingThrowIdSchema.optional(),
}).strict();

export const SkillModifierSchema = BaseCategoryModifierSchema.extend({
  type: z.literal(ModifierTypes.skill),
  target: z.string(),
}).strict();

export type SkillModifier = z.infer<typeof SkillModifierSchema>;

export const SpeedModifierSchema = BaseCategoryModifierSchema.extend({
  type: z.literal(ModifierTypes.speed),
}).strict();

// #endregion
// #region Other simple modifiers

export const ArmorProficiencyModifierSchema = IModelSchema.extend({
  type: z.literal(ModifierTypes.armorProficiency),
  level: z.number().optional(),
  target: ArmorTypeIdSchema,
}).strict();

export const ClassSkillModifierSchema = IModelSchema.extend({
  type: z.literal(ModifierTypes.classSkill),
  level: z.number().optional(),
  target: IdSchema,
  doubleEffect: z.optional(z.enum(["rank", "bonus"])),
}).strict();

export const DroneWeaponModifierSchema = IModelSchema.extend({
  type: z.literal(ModifierTypes.droneWeapon),
  level: z.number().optional(),
  target: z.enum(["melee", "ranged"]),
}).strict();

export const EquipmentModifierSchema = IModelSchema.extend({
  type: z.literal(ModifierTypes.equipment),
  level: z.number().optional(),
  equipment: z.union([EquipmentArmorSchema, EquipmentWeaponSchema]),
}).strict();

export type EquipmentModifier = z.infer<typeof EquipmentModifierSchema>;

export const FeatModifierSchema = IModelSchema.extend({
  type: z.literal(ModifierTypes.feat),
  level: z.number().optional(),
  feat: IdSchema,
  target: IdSchema.optional(),
  extra: z.string().optional(),
}).strict();

export type FeatModifier = z.infer<typeof FeatModifierSchema>;

export const RankSkillModifierSchema = IModelSchema.extend({
  type: z.literal(ModifierTypes.rankSkill),
  level: z.number().optional(),
  target: IdSchema,
}).strict();

export const SizeModifierSchema = IModelSchema.extend({
  type: z.literal(ModifierTypes.size),
  level: z.number().optional(),
  target: SizeIdSchema,
}).strict();

export const SkillTrainedModifierSchema = IModelSchema.extend({
  type: z.literal(ModifierTypes.skillTrained),
  level: z.number().optional(),
  target: IdSchema,
}).strict();

export const SpellModifierSchema = IModelSchema.extend({
  type: z.literal(ModifierTypes.spell),
  level: z.number().optional(),
  target: IdSchema,
  extra: z.string().optional(),
}).strict();

export const WeaponProficiencyModifierSchema = IModelSchema.extend({
  type: z.literal(ModifierTypes.weaponProficiency),
  level: z.number().optional(),
  target: WeaponTypeIdSchema,
}).strict();

// #endregion

export const EffectModifierSchema = z.discriminatedUnion("type", [
  AbilityScoreModifierSchema,
  ArmorCheckPenaltyModifierSchema,
  ArmorClassModifierSchema,
  ArmorSpeedAdjustmentModifierSchema,
  ArmorProficiencyModifierSchema,
  AttackModifierSchema,
  BodyPartModifierSchema,
  ClassSkillModifierSchema,
  DamageModifierSchema,
  DamageReductionModifierSchema,
  DroneWeaponModifierSchema,
  EquipmentModifierSchema,
  FeatCountModifierSchema,
  FeatModifierSchema,
  HitPointsModifierSchema,
  InitiativeModifierSchema,
  LanguageCountModifierSchema,
  RankModifierSchema,
  RankSkillModifierSchema,
  ResistanceModifierSchema,
  ResolveModifierSchema,
  SavingThrowBonusModifierSchema,
  SizeModifierSchema,
  SkillModifierSchema,
  SkillTrainedModifierSchema,
  SpeedModifierSchema,
  SpellModifierSchema,
  StaminaModifierSchema,
  WeaponProficiencyModifierSchema,
]);

export const AbilityModifierSchema = INamedModelSchema.extend({
  type: z.literal(ModifierTypes.ability),
  level: z.number().optional(),
  description: DescriptionSchema,
  effects: z.optional(z.array(EffectModifierSchema)),
}).strict();

export const SavingThrowModifierSchema = INamedModelSchema.extend({
  type: z.literal(ModifierTypes.savingThrow),
  level: z.number().optional(),
  description: DescriptionSchema,
  effects: z.optional(z.array(EffectModifierSchema)),
}).strict();

export const ModifierSchema = z.discriminatedUnion("type", [
  ...EffectModifierSchema.options,
  AbilityModifierSchema,
  SavingThrowModifierSchema,
]);

export type Modifier = z.infer<typeof ModifierSchema>;

export function isModifier(obj: unknown): obj is Modifier {
  return ModifierSchema.safeParse(obj).success;
}

export function ofType<V extends Modifier["type"]>(val: V) {
  return (obj: Modifier): obj is Extract<Modifier, { type: V }> => obj.type === val;
}

import { z } from "zod";
import { ArmorTypeIdSchema } from "./ArmorType";
import { DescriptionSchema, IdSchema } from "./helper";
import { IModelSchema } from "./IModel";
import { ModifierTypes } from "./ModifierType";
import { SavingThrowIdSchema } from "./SavingThrow";
import { WeaponTypeIdSchema } from "./WeaponType";
import { DamageTypeIdSchema } from "./DamageType";
import { TemplateEquipmentSchema } from "./Template";
import { SizeIdSchema } from "./Size";
import { BonusCategoryIdSchema } from "./BonusCategory";

export const ArmorProficiencyModifierSchema = IModelSchema.extend({
  type: z.literal(ModifierTypes.armorProficiency),
  level: z.number().optional(),
  target: ArmorTypeIdSchema,
}).strict();

export const ClassSkillModifierSchema = IModelSchema.extend({
  type: z.literal(ModifierTypes.classSkill),
  level: z.number().optional(),
  target: z.string(),
}).strict();

export const EquipmentModifierSchema = IModelSchema.extend({
  type: z.literal(ModifierTypes.equipment),
  level: z.number().optional(),
  equipment: TemplateEquipmentSchema,
}).strict();

export const FeatModifierSchema = IModelSchema.extend({
  type: z.literal(ModifierTypes.feat),
  level: z.number().optional(),
  feat: IdSchema,
  target: z.string().optional(),
  extra: z.string().optional(),
}).strict();

export type FeatModifier = z.infer<typeof FeatModifierSchema>;

export const RankSkillModifierSchema = IModelSchema.extend({
  type: z.literal(ModifierTypes.rankSkill),
  level: z.number().optional(),
  target: z.string(),
}).strict();

export const SizeModifierSchema = IModelSchema.extend({
  type: z.literal(ModifierTypes.size),
  level: z.number().optional(),
  target: SizeIdSchema,
}).strict();

export const SpellModifierSchema = IModelSchema.extend({
  type: z.literal(ModifierTypes.spell),
  level: z.number().optional(),
  target: z.string(),
  extra: z.string().optional(),
}).strict();

export const WeaponProficiencyModifierSchema = IModelSchema.extend({
  type: z.literal(ModifierTypes.weaponProficiency),
  level: z.number().optional(),
  target: WeaponTypeIdSchema,
}).strict();

export const SimpleModifierTemplateSchema = IModelSchema.extend({
  type: z.enum([
    ModifierTypes.featCount,
    ModifierTypes.hitPoints,
    ModifierTypes.languageCount,
    ModifierTypes.rank,
    ModifierTypes.resolve,
    ModifierTypes.speed,
    ModifierTypes.stamina,
  ]),
  level: z.number().optional(),
  value: z.union([z.string(), z.number()]),
}).strict();

/** Bonuses to dice throws */

const BaseBonusModifierSchema = IModelSchema.extend({
  level: z.number().optional(),
  value: z.union([z.string(), z.number()]),
  category: BonusCategoryIdSchema,
});

export const AttackModifierSchema = BaseBonusModifierSchema.extend({
  type: z.literal(ModifierTypes.attack),
  target: z.optional(z.union([z.string(), WeaponTypeIdSchema])),
}).strict();

export const DamageModifierSchema = BaseBonusModifierSchema.extend({
  type: z.literal(ModifierTypes.damage),
  target: WeaponTypeIdSchema,
}).strict();

export const ResistanceModifierTemplateSchema = BaseBonusModifierSchema.extend({
  type: z.literal(ModifierTypes.resistance),
  targets: z.array(DamageTypeIdSchema),
}).strict();

export const SavingThrowBonusModifierSchema = BaseBonusModifierSchema.extend({
  type: z.literal(ModifierTypes.savingThrowBonus),
  target: z.optional(SavingThrowIdSchema),
}).strict();

export const SkillModifierTemplateSchema = BaseBonusModifierSchema.extend({
  type: z.literal(ModifierTypes.skill),
  target: z.string(),
}).strict();

export const SimpleBonusModifierTemplateSchema = BaseBonusModifierSchema.extend({
  type: z.enum([ModifierTypes.armorClass, ModifierTypes.initiative]),
}).strict();

export const EffectTemplateSchema = z.discriminatedUnion("type", [
  ArmorProficiencyModifierSchema,
  AttackModifierSchema,
  ClassSkillModifierSchema,
  DamageModifierSchema,
  EquipmentModifierSchema,
  FeatModifierSchema,
  RankSkillModifierSchema,
  ResistanceModifierTemplateSchema,
  SavingThrowBonusModifierSchema,
  SimpleBonusModifierTemplateSchema,
  SimpleModifierTemplateSchema,
  SizeModifierSchema,
  SkillModifierTemplateSchema,
  SpellModifierSchema,
  WeaponProficiencyModifierSchema,
]);

export const AbilityModifierSchema = IModelSchema.extend({
  type: z.literal(ModifierTypes.ability),
  level: z.number().optional(),
  name: z.string(),
  description: DescriptionSchema,
  effects: z.optional(z.array(EffectTemplateSchema)),
}).strict();

export const SavingThrowModifierSchema = IModelSchema.extend({
  type: z.literal(ModifierTypes.savingThrow),
  level: z.number().optional(),
  name: z.string(),
  description: DescriptionSchema,
  effects: z.optional(z.array(EffectTemplateSchema)),
}).strict();

export const ModifierTemplateSchema = z.discriminatedUnion("type", [
  AbilityModifierSchema,
  ArmorProficiencyModifierSchema,
  AttackModifierSchema,
  SimpleBonusModifierTemplateSchema,
  ClassSkillModifierSchema,
  DamageModifierSchema,
  EquipmentModifierSchema,
  FeatModifierSchema,
  RankSkillModifierSchema,
  ResistanceModifierTemplateSchema,
  SavingThrowBonusModifierSchema,
  SavingThrowModifierSchema,
  SimpleModifierTemplateSchema,
  SizeModifierSchema,
  SkillModifierTemplateSchema,
  SpellModifierSchema,
  WeaponProficiencyModifierSchema,
]);

export type ModifierTemplate = z.infer<typeof ModifierTemplateSchema>;

export function isModifierTemplate(obj: unknown): obj is ModifierTemplate {
  return ModifierTemplateSchema.safeParse(obj).success;
}

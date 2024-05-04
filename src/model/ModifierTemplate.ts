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

export const AbilityModifierSchema = IModelSchema.extend({
  type: z.literal(ModifierTypes.ability),
  level: z.number().optional(),
  name: z.string(),
  description: DescriptionSchema,
}).strict();

export const ArmorProficiencyModifierSchema = IModelSchema.extend({
  type: z.literal(ModifierTypes.armorProficiency),
  level: z.number().optional(),
  target: ArmorTypeIdSchema,
}).strict();

export const AttackModifierSchema = IModelSchema.extend({
  type: z.literal(ModifierTypes.attack),
  level: z.number().optional(),
  target: z.string().optional(),
  value: z.union([z.string(), z.number()]),
}).strict();

export const ClassSkillModifierSchema = IModelSchema.extend({
  type: z.literal(ModifierTypes.classSkill),
  level: z.number().optional(),
  target: z.string(),
}).strict();

export const DamageModifierSchema = IModelSchema.extend({
  type: z.literal(ModifierTypes.damage),
  level: z.number().optional(),
  target: WeaponTypeIdSchema,
  value: z.union([z.string(), z.number()]),
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

export const ResistanceModifierTemplateSchema = IModelSchema.extend({
  type: z.literal(ModifierTypes.resistance),
  level: z.number().optional(),
  targets: z.array(DamageTypeIdSchema),
  value: z.union([z.string(), z.number()]),
}).strict();

export const SavingThrowBonusModifierSchema = IModelSchema.extend({
  type: z.literal(ModifierTypes.savingThrowBonus),
  level: z.number().optional(),
  target: SavingThrowIdSchema,
  value: z.union([z.string(), z.number()]),
}).strict();

export const SavingThrowModifierSchema = IModelSchema.extend({
  type: z.literal(ModifierTypes.savingThrow),
  level: z.number().optional(),
  name: z.string(),
  description: DescriptionSchema,
}).strict();

export const SizeModifierSchema = IModelSchema.extend({
  type: z.literal(ModifierTypes.size),
  level: z.number().optional(),
  target: SizeIdSchema,
}).strict();

export const SkillModifierTemplateSchema = IModelSchema.extend({
  type: z.literal(ModifierTypes.skill),
  level: z.number().optional(),
  target: z.string(),
  value: z.union([z.string(), z.number()]),
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
    ModifierTypes.armorClass,
    ModifierTypes.featCount,
    ModifierTypes.hitPoints,
    ModifierTypes.initiative,
    ModifierTypes.languageCount,
    ModifierTypes.rank,
    ModifierTypes.resolve,
    ModifierTypes.speed,
    ModifierTypes.stamina,
  ]),
  level: z.number().optional(),
  value: z.union([z.string(), z.number()]),
}).strict();

export const ModifierTemplateSchema = z.discriminatedUnion("type", [
  AbilityModifierSchema,
  ArmorProficiencyModifierSchema,
  AttackModifierSchema,
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

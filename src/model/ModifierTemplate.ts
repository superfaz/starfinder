import { z } from "zod";
import { ArmorIdSchema } from "./Armor";
import { DescriptionSchema, IdSchema } from "./helper";
import { IModelSchema } from "./IModel";
import { ModifierTypes } from "./ModifierType";
import { SavingThrowIdSchema } from "./SavingThrow";
import { WeaponIdSchema } from "./Weapon";

export const AbilityModifierSchema = IModelSchema.extend({
  type: z.literal(ModifierTypes.ability),
  level: z.number().optional(),
  name: z.string(),
  description: DescriptionSchema,
}).strict();

export const ArmorProficiencyModifierSchema = IModelSchema.extend({
  type: z.literal(ModifierTypes.armorProficiency),
  level: z.number().optional(),
  target: ArmorIdSchema,
}).strict();

export const ClassSkillModifierSchema = IModelSchema.extend({
  type: z.literal(ModifierTypes.classSkill),
  level: z.number().optional(),
  target: z.string(),
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

export const SavingThrowModifierSchema = IModelSchema.extend({
  type: z.literal(ModifierTypes.savingThrow),
  level: z.number().optional(),
  name: z.string(),
  description: DescriptionSchema,
}).strict();

export const SavingThrowBonusModifierSchema = IModelSchema.extend({
  type: z.literal(ModifierTypes.savingThrowBonus),
  level: z.number().optional(),
  target: SavingThrowIdSchema,
  value: z.number(),
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
  target: WeaponIdSchema,
}).strict();

export const SimpleModifierTemplateSchema = IModelSchema.extend({
  type: z.enum([
    ModifierTypes.attack,
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
});

export const SkillModifierTemplateSchema = IModelSchema.extend({
  type: z.literal(ModifierTypes.skill),
  level: z.number().optional(),
  target: z.string(),
  value: z.union([z.string(), z.number()]),
});

export const ModifierTemplateSchema = z.discriminatedUnion("type", [
  ArmorProficiencyModifierSchema,
  AbilityModifierSchema,
  ClassSkillModifierSchema,
  FeatModifierSchema,
  RankSkillModifierSchema,
  SimpleModifierTemplateSchema,
  SavingThrowModifierSchema,
  SavingThrowBonusModifierSchema,
  SkillModifierTemplateSchema,
  SpellModifierSchema,
  WeaponProficiencyModifierSchema,
]);

export type ModifierTemplate = z.infer<typeof ModifierTemplateSchema>;

export function isModifierTemplate(obj: unknown): obj is ModifierTemplate {
  return ModifierTemplateSchema.safeParse(obj).success;
}

import { z } from "zod";
import { ArmorIdSchema } from "./Armor";
import { DescriptionSchema, IdSchema } from "./helper";
import { IModelSchema } from "./IModel";
import { ModifierTypes } from "./ModifierType";
import { SavingThrowId } from "./SavingThrow";
import { WeaponId } from "./Weapon";

export const AbilityModifier = IModelSchema.extend({
  type: z.literal(ModifierTypes.ability),
  level: z.number().optional(),
  name: z.string(),
  description: DescriptionSchema,
}).strict();

export const ArmorProficiencyModifier = IModelSchema.extend({
  type: z.literal(ModifierTypes.armorProficiency),
  level: z.number().optional(),
  target: ArmorIdSchema,
}).strict();

export const ClassSkillModifier = IModelSchema.extend({
  type: z.literal(ModifierTypes.classSkill),
  level: z.number().optional(),
  target: z.string(),
}).strict();

export const FeatModifier = IModelSchema.extend({
  type: z.literal(ModifierTypes.feat),
  level: z.number().optional(),
  feat: IdSchema,
  target: z.string().optional(),
  extra: z.string().optional(),
}).strict();

export type FeatModifier = z.infer<typeof FeatModifier>;

export const RankSkillModifier = IModelSchema.extend({
  type: z.literal(ModifierTypes.rankSkill),
  level: z.number().optional(),
  target: z.string(),
}).strict();

export const SavingThrowModifier = IModelSchema.extend({
  type: z.literal(ModifierTypes.savingThrow),
  level: z.number().optional(),
  name: z.string(),
  description: DescriptionSchema,
}).strict();

export const SavingThrowBonusModifier = IModelSchema.extend({
  type: z.literal(ModifierTypes.savingThrowBonus),
  level: z.number().optional(),
  target: SavingThrowId,
  value: z.number(),
}).strict();

export const SpellModifier = IModelSchema.extend({
  type: z.literal(ModifierTypes.spell),
  level: z.number().optional(),
  target: z.string(),
  extra: z.string().optional(),
}).strict();

export const WeaponProficiencyModifier = IModelSchema.extend({
  type: z.literal(ModifierTypes.weaponProficiency),
  level: z.number().optional(),
  target: WeaponId,
}).strict();

export const SimpleModifierTemplate = IModelSchema.extend({
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

export const SkillModifierTemplate = IModelSchema.extend({
  type: z.literal(ModifierTypes.skill),
  level: z.number().optional(),
  target: z.string(),
  value: z.union([z.string(), z.number()]),
});

export const ModifierTemplate = z.discriminatedUnion("type", [
  ArmorProficiencyModifier,
  AbilityModifier,
  ClassSkillModifier,
  FeatModifier,
  RankSkillModifier,
  SimpleModifierTemplate,
  SavingThrowModifier,
  SavingThrowBonusModifier,
  SkillModifierTemplate,
  SpellModifier,
  WeaponProficiencyModifier,
]);

export type ModifierTemplate = z.infer<typeof ModifierTemplate>;

export function isModifierTemplate(obj: unknown): obj is ModifierTemplate {
  return ModifierTemplate.safeParse(obj).success;
}

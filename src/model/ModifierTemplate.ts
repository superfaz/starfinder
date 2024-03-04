import { z } from "zod";
import { ArmorIdSchema } from "./Armor";
import { DescriptionSchema, IdSchema } from "./helper";
import { IModel } from "./IModel";
import { ModifierTypes } from "./ModifierType";
import { SavingThrowId } from "./SavingThrow";
import { WeaponId } from "./Weapon";

export const AbilityModifier = IModel.extend({
  type: z.literal(ModifierTypes.ability),
  level: z.number().optional(),
  name: z.string(),
  description: DescriptionSchema,
}).strict();

export const ArmorProficiencyModifier = IModel.extend({
  type: z.literal(ModifierTypes.armorProficiency),
  level: z.number().optional(),
  target: ArmorIdSchema,
}).strict();

export const ClassSkillModifier = IModel.extend({
  type: z.literal(ModifierTypes.classSkill),
  level: z.number().optional(),
  target: z.string(),
}).strict();

export const FeatModifier = IModel.extend({
  type: z.literal(ModifierTypes.feat),
  level: z.number().optional(),
  feat: IdSchema,
  target: z.string().optional(),
  extra: z.string().optional(),
}).strict();

export type FeatModifier = z.infer<typeof FeatModifier>;

export const RankSkillModifier = IModel.extend({
  type: z.literal(ModifierTypes.rankSkill),
  level: z.number().optional(),
  target: z.string(),
}).strict();

export const SavingThrowModifier = IModel.extend({
  type: z.literal(ModifierTypes.savingThrow),
  level: z.number().optional(),
  name: z.string(),
  description: DescriptionSchema,
}).strict();

export const SavingThrowBonusModifier = IModel.extend({
  type: z.literal(ModifierTypes.savingThrowBonus),
  level: z.number().optional(),
  target: SavingThrowId,
  value: z.number(),
}).strict();

export const SpellModifier = IModel.extend({
  type: z.literal(ModifierTypes.spell),
  level: z.number().optional(),
  target: z.string(),
  extra: z.string().optional(),
}).strict();

export const WeaponProficiencyModifier = IModel.extend({
  type: z.literal(ModifierTypes.weaponProficiency),
  level: z.number().optional(),
  target: WeaponId,
}).strict();

export const SimpleModifierTemplate = IModel.extend({
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

export const SkillModifierTemplate = IModel.extend({
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

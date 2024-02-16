import { z } from "zod";
import { ArmorId } from "./Armor";
import { Description, Id } from "./helper";
import { IModel } from "./IModel";
import { ModifierType } from "./ModifierType";
import { SavingThrowId } from "./SavingThrow";
import { WeaponId } from "./Weapon";

export const AbilityModifier = IModel.extend({
  type: z.literal(ModifierType.enum.ability),
  level: z.number().optional(),
  name: z.string(),
  description: Description,
}).strict();

export const ArmorProficiencyModifier = IModel.extend({
  type: z.literal(ModifierType.enum.armorProficiency),
  level: z.number().optional(),
  target: ArmorId,
}).strict();

export const ClassSkillModifier = IModel.extend({
  type: z.literal(ModifierType.enum.classSkill),
  level: z.number().optional(),
  target: z.string(),
}).strict();

export const FeatModifier = IModel.extend({
  type: z.literal(ModifierType.enum.feat),
  level: z.number().optional(),
  feat: Id,
  target: z.string().optional(),
  extra: z.string().optional(),
}).strict();

export type FeatModifier = z.infer<typeof FeatModifier>;

export const RankSkillModifier = IModel.extend({
  type: z.literal(ModifierType.enum.rankSkill),
  level: z.number().optional(),
  target: z.string(),
}).strict();

export const SavingThrowModifier = IModel.extend({
  type: z.literal(ModifierType.enum.savingThrow),
  level: z.number().optional(),
  name: z.string(),
  description: Description,
}).strict();

export const SavingThrowBonusModifier = IModel.extend({
  type: z.literal(ModifierType.enum.savingThrowBonus),
  level: z.number().optional(),
  target: SavingThrowId,
  value: z.number(),
}).strict();

export const SpellModifier = IModel.extend({
  type: z.literal(ModifierType.enum.spell),
  level: z.number().optional(),
  target: z.string(),
  extra: z.string().optional(),
}).strict();

export const WeaponProficiencyModifier = IModel.extend({
  type: z.literal(ModifierType.enum.weaponProficiency),
  level: z.number().optional(),
  target: WeaponId,
}).strict();

export const SimpleModifierTemplate = IModel.extend({
  type: z.enum([
    ModifierType.enum.attack,
    ModifierType.enum.featCount,
    ModifierType.enum.hitPoints,
    ModifierType.enum.initiative,
    ModifierType.enum.languageCount,
    ModifierType.enum.rank,
    ModifierType.enum.resolve,
    ModifierType.enum.speed,
    ModifierType.enum.stamina,
  ]),
  level: z.number().optional(),
  value: z.union([z.string(), z.number()]),
});

export const SkillModifierTemplate = IModel.extend({
  type: z.literal(ModifierType.enum.skill),
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

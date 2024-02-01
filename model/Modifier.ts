import { z } from "zod";
import { ArmorId } from "./Armor";
import { IModel } from "./IModel";
import { Description, Id } from "./helper";
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

export const SimpleModifier = IModel.extend({
  type: z.enum([
    ModifierType.enum.attack,
    ModifierType.enum.languageCount,
    ModifierType.enum.rank,
    ModifierType.enum.speed,
  ]),
  level: z.number().optional(),
  value: z.number(),
}).strict();

export const FeatCountModifier = SimpleModifier.extend({
  type: z.literal(ModifierType.enum.featCount),
}).strict();

export const HitPointsModifier = SimpleModifier.extend({
  type: z.literal(ModifierType.enum.hitPoints),
}).strict();

export const InitiativeModifier = SimpleModifier.extend({
  type: z.literal(ModifierType.enum.initiative),
}).strict();

export const ResolveModifier = SimpleModifier.extend({
  type: z.literal(ModifierType.enum.resolve),
}).strict();

export const StaminaModifier = SimpleModifier.extend({
  type: z.literal(ModifierType.enum.stamina),
}).strict();

export const SkillModifier = IModel.extend({
  type: z.literal(ModifierType.enum.skill),
  level: z.number().optional(),
  target: z.string(),
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

export const Modifier = z.discriminatedUnion("type", [
  AbilityModifier,
  ArmorProficiencyModifier,
  ClassSkillModifier,
  FeatModifier,
  FeatCountModifier,
  HitPointsModifier,
  InitiativeModifier,
  RankSkillModifier,
  ResolveModifier,
  SimpleModifier,
  SavingThrowModifier,
  SavingThrowBonusModifier,
  SkillModifier,
  SpellModifier,
  StaminaModifier,
  WeaponProficiencyModifier,
]);

export type Modifier = z.infer<typeof Modifier>;

export function isModifier(obj: unknown): obj is Modifier {
  return Modifier.safeParse(obj).success;
}

export function ofType<V extends Modifier["type"]>(val: V) {
  return (obj: Modifier): obj is Extract<Modifier, { type: V }> => obj.type === val;
}

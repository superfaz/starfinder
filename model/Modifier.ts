import { z } from "zod";
import { IModel } from "./IModel";
import { ModifierType } from "./ModifierType";
import { Description, Id } from "./helper";

export const AbilityModifier = IModel.extend({
  type: z.literal(ModifierType.enum.ability),
  level: z.number().optional(),
  name: z.string(),
  description: Description,
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
  target: z.string(),
  value: z.number(),
}).strict();

export const SimpleModifier = IModel.extend({
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
  value: z.number(),
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

export const Modifier = z.discriminatedUnion("type", [
  AbilityModifier,
  ClassSkillModifier,
  FeatModifier,
  RankSkillModifier,
  SimpleModifier,
  SavingThrowModifier,
  SavingThrowBonusModifier,
  SkillModifier,
  SpellModifier,
]);

export type Modifier = z.infer<typeof Modifier>;

export function isModifier(obj: unknown): obj is Modifier {
  return Modifier.safeParse(obj).success;
}

export function ofType<V extends Modifier["type"]>(val: V) {
  return (obj: Modifier): obj is Extract<Modifier, { type: V }> => obj.type === val;
}

export type ModifierWithValue = Extract<Modifier, { value: number }>;

export function hasValue(modifier: Modifier): modifier is ModifierWithValue {
  return Object.prototype.hasOwnProperty.call(modifier, "value");
}

export type ModifierWithName = Extract<Modifier, { name: string }>;

export function hasName(modifier: Modifier): modifier is ModifierWithName {
  return Object.prototype.hasOwnProperty.call(modifier, "name");
}

export type ModifierWithDescription = Extract<Modifier, { description: string }>;

export function hasDescription(modifier: Modifier): modifier is ModifierWithDescription {
  return Object.prototype.hasOwnProperty.call(modifier, "description");
}

export type ModifierWithExtra = Extract<Modifier, { extra?: string }>;

export function hasExtra(modifier: Modifier): modifier is ModifierWithExtra {
  return Object.prototype.hasOwnProperty.call(modifier, "extra");
}

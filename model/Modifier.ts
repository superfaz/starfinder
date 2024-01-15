import { z } from "zod";
import { IModel } from "./IModel";
import { ModifierType } from "./ModifierType";

export const AbilityModifier = IModel.extend({
  type: z.literal(ModifierType.enum.ability),
  level: z.number().optional(),
  name: z.string(),
  description: z.string(),
}).strict();

export const ClassSkillModifier = IModel.extend({
  type: z.literal(ModifierType.enum.classSkill),
  level: z.number().optional(),
  target: z.string(),
}).strict();

export const FeatModifier = IModel.extend({
  type: z.literal(ModifierType.enum.feat),
  level: z.number().optional(),
  name: z.string(),
}).strict();

export const FeatCountModifier = IModel.extend({
  type: z.literal(ModifierType.enum.featCount),
  level: z.number().optional(),
  value: z.number(),
}).strict();

export const HitPointsModifier = IModel.extend({
  type: z.literal(ModifierType.enum.hitPoints),
  level: z.number().optional(),
  value: z.number(),
}).strict();

export const InitiativeModifier = IModel.extend({
  type: z.literal(ModifierType.enum.initiative),
  level: z.number().optional(),
  value: z.number(),
}).strict();

export const LanguageCountModifier = IModel.extend({
  type: z.literal(ModifierType.enum.languageCount),
  level: z.number().optional(),
  value: z.number(),
}).strict();

export const SavingThrowModifier = IModel.extend({
  type: z.literal(ModifierType.enum.savingThrow),
  level: z.number().optional(),
  description: z.string(),
}).strict();

export const SkillModifier = IModel.extend({
  type: z.literal(ModifierType.enum.skill),
  level: z.number().optional(),
  target: z.string(),
  value: z.number(),
}).strict();

export const SkillRankModifier = IModel.extend({
  type: z.literal(ModifierType.enum.skillRank),
  level: z.number().optional(),
  target: z.string(),
}).strict();

export const SpellModifier = IModel.extend({
  type: z.literal(ModifierType.enum.spell),
  level: z.number().optional(),
  name: z.string(),
}).strict();

export const Modifier = z.discriminatedUnion("type", [
  AbilityModifier,
  ClassSkillModifier,
  FeatModifier,
  FeatCountModifier,
  HitPointsModifier,
  InitiativeModifier,
  LanguageCountModifier,
  SavingThrowModifier,
  SkillModifier,
  SkillRankModifier,
  SpellModifier,
]);

export type Modifier = z.infer<typeof Modifier>;

export function isModifier(obj: unknown): obj is Modifier {
  return Modifier.safeParse(obj).success;
}

export function ofType<V extends Modifier['type']>(val: V) {
  return (obj: Modifier):
      obj is Extract<Modifier, {type: V}> => obj.type === val;
}

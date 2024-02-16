import {
  AbilityModifier,
  ArmorProficiencyModifier,
  ClassSkillModifier,
  FeatModifier,
  IModel,
  ModifierType,
  RankSkillModifier,
  SavingThrowBonusModifier,
  SavingThrowModifier,
  SpellModifier,
  WeaponProficiencyModifier,
} from "model";
import { z } from "zod";

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

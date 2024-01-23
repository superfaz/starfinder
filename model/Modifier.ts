import { z } from "zod";
import { IModel } from "./IModel";
import { ModifierType } from "./ModifierType";
import { Description } from "./helper";

export const AbilityModifier = IModel.extend({
  type: z.literal(ModifierType.enum.ability),
  level: z.number().optional(),
  name: z.string(),
  description: Description,
});

export const ClassSkillModifier = IModel.extend({
  type: z.literal(ModifierType.enum.classSkill),
  level: z.number().optional(),
  target: z.string(),
});

export const FeatModifier = IModel.extend({
  type: z.literal(ModifierType.enum.feat),
  level: z.number().optional(),
  name: z.string(),
  target: z.string().optional(),
  extra: z.string().optional(),
});

export const RankSkillModifier = IModel.extend({
  type: z.literal(ModifierType.enum.rankSkill),
  level: z.number().optional(),
  target: z.string(),
});

export const SimpleModifier = IModel.extend({
  type: z.enum([
    ModifierType.enum.featCount,
    ModifierType.enum.hitPoints,
    ModifierType.enum.initiative,
    ModifierType.enum.languageCount,
    ModifierType.enum.rank,
    ModifierType.enum.speed,
  ]),
  level: z.number().optional(),
  value: z.number(),
});

export const SavingThrowModifier = IModel.extend({
  type: z.literal(ModifierType.enum.savingThrow),
  level: z.number().optional(),
  name: z.string(),
  description: Description,
});

export const SkillModifier = IModel.extend({
  type: z.literal(ModifierType.enum.skill),
  level: z.number().optional(),
  target: z.string(),
  value: z.number(),
});

export const SpellModifier = IModel.extend({
  type: z.literal(ModifierType.enum.spell),
  level: z.number().optional(),
  name: z.string(),
  extra: z.string().optional(),
});

export const Modifier = z.discriminatedUnion("type", [
  AbilityModifier,
  ClassSkillModifier,
  FeatModifier,
  RankSkillModifier,
  SimpleModifier,
  SavingThrowModifier,
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

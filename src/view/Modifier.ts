import {
  AbilityModifierSchema,
  ArmorProficiencyModifierSchema,
  ClassSkillModifierSchema,
  DamageTypeIdSchema,
  FeatModifierSchema,
  IModelSchema,
  ModifierTypes,
  RankSkillModifierSchema,
  SavingThrowBonusModifierSchema,
  SavingThrowModifierSchema,
  SpellModifierSchema,
  WeaponProficiencyModifierSchema,
} from "model";
import { z } from "zod";

export const SimpleModifier = IModelSchema.extend({
  type: z.enum([
    ModifierTypes.attack,
    ModifierTypes.armorClass,
    ModifierTypes.languageCount,
    ModifierTypes.rank,
    ModifierTypes.speed,
  ]),
  level: z.number().optional(),
  value: z.number(),
}).strict();

export const FeatCountModifier = SimpleModifier.extend({
  type: z.literal(ModifierTypes.featCount),
}).strict();

export const HitPointsModifier = SimpleModifier.extend({
  type: z.literal(ModifierTypes.hitPoints),
}).strict();

export const InitiativeModifier = SimpleModifier.extend({
  type: z.literal(ModifierTypes.initiative),
}).strict();

export const ResolveModifier = SimpleModifier.extend({
  type: z.literal(ModifierTypes.resolve),
}).strict();

export const StaminaModifier = SimpleModifier.extend({
  type: z.literal(ModifierTypes.stamina),
}).strict();

export const SkillModifier = IModelSchema.extend({
  type: z.literal(ModifierTypes.skill),
  level: z.number().optional(),
  target: z.string(),
  value: z.number(),
}).strict();

export const ResistanceModifier = IModelSchema.extend({
  type: z.literal(ModifierTypes.resistance),
  level: z.number().optional(),
  targets: z.array(DamageTypeIdSchema),
  value: z.number(),
}).strict();

export const Modifier = z.discriminatedUnion("type", [
  AbilityModifierSchema,
  ArmorProficiencyModifierSchema,
  ClassSkillModifierSchema,
  FeatModifierSchema,
  FeatCountModifier,
  HitPointsModifier,
  InitiativeModifier,
  RankSkillModifierSchema,
  ResistanceModifier,
  ResolveModifier,
  SimpleModifier,
  SavingThrowModifierSchema,
  SavingThrowBonusModifierSchema,
  SkillModifier,
  SpellModifierSchema,
  StaminaModifier,
  WeaponProficiencyModifierSchema,
]);

export type Modifier = z.infer<typeof Modifier>;

export function isModifier(obj: unknown): obj is Modifier {
  return Modifier.safeParse(obj).success;
}

export function ofType<V extends Modifier["type"]>(val: V) {
  return (obj: Modifier): obj is Extract<Modifier, { type: V }> => obj.type === val;
}

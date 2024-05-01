import {
  AbilityModifierSchema,
  ArmorProficiencyModifierSchema,
  ClassSkillModifierSchema,
  DamageModifierSchema,
  DamageTypeIdSchema,
  EquipmentWeaponSchema,
  FeatModifierSchema,
  IModelSchema,
  ModifierTypes,
  RankSkillModifierSchema,
  SavingThrowIdSchema,
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

export const EquipmentModifier = IModelSchema.extend({
  type: z.literal(ModifierTypes.equipment),
  level: z.number().optional(),
  equipment: EquipmentWeaponSchema,
}).strict();

export type EquipmentModifier = z.infer<typeof EquipmentModifier>;

export const FeatCountModifier = SimpleModifier.extend({
  type: z.literal(ModifierTypes.featCount),
}).strict();

export const HitPointsModifier = SimpleModifier.extend({
  type: z.literal(ModifierTypes.hitPoints),
}).strict();

export const InitiativeModifier = SimpleModifier.extend({
  type: z.literal(ModifierTypes.initiative),
}).strict();

export const ResistanceModifier = IModelSchema.extend({
  type: z.literal(ModifierTypes.resistance),
  level: z.number().optional(),
  targets: z.array(DamageTypeIdSchema),
  value: z.number(),
}).strict();

export const ResolveModifier = SimpleModifier.extend({
  type: z.literal(ModifierTypes.resolve),
}).strict();

export const SavingThrowBonusModifier = IModelSchema.extend({
  type: z.literal(ModifierTypes.savingThrowBonus),
  level: z.number().optional(),
  target: SavingThrowIdSchema,
  value: z.number(),
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

export const Modifier = z.discriminatedUnion("type", [
  AbilityModifierSchema,
  ArmorProficiencyModifierSchema,
  DamageModifierSchema,
  ClassSkillModifierSchema,
  EquipmentModifier,
  FeatModifierSchema,
  FeatCountModifier,
  HitPointsModifier,
  InitiativeModifier,
  RankSkillModifierSchema,
  ResistanceModifier,
  ResolveModifier,
  SimpleModifier,
  SavingThrowModifierSchema,
  SavingThrowBonusModifier,
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

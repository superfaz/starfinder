import {
  AbilityModifierSchema,
  ArmorProficiencyModifierSchema,
  BonusCategoryIdSchema,
  ClassSkillModifierSchema,
  DamageTypeIdSchema,
  EquipmentWeaponSchema,
  FeatModifierSchema,
  IModelSchema,
  ModifierTypes,
  RankSkillModifierSchema,
  SavingThrowIdSchema,
  SavingThrowModifierSchema,
  SizeModifierSchema,
  SpellModifierSchema,
  WeaponProficiencyModifierSchema,
  WeaponTypeIdSchema,
} from "model";
import { z } from "zod";

const BaseModifier = IModelSchema.extend({
  level: z.number().optional(),
  value: z.coerce.number(),
});

export const AttackModifier = BaseModifier.extend({
  type: z.literal(ModifierTypes.attack),
  category: BonusCategoryIdSchema,
  target: z.optional(WeaponTypeIdSchema),
}).strict();

export const ArmorClassModifier = BaseModifier.extend({
  type: z.literal(ModifierTypes.armorClass),
  category: BonusCategoryIdSchema,
}).strict();

export const DamageModifier = BaseModifier.extend({
  type: z.literal(ModifierTypes.damage),
  target: WeaponTypeIdSchema,
  category: BonusCategoryIdSchema,
}).strict();

export const FeatCountModifier = BaseModifier.extend({
  type: z.literal(ModifierTypes.featCount),
}).strict();

export const HitPointsModifier = BaseModifier.extend({
  type: z.literal(ModifierTypes.hitPoints),
}).strict();

export const InitiativeModifier = BaseModifier.extend({
  type: z.literal(ModifierTypes.initiative),
  category: BonusCategoryIdSchema,
}).strict();

export const LanguageCountModifier = BaseModifier.extend({
  type: z.literal(ModifierTypes.languageCount),
}).strict();

export const RankModifier = BaseModifier.extend({
  type: z.literal(ModifierTypes.rank),
}).strict();

export const ResistanceModifier = BaseModifier.extend({
  type: z.literal(ModifierTypes.resistance),
  targets: z.array(DamageTypeIdSchema),
  category: BonusCategoryIdSchema,
}).strict();

export const ResolveModifier = BaseModifier.extend({
  type: z.literal(ModifierTypes.resolve),
}).strict();

export const SavingThrowBonusModifier = BaseModifier.extend({
  type: z.literal(ModifierTypes.savingThrowBonus),
  target: SavingThrowIdSchema.optional(),
  category: BonusCategoryIdSchema,
}).strict();

export const StaminaModifier = BaseModifier.extend({
  type: z.literal(ModifierTypes.stamina),
}).strict();

export const SkillModifier = BaseModifier.extend({
  type: z.literal(ModifierTypes.skill),
  target: z.string(),
  category: BonusCategoryIdSchema,
}).strict();

export const SpeedModifier = BaseModifier.extend({
  type: z.literal(ModifierTypes.speed),
}).strict();

export const EquipmentModifier = IModelSchema.extend({
  type: z.literal(ModifierTypes.equipment),
  level: z.number().optional(),
  equipment: EquipmentWeaponSchema,
}).strict();

export type EquipmentModifier = z.infer<typeof EquipmentModifier>;

export const Modifier = z.discriminatedUnion("type", [
  AttackModifier,
  ArmorClassModifier,
  LanguageCountModifier,
  RankModifier,
  AbilityModifierSchema,
  ArmorProficiencyModifierSchema,
  DamageModifier,
  ClassSkillModifierSchema,
  EquipmentModifier,
  FeatModifierSchema,
  FeatCountModifier,
  HitPointsModifier,
  InitiativeModifier,
  RankSkillModifierSchema,
  ResistanceModifier,
  ResolveModifier,
  SavingThrowModifierSchema,
  SavingThrowBonusModifier,
  SizeModifierSchema,
  SkillModifier,
  SpeedModifier,
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

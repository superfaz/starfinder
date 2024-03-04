import { z } from "zod";
import { ArmorTypeIdSchema } from "./ArmorType";
import { AbilityScoreIdSchema } from "./AbilityScore";
import { IModelSchema } from "./IModel";
import { PrerequisiteTypes } from "./PrerequisiteType";
import { WeaponTypeIdSchema } from "./WeaponType";
import { VariableSchema } from "./helper";
import { SavingThrowIdSchema } from "./SavingThrow";

export const AbilityScorePrerequisiteSchema = IModelSchema.extend({
  type: z.literal(PrerequisiteTypes.abilityScore),
  target: z.union([AbilityScoreIdSchema, z.literal("<primary>")]),
  value: z.number(),
}).strict();

export const ArmorProficiencyPrerequisiteSchema = IModelSchema.extend({
  type: z.literal(PrerequisiteTypes.armorProficiency),
  target: ArmorTypeIdSchema,
}).strict();

export const ClassPrerequisiteSchema = IModelSchema.extend({
  type: z.literal(PrerequisiteTypes.class),
  target: z.string(),
  specialization: z.string().optional(),
}).strict();

export const FeatPrerequisiteSchema = IModelSchema.extend({
  type: z.literal(PrerequisiteTypes.feat),
  target: z.string(),
}).strict();

export const SavingThrowPrerequisiteSchema = IModelSchema.extend({
  type: z.literal(PrerequisiteTypes.savingThrow),
  target: SavingThrowIdSchema,
  value: z.number(),
}).strict();

export const SpellCasterPrerequisiteSchema = IModelSchema.extend({
  type: z.literal(PrerequisiteTypes.spellCaster),
}).strict();

export const NotSpellCasterPrerequisiteSchema = IModelSchema.extend({
  type: z.literal(PrerequisiteTypes.notSpellCaster),
}).strict();

export const SimplePrerequisiteSchema = IModelSchema.extend({
  type: z.enum([
    PrerequisiteTypes.arms,
    PrerequisiteTypes.baseAttack,
    PrerequisiteTypes.combatFeatCount,
    PrerequisiteTypes.level,
    PrerequisiteTypes.spellCasterLevel,
  ]),
  value: z.number(),
}).strict();

export const SkillRankPrerequisiteSchema = IModelSchema.extend({
  type: z.literal(PrerequisiteTypes.skillRank),
  target: z.string(),
  value: z.number(),
}).strict();

export const WeaponProficiencyPrerequisiteSchema = IModelSchema.extend({
  type: z.literal(PrerequisiteTypes.weaponProficiency),
  target: z.union([WeaponTypeIdSchema, VariableSchema]),
}).strict();

export const PrerequisiteSchema = z.discriminatedUnion("type", [
  AbilityScorePrerequisiteSchema,
  ArmorProficiencyPrerequisiteSchema,
  ClassPrerequisiteSchema,
  FeatPrerequisiteSchema,
  NotSpellCasterPrerequisiteSchema,
  SavingThrowPrerequisiteSchema,
  SimplePrerequisiteSchema,
  SkillRankPrerequisiteSchema,
  SpellCasterPrerequisiteSchema,
  WeaponProficiencyPrerequisiteSchema,
]);

export type Prerequisite = z.infer<typeof PrerequisiteSchema>;

export function isPrerequisite(data: unknown): data is Prerequisite {
  return PrerequisiteSchema.safeParse(data).success;
}

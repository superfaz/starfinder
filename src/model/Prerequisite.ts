import { z } from "zod";
import { ArmorIdSchema } from "./Armor";
import { AbilityScoreIdSchema } from "./AbilityScore";
import { IModel } from "./IModel";
import { PrerequisiteTypes } from "./PrerequisiteType";
import { WeaponId } from "./Weapon";
import { VariableSchema } from "./helper";
import { SavingThrowId } from "./SavingThrow";

export const AbilityScorePrerequisite = IModel.extend({
  type: z.literal(PrerequisiteTypes.abilityScore),
  target: z.union([AbilityScoreIdSchema, z.literal("<primary>")]),
  value: z.number(),
}).strict();

export const ArmorProficiencyPrerequisite = IModel.extend({
  type: z.literal(PrerequisiteTypes.armorProficiency),
  target: ArmorIdSchema,
}).strict();

export const ClassPrerequisite = IModel.extend({
  type: z.literal(PrerequisiteTypes.class),
  target: z.string(),
  specialization: z.string().optional(),
}).strict();

export const FeatPrerequisite = IModel.extend({
  type: z.literal(PrerequisiteTypes.feat),
  target: z.string(),
}).strict();

export const SavingThrowPrerequisite = IModel.extend({
  type: z.literal(PrerequisiteTypes.savingThrow),
  target: SavingThrowId,
  value: z.number(),
}).strict();

export const SpellCasterPrerequisite = IModel.extend({
  type: z.literal(PrerequisiteTypes.spellCaster),
}).strict();

export const NotSpellCasterPrerequisite = IModel.extend({
  type: z.literal(PrerequisiteTypes.notSpellCaster),
}).strict();

export const SimplePrerequisite = IModel.extend({
  type: z.enum([
    PrerequisiteTypes.arms,
    PrerequisiteTypes.baseAttack,
    PrerequisiteTypes.combatFeatCount,
    PrerequisiteTypes.level,
    PrerequisiteTypes.spellCasterLevel,
  ]),
  value: z.number(),
}).strict();

export const SkillRankPrerequisite = IModel.extend({
  type: z.literal(PrerequisiteTypes.skillRank),
  target: z.string(),
  value: z.number(),
}).strict();

export const WeaponProficiencyPrerequisite = IModel.extend({
  type: z.literal(PrerequisiteTypes.weaponProficiency),
  target: z.union([WeaponId, VariableSchema]),
}).strict();

export const Prerequisite = z.discriminatedUnion("type", [
  AbilityScorePrerequisite,
  ArmorProficiencyPrerequisite,
  ClassPrerequisite,
  FeatPrerequisite,
  NotSpellCasterPrerequisite,
  SavingThrowPrerequisite,
  SimplePrerequisite,
  SkillRankPrerequisite,
  SpellCasterPrerequisite,
  WeaponProficiencyPrerequisite,
]);

export type Prerequisite = z.infer<typeof Prerequisite>;

export function isPrerequisite(data: unknown): data is Prerequisite {
  return Prerequisite.safeParse(data).success;
}

import { z } from "zod";
import { AbilityScoreId } from "./AbilityScore";
import { IModel } from "./IModel";
import { PrerequisiteType } from "./PrerequisiteType";

export const AbilityScorePrerequisite = IModel.extend({
  type: z.literal(PrerequisiteType.enum.abilityScore),
  target: z.union([AbilityScoreId, z.literal("<primary>")]),
  value: z.number(),
}).strict();

export const ClassPrerequisite = IModel.extend({
  type: z.literal(PrerequisiteType.enum.class),
  target: z.string(),
  specialization: z.string().optional(),
}).strict();

export const FeatPrerequisite = IModel.extend({
  type: z.literal(PrerequisiteType.enum.feat),
  target: z.string(),
}).strict();

export const SavingThrowPrerequisite = IModel.extend({
  type: z.literal(PrerequisiteType.enum.savingThrow),
  target: z.string(),
  value: z.number(),
}).strict();

export const SimplePrerequisite = IModel.extend({
  type: z.enum([
    PrerequisiteType.enum.attackBase,
    PrerequisiteType.enum.arms,
    PrerequisiteType.enum.combatFeatCount,
    PrerequisiteType.enum.level,
    PrerequisiteType.enum.spellCasterLevel,
  ]),
  value: z.number(),
}).strict();

export const SkillRankPrerequisite = IModel.extend({
  type: z.literal(PrerequisiteType.enum.skillRank),
  target: z.string(),
  value: z.number(),
}).strict();

export const WeaponProficiencyPrerequisite = IModel.extend({
  type: z.literal(PrerequisiteType.enum.weaponProficiency),
  target: z.string(),
}).strict();

export const Prerequisite = z.discriminatedUnion("type", [
  AbilityScorePrerequisite,
  ClassPrerequisite,
  FeatPrerequisite,
  SavingThrowPrerequisite,
  SimplePrerequisite,
  SkillRankPrerequisite,
  WeaponProficiencyPrerequisite,
]);

export type Prerequisite = z.infer<typeof Prerequisite>;

export function isPrerequisite(data: unknown): data is Prerequisite {
  return Prerequisite.safeParse(data).success;
}

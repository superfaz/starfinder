import { z } from "zod";
import { INamedModel } from "./INamedModel";
import { Description, Reference } from "./helper";
import { Prerequisite } from "./Prerequisite";
import { ModifierTemplate } from "./ModifierTemplate";

const BaseFeatTemplate = INamedModel.extend({
  /**
   * If true, the feat will not be shown in the feat list.
   */
  hidden: z.boolean().default(false),
  combatFeat: z.boolean().default(false),
  description: Description,
  reference: Reference,
  modifiers: z.array(ModifierTemplate),
  prerequisites: z.array(Prerequisite).optional(),
});

export const FeatTargetType = z.enum([
  "combatManeuver",
  "energyDamageType",
  "kineticDamageType",
  "skill",
  "specialMeleeWeapon",
  "specialRangedWeapon",
  "spell",
  "spellLevel0",
  "spellLevel1",
  "spellLevel2",
  "weapon",
]);

export type FeatTargetType = z.infer<typeof FeatTargetType>;

export const FeatTargetTypes = FeatTargetType.enum;

export const MultipleFeatTemplate = BaseFeatTemplate.extend({
  type: z.literal("multiple"),
  targetType: FeatTargetType,
});

export type MultipleFeatTemplate = z.infer<typeof MultipleFeatTemplate>;

export const TargetedFeatTemplate = BaseFeatTemplate.extend({
  type: z.literal("targeted"),
  targetType: FeatTargetType,
});

export type TargetedFeatTemplate = z.infer<typeof TargetedFeatTemplate>;

export const SimpleFeatTemplate = BaseFeatTemplate.extend({
  type: z.literal("simple"),
});

export type SimpleFeatTemplate = z.infer<typeof SimpleFeatTemplate>;

export const FeatTemplate = z.discriminatedUnion("type", [
  SimpleFeatTemplate,
  TargetedFeatTemplate,
  MultipleFeatTemplate,
]);

export type FeatTemplate = z.infer<typeof FeatTemplate>;

export function isMultipleFeatTemplate(data: unknown): data is MultipleFeatTemplate {
  return MultipleFeatTemplate.safeParse(data).success;
}

export function isTargetedFeatTemplate(data: unknown): data is TargetedFeatTemplate {
  return TargetedFeatTemplate.safeParse(data).success;
}

export function isSimpleFeatTemplate(data: unknown): data is SimpleFeatTemplate {
  return SimpleFeatTemplate.safeParse(data).success;
}

export function isFeatTemplate(data: unknown): data is FeatTemplate {
  return FeatTemplate.safeParse(data).success;
}

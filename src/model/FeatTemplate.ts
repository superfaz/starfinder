import { z } from "zod";
import { PrerequisiteSchema } from "./Prerequisite";
import { ModifierTemplateSchema } from "./ModifierTemplate";
import { IEntrySchema } from "./IEntry";

const BaseFeatTemplateSchema = IEntrySchema.extend({
  /**
   * If true, the feat will not be shown in the feat list.
   */
  hidden: z.boolean().default(false),
  combatFeat: z.boolean().default(false),
  modifiers: z.array(ModifierTemplateSchema),
  prerequisites: z.array(PrerequisiteSchema).optional(),
});

export const FeatTargetTypeSchema = z.enum([
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

export type FeatTargetType = z.infer<typeof FeatTargetTypeSchema>;

export const FeatTargetTypes = FeatTargetTypeSchema.enum;

export const MultipleFeatTemplateSchema = BaseFeatTemplateSchema.extend({
  type: z.literal("multiple"),
  targetType: FeatTargetTypeSchema,
});

export type MultipleFeatTemplate = z.infer<typeof MultipleFeatTemplateSchema>;

export const TargetedFeatTemplateSchema = BaseFeatTemplateSchema.extend({
  type: z.literal("targeted"),
  targetType: FeatTargetTypeSchema,
});

export type TargetedFeatTemplate = z.infer<typeof TargetedFeatTemplateSchema>;

export const SimpleFeatTemplateSchema = BaseFeatTemplateSchema.extend({
  type: z.literal("simple"),
});

export type SimpleFeatTemplate = z.infer<typeof SimpleFeatTemplateSchema>;

export const FeatTemplateSchema = z.discriminatedUnion("type", [
  SimpleFeatTemplateSchema,
  TargetedFeatTemplateSchema,
  MultipleFeatTemplateSchema,
]);

export type FeatTemplate = z.infer<typeof FeatTemplateSchema>;

export function isMultipleFeatTemplate(data: unknown): data is MultipleFeatTemplate {
  return MultipleFeatTemplateSchema.safeParse(data).success;
}

export function isTargetedFeatTemplate(data: unknown): data is TargetedFeatTemplate {
  return TargetedFeatTemplateSchema.safeParse(data).success;
}

export function isSimpleFeatTemplate(data: unknown): data is SimpleFeatTemplate {
  return SimpleFeatTemplateSchema.safeParse(data).success;
}

export function isFeatTemplate(data: unknown): data is FeatTemplate {
  return FeatTemplateSchema.safeParse(data).success;
}

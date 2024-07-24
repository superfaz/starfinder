import { z } from "zod";
import { FeatureTemplateSchema } from "./FeatureTemplate";
import { IModelSchema } from "./IModel";
import { DescriptionSchema, ReferenceSchema } from "./helper";
import { INamedModelSchema } from "./INamedModel";
import { ModifierTemplateSchema } from "./ModifierTemplate";
import { AbilityScoreIdSchema } from "./AbilityScore";
import { SavingThrowIdSchema } from "./SavingThrow";

export const DroneModifierTypeSchema = z.enum([
  "ability",
  "abilityScore",
  "armorClass",
  "classSkill",
  "droneWeapon",
  "rankSkill",
  "resistance",
  "resolve",
  "size",
  "skill",
  "speed",
]);

export const DroneModifierTemplateSchema = ModifierTemplateSchema.extend({ type: DroneModifierTypeSchema });

export type DroneModifierTemplate = z.infer<typeof DroneModifierTemplateSchema>;

export const DroneFeatureTemplateSchema = FeatureTemplateSchema.extend({
  modifiers: z.optional(z.array(DroneModifierTemplateSchema)),
});

export const DroneChassisIdSchema = z.enum(["combat", "hover", "stealth"]);

export const DroneChassisSchema = INamedModelSchema.extend({
  id: DroneChassisIdSchema,
  reference: ReferenceSchema,
  description: DescriptionSchema,
  armorClasses: z.object({ energy: z.number().int().positive(), kynetic: z.number().int().positive() }),
  modifiers: z.optional(z.array(DroneModifierTemplateSchema)),
  abilityScores: z.record(AbilityScoreIdSchema, z.number()),
  savingThrows: z.record(SavingThrowIdSchema, z.enum(["good", "poor"])),
  primaryAbilityScores: z.array(AbilityScoreIdSchema),
}).strict();

export type DroneChassis = z.infer<typeof DroneChassisSchema>;

export const ClassMechanicStyleSchema = INamedModelSchema.extend({
  reference: ReferenceSchema,
  description: DescriptionSchema,
  features: z.optional(z.array(FeatureTemplateSchema)),
}).strict();

export const ClassMechanicSchema = IModelSchema.extend({
  id: z.string(),
  features: z.array(FeatureTemplateSchema),
  drone: z
    .object({
      chassis: z.array(DroneChassisSchema),
      features: z.array(DroneFeatureTemplateSchema),
      mods: z.array(DroneFeatureTemplateSchema),
    })
    .strict(),
  styles: z.array(ClassMechanicStyleSchema),
});

export type ClassMechanic = z.infer<typeof ClassMechanicSchema>;

export function isClassMechanic(data: unknown): data is ClassMechanic {
  return ClassMechanicSchema.safeParse(data).success;
}

export function asClassMechanic(data: unknown): ClassMechanic {
  return ClassMechanicSchema.parse(data);
}

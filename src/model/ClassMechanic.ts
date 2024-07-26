import { z } from "zod";
import { FeatureTemplateSchema } from "./FeatureTemplate";
import { IModelSchema } from "./IModel";
import { DescriptionSchema, ReferenceSchema } from "./helper";
import { INamedModelSchema } from "./INamedModel";
import { AbilityScoreIdSchema } from "./AbilityScore";
import { ClassSkillModifierSchema, RankSkillModifierSchema, SizeModifierSchema } from "./Modifier";
import { ModifierTemplateSchema } from "./ModifierTemplate";

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

export const DroneModifierSchema = z.discriminatedUnion("type", [
  ClassSkillModifierSchema,
  RankSkillModifierSchema,
  SizeModifierSchema,
]);

export const DroneFeatureTemplateSchema = FeatureTemplateSchema.extend({
  modifiers: z.optional(z.array(DroneModifierTemplateSchema)),
});

export const DroneChassisIdSchema = z.enum(["combat", "hover", "stealth"]);

export const DroneChassisSchema = INamedModelSchema.extend({
  id: DroneChassisIdSchema,
  reference: ReferenceSchema,
  description: DescriptionSchema,
  armorClasses: z.object({ energy: z.number().int().positive(), kinetic: z.number().int().positive() }),
  modifiers: z.optional(z.array(DroneModifierSchema)),
  abilityScores: z.record(AbilityScoreIdSchema, z.number()),
  savingThrows: z.object({
    fortitude: z.enum(["good", "poor"]),
    reflex: z.enum(["good", "poor"]),
    will: z.enum(["good", "poor"]),
  }),
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

import { z } from "zod";
import { INamedModelSchema } from "./INamedModel";
import { LevelSchema, ReferenceSchema } from "./helper";

export const EquipmentTypeSchema = z.enum([
  "weaponAmmunition",
  "weaponSolarian",
  "weaponMelee",
  "weaponRanged",
  "weaponGrenade",
  "armor",
  "other",
]);

export type EquipmentType = z.infer<typeof EquipmentTypeSchema>;

export const EquipmentTypes = EquipmentTypeSchema.enum;

export const EquipmentBaseSchema = INamedModelSchema.extend({
  reference: ReferenceSchema,
  level: LevelSchema,
  cost: z.number().int().positive().optional(),
  weight: z.union([z.literal("F"), z.number().positive()]).optional(),
});

export type EquipmentBase = z.infer<typeof EquipmentBaseSchema>;

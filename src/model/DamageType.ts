import { z } from "zod";
import { ICodedModel } from "./ICodedModel";

export const DamageTypeIdSchema = z.enum([
  "bludgeoning",
  "piercing",
  "slashing",
  "acid",
  "cold",
  "electricity",
  "fire",
  "sonic",
]);

export type DamageTypeId = z.infer<typeof DamageTypeIdSchema>;

export const DamageTypeSchema = ICodedModel.extend({
  id: DamageTypeIdSchema,
  category: z.enum(["kinetic", "energy"]),
});

export type DamageType = z.infer<typeof DamageTypeSchema>;

export const DamageTypeIds = DamageTypeIdSchema.enum;

export function isDamageType(obj: unknown): obj is DamageType {
  return DamageTypeSchema.safeParse(obj).success;
}

export function isDamageTypeId(obj: unknown): obj is DamageTypeId {
  return DamageTypeIdSchema.safeParse(obj).success;
}

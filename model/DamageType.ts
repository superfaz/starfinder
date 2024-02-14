import { z } from "zod";
import { ICodedModel } from "./ICodedModel";

export const DamageTypeId = z.enum([
  "bludgeoning",
  "piercing",
  "slashing",
  "acid",
  "cold",
  "electricity",
  "fire",
  "sonic",
]);

export type DamageTypeId = z.infer<typeof DamageTypeId>;

export const DamageType = ICodedModel.extend({
  id: DamageTypeId,
  category: z.enum(["kinetic", "energy"]),
});

export type DamageType = z.infer<typeof DamageType>;

export const DamageTypeIds = DamageTypeId.enum;

export function isDamageType(obj: unknown): obj is DamageType {
  return DamageType.safeParse(obj).success;
}

export function isDamageTypeId(obj: unknown): obj is DamageTypeId {
  return DamageTypeId.safeParse(obj).success;
}

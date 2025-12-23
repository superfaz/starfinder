import { z } from "zod";
import { INamedModelSchema } from "./INamedModel";

export const ArmorTypeIdSchema = z.enum(["light", "heavy", "powered"]);

export type ArmorTypeId = z.infer<typeof ArmorTypeIdSchema>;

export const ArmorTypeIds = ArmorTypeIdSchema.enum;

export const ArmorTypeSchema = INamedModelSchema.extend({
  id: ArmorTypeIdSchema,
});

export type ArmorType = z.infer<typeof ArmorTypeSchema>;

export function isArmorType(obj: unknown): obj is ArmorType {
  return ArmorTypeSchema.safeParse(obj).success;
}

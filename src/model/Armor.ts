import { z } from "zod";
import { INamedModelSchema } from "./INamedModel";

export const ArmorIdSchema = z.enum(["light", "heavy", "powered"]);

export type ArmorId = z.infer<typeof ArmorIdSchema>;

export const ArmorIds = ArmorIdSchema.enum;

export const ArmorSchema = INamedModelSchema.extend({
  id: ArmorIdSchema,
});

export type Armor = z.infer<typeof ArmorSchema>;

export function isArmor(obj: unknown): obj is Armor {
  return ArmorSchema.safeParse(obj).success;
}

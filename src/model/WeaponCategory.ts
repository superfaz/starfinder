import { z } from "zod";
import { INamedModelSchema } from "./INamedModel";

export const WeaponCategorySchema = INamedModelSchema.extend({});

export type WeaponCategory = z.infer<typeof WeaponCategorySchema>;

export function isWeaponCategory(obj: unknown): obj is WeaponCategory {
  return WeaponCategorySchema.safeParse(obj).success;
}

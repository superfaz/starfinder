import { z } from "zod";
import { INamedModelSchema } from "./INamedModel";

export const WeaponCategoryIdSchema = z.enum(["cryo", "flame", "laser", "plasma", "projectile", "shock", "sonic"]);

export type WeaponCategoryId = z.infer<typeof WeaponCategoryIdSchema>;

export const WeaponCategorySchema = INamedModelSchema.extend({
  id: WeaponCategoryIdSchema,
});

export type WeaponCategory = z.infer<typeof WeaponCategorySchema>;

export function isWeaponCategory(obj: unknown): obj is WeaponCategory {
  return WeaponCategorySchema.safeParse(obj).success;
}

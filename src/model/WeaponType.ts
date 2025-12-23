import { z } from "zod";
import { INamedModelSchema } from "./INamedModel";

export const WeaponTypeIdSchema = z.enum([
  "natural",
  "basic",
  "advanced",
  "small",
  "long",
  "heavy",
  "sniper",
  "grenade",
]);

export type WeaponTypeId = z.infer<typeof WeaponTypeIdSchema>;

export const WeaponTypeSchema = INamedModelSchema.extend({
  id: WeaponTypeIdSchema,
  order: z.number(),
});

export type WeaponType = z.infer<typeof WeaponTypeSchema>;

export const WeaponTypeIds = WeaponTypeIdSchema.enum;

export function isWeaponType(obj: unknown): obj is WeaponType {
  return WeaponTypeSchema.safeParse(obj).success;
}

export function isWeaponTypeId(obj: unknown): obj is WeaponTypeId {
  return WeaponTypeIdSchema.safeParse(obj).success;
}

export function isMelee(type: string): boolean {
  return ["natural", "basic", "advanced"].includes(type);
}

export function isRanged(type: string): boolean {
  return ["small", "long", "heavy", "sniper"].includes(type);
}

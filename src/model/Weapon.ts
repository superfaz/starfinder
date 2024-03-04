import { z } from "zod";
import { INamedModelSchema } from "./INamedModel";

export const WeaponIdSchema = z.enum(["natural", "basic", "advanced", "small", "long", "heavy", "sniper", "grenade"]);

export type WeaponId = z.infer<typeof WeaponIdSchema>;

export const WeaponSchema = INamedModelSchema.extend({
  id: WeaponIdSchema,
});

export type Weapon = z.infer<typeof WeaponSchema>;

export const WeaponIds = WeaponIdSchema.enum;

export function isWeapon(obj: unknown): obj is Weapon {
  return WeaponSchema.safeParse(obj).success;
}

export function isWeaponId(obj: unknown): obj is WeaponId {
  return WeaponIdSchema.safeParse(obj).success;
}

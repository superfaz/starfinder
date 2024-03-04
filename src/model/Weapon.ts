import { z } from "zod";
import { INamedModelSchema } from "./INamedModel";

export const WeaponId = z.enum(["natural", "basic", "advanced", "small", "long", "heavy", "sniper", "grenade"]);

export type WeaponId = z.infer<typeof WeaponId>;

export const Weapon = INamedModelSchema.extend({
  id: WeaponId,
});

export type Weapon = z.infer<typeof Weapon>;

export const WeaponIds = WeaponId.enum;

export function isWeapon(obj: unknown): obj is Weapon {
  return Weapon.safeParse(obj).success;
}

export function isWeaponId(obj: unknown): obj is WeaponId {
  return WeaponId.safeParse(obj).success;
}

import { z } from "zod";
import { INamedModel } from "./INamedModel";

export const WeaponId = z.enum(["natural", "basic", "advanced", "small", "long", "heavy", "sniper", "grenade"]);

export const Weapon = INamedModel.extend({
  id: WeaponId,
}).strict();

export type Weapon = z.infer<typeof Weapon>;

export const WeaponIds = WeaponId.enum;

export function isWeapon(obj: unknown): obj is Weapon {
  return Weapon.safeParse(obj).success;
}

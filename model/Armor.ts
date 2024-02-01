import { z } from "zod";
import { INamedModel } from "./INamedModel";

export const ArmorId = z.enum(["light", "heavy", "powered"]);

export type ArmorId = z.infer<typeof ArmorId>;

export const ArmorIds = ArmorId.enum;

export const Armor = INamedModel.extend({
  id: ArmorId,
}).strict();

export type Armor = z.infer<typeof Armor>;

export function isArmor(obj: unknown): obj is Armor {
  return Armor.safeParse(obj).success;
}

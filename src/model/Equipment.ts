import { z } from "zod";
import { EquipmentArmorSchema } from "./EquipmentArmor";
import { EquipmentWeaponSchema } from "./EquipmentWeapon";

export const EquipmentSchema = z.discriminatedUnion("type", [
  ...EquipmentWeaponSchema.options,
  ...EquipmentArmorSchema.options,
]);

export type Equipment = z.infer<typeof EquipmentSchema>;

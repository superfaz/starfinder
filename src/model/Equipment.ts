import { z } from "zod";
import { EquipmentArmorSchema } from "./EquipmentArmor";
import { EquipmentWeaponSchema } from "./EquipmentWeapon";
import { EquipmentOtherSchema } from "./EquipmentOther";

export const EquipmentSchema = z.discriminatedUnion("type", [
  ...EquipmentWeaponSchema.options,
  ...EquipmentArmorSchema.options,
  ...EquipmentOtherSchema.options,
]);

export type Equipment = z.infer<typeof EquipmentSchema>;

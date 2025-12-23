import { z } from "zod";
import { EquipmentBaseSchema } from "./EquipmentBase";
import { ArmorTypeIdSchema } from "./ArmorType";

export const EquipmentArmorUpgradeSchema = EquipmentBaseSchema.extend({
  upgradeSlots: z.number().positive(),
  armorTypes: z.array(ArmorTypeIdSchema),
  modifiers: z.any(),
});

export type EquipmentArmorUpgrade = z.infer<typeof EquipmentArmorUpgradeSchema>;

import { z } from "zod";
import { EquipmentBaseSchema } from "./EquipmentBase";
import { ArmorTypeIdSchema } from "./ArmorType";

export const EquipmentArmorSchema = EquipmentBaseSchema.extend({
  type: ArmorTypeIdSchema,
  eacBonus: z.number(),
  kacBonus: z.number(),
  maxDexBonus: z.number(),
  armorCheckPenalty: z.number(),
  speedAdjustment: z.number(),
  upgradeSlots: z.number(),
});

export type EquipmentArmor = z.infer<typeof EquipmentArmorSchema>;

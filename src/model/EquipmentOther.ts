import { z } from "zod";

export const EquipmentOtherIdSchema = z.enum(["augmentation"]);

export type EquipmentOtherId = z.infer<typeof EquipmentOtherIdSchema>;

export const EquipmentOtherIds = EquipmentOtherIdSchema.enum;

import { z } from "zod";
import { EquipmentAugmentationSchema } from "./EquipmentAugmentation";

export const EquipmentOtherIdSchema = z.enum(["augmentation"]);

export type EquipmentOtherId = z.infer<typeof EquipmentOtherIdSchema>;

export const EquipmentOtherIds = EquipmentOtherIdSchema.enum;

export const EquipmentOtherSchema = z.discriminatedUnion("type", [EquipmentAugmentationSchema]);

export type EquipmentOther = z.infer<typeof EquipmentOtherSchema>;

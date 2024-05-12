import { z } from "zod";
import { EquipmentCategorySchema } from "./EquipmentBase";
import { IModelSchema } from "./IModel";
import { IdSchema } from "./helper";

const BaseEquipmentDescriptorSchema = IModelSchema.extend({
  category: EquipmentCategorySchema,
  secondaryType: IdSchema,
  equipmentId: IdSchema,
  unitaryCost: z.number(),
  name: z.string().optional().describe("Custom name for the equipment"),
  description: z.string().optional().describe("Custom description for the equipment"),
  material: IdSchema.optional(),
});

export const ConsumableEquipmentDescriptorSchema = BaseEquipmentDescriptorSchema.extend({
  type: z.literal("consumable"),
  quantity: z.number(),
});

export type ConsumableEquipmentDescriptor = z.infer<typeof ConsumableEquipmentDescriptorSchema>;

export const UniqueEquipmentDescriptorSchema = BaseEquipmentDescriptorSchema.extend({
  type: z.literal("unique"),
});

export type UniqueEquipmentDescriptor = z.infer<typeof UniqueEquipmentDescriptorSchema>;

export const EquipmentDescriptorSchema = z.discriminatedUnion("type", [
  ConsumableEquipmentDescriptorSchema,
  UniqueEquipmentDescriptorSchema,
]);

export type EquipmentDescriptor = z.infer<typeof EquipmentDescriptorSchema>;
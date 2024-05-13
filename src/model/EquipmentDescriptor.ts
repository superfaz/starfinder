import { z } from "zod";
import { EquipmentCategories } from "./EquipmentBase";
import { IModelSchema } from "./IModel";
import { IdSchema } from "./helper";

const BaseEquipmentDescriptorSchema = IModelSchema.extend({
  secondaryType: IdSchema,
  equipmentId: IdSchema,
  type: z.enum(["unique", "consumable"]),
  quantity: z.number(),
  unitaryCost: z.number(),
  name: z.string().optional().describe("Custom name for the equipment"),
  description: z.string().optional().describe("Custom description for the equipment"),
  material: IdSchema.optional(),
});

export const WeaponEquipmentDescriptorSchema = BaseEquipmentDescriptorSchema.extend({
  category: z.literal(EquipmentCategories.weapon),
  fusions: z.optional(z.array(IdSchema)),
});

export type WeaponEquipmentDescriptor = z.infer<typeof WeaponEquipmentDescriptorSchema>;

const ArmorEquipmentDescriptorSchema = BaseEquipmentDescriptorSchema.extend({
  category: z.literal(EquipmentCategories.armor),
});

const OtherEquipmentDescriptorSchema = BaseEquipmentDescriptorSchema.extend({
  category: z.literal(EquipmentCategories.other),
});

export const EquipmentDescriptorSchema = z.discriminatedUnion("category", [
  WeaponEquipmentDescriptorSchema,
  ArmorEquipmentDescriptorSchema,
  OtherEquipmentDescriptorSchema,
]);

export type EquipmentDescriptor = z.infer<typeof EquipmentDescriptorSchema>;

import { z } from "zod";
import { EquipmentBaseSchema } from "./EquipmentBase";
import { BodyPartIdSchema } from "./BodyPart";
import { IdSchema } from "./helper";
import { ModifierSchema } from "./Modifier";
import { PrerequisiteSchema } from "./Prerequisite";

export const EquipmentAugmentationCategorySchema = z.enum(["biotech", "cybernetic", "personal"]);

export type EquipmentAugmentationCategory = z.infer<typeof EquipmentAugmentationCategorySchema>;

export const EquipmentAugmentationSystemSchema = z.object({
  id: IdSchema,
  part: BodyPartIdSchema,
  quantity: z.union([z.literal("all"), z.number().int().positive()]),
});

export type EquipmentAugmentationSystem = z.infer<typeof EquipmentAugmentationSystemSchema>;

export const EquipmentAugmentationSchema = EquipmentBaseSchema.extend({
  category: EquipmentAugmentationCategorySchema,
  systems: z.array(EquipmentAugmentationSystemSchema),
  prerequisites: z.optional(z.array(PrerequisiteSchema)),
  modifiers: z.optional(z.array(ModifierSchema)),
});

export type EquipmentAugmentation = z.infer<typeof EquipmentAugmentationSchema>;

import { z } from "zod";
import { INamedModelSchema } from "./INamedModel";
import { DescriptionSchema, ReferenceSchema } from "./helper";

export const EquipmentMaterialSchema = INamedModelSchema.extend({
  description: DescriptionSchema,
  reference: ReferenceSchema,
  uniqueCost: z.number(),
  ammunitionCost: z.number(),
});

export type EquipmentMaterial = z.infer<typeof EquipmentMaterialSchema>;

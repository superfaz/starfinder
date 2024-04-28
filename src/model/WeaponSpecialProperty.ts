import type { z } from "zod";
import { INamedModelSchema } from "./INamedModel";
import { DescriptionSchema, ReferenceSchema } from "./helper";

export const WeaponSpecialPropertySchema = INamedModelSchema.extend({
  reference: ReferenceSchema,
  description: DescriptionSchema,
});

export type WeaponSpecialProperty = z.infer<typeof WeaponSpecialPropertySchema>;

import { z } from "zod";
import { INamedModelSchema } from "./INamedModel";
import { DescriptionSchema } from "./helper";

export const WeaponSpecialPropertySchema = INamedModelSchema.extend({
  description: DescriptionSchema,
});

export type WeaponSpecialProperty = z.infer<typeof WeaponSpecialPropertySchema>;

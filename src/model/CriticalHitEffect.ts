import { INamedModelSchema } from "./INamedModel";
import { DescriptionSchema, ReferenceSchema } from "./helper";

export const CriticalHitEffectSchema = INamedModelSchema.extend({
  reference: ReferenceSchema,
  description: DescriptionSchema,
});

export type CriticalHitEffect = Zod.infer<typeof CriticalHitEffectSchema>;

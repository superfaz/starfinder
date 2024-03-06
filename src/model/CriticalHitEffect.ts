import { INamedModelSchema } from "./INamedModel";
import { DescriptionSchema } from "./helper";

export const CriticalHitEffect = INamedModelSchema.extend({
  description: DescriptionSchema,
});

export type CriticalHitEffect = Zod.infer<typeof CriticalHitEffect>;

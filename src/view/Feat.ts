import { z } from "zod";
import { DescriptionSchema, INamedModelSchema, IdSchema, PrerequisiteSchema, ReferenceSchema } from "model";
import { Modifier } from "./Modifier";

const Feat = INamedModelSchema.extend({
  target: z.optional(IdSchema),
  combatFeat: z.boolean().default(false),
  description: DescriptionSchema,
  reference: ReferenceSchema,
  modifiers: z.array(Modifier),
  prerequisites: z.array(PrerequisiteSchema),
});

export type Feat = z.infer<typeof Feat>;

export function isFeat(obj: unknown): obj is Feat {
  return Feat.safeParse(obj).success;
}

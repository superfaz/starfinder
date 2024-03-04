import { z } from "zod";
import { DescriptionSchema, INamedModel, IdSchema, Prerequisite, ReferenceSchema } from "model";
import { Modifier } from "./Modifier";

const Feat = INamedModel.extend({
  target: z.optional(IdSchema),
  combatFeat: z.boolean().default(false),
  description: DescriptionSchema,
  reference: ReferenceSchema,
  modifiers: z.array(Modifier),
  prerequisites: z.array(Prerequisite),
});

export type Feat = z.infer<typeof Feat>;

export function isFeat(obj: unknown): obj is Feat {
  return Feat.safeParse(obj).success;
}

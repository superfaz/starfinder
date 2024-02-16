import { z } from "zod";
import { Description, INamedModel, Id, Prerequisite } from "model";
import { Modifier } from "./Modifier";

const Feat = INamedModel.extend({
  target: z.optional(Id),
  combatFeat: z.boolean().default(false),
  description: Description,
  refs: z.array(z.string()),
  modifiers: z.array(Modifier),
  prerequisites: z.array(Prerequisite),
});

export type Feat = z.infer<typeof Feat>;

export function isFeat(obj: unknown): obj is Feat {
  return Feat.safeParse(obj).success;
}

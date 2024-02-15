import { z } from "zod";
import { INamedModel } from "./INamedModel";
import { Description, Id } from "./helper";
import { Prerequisite } from "./Prerequisite";
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

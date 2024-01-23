import { z } from "zod";
import { INamedModel } from "./INamedModel";
import { Description } from "./helper";
import { Prerequisite } from "./Prerequisite";
import { ModifierTemplate } from "./ModifierTemplate";

export const Feat = INamedModel.extend({
  combatFeat: z.boolean(),
  multiple: z.boolean().default(false),
  target: z.string().optional(),
  description: Description,
  refs: z.array(z.string()),
  modifiers: z.array(ModifierTemplate),
  prerequisites: z.array(Prerequisite).optional(),
}).strict();

export type Feat = z.infer<typeof Feat>;

export function isFeat(data: unknown): data is Feat {
  return Feat.safeParse(data).success;
}

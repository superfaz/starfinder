import { z } from "zod";
import { INamedModel } from "./INamedModel";
import { Description } from "./helper";
import { Prerequisite } from "./Prerequisite";
import { ModifierTemplate } from "./ModifierTemplate";

export const FeatTemplate = INamedModel.extend({
  combatFeat: z.boolean().default(false),

  /**
   * If true, the feat will not be shown in the feat list.
   */
  hidden: z.boolean().default(false),
  multiple: z.boolean().default(false),
  target: z.string().optional(),
  description: Description,
  refs: z.array(z.string()),
  modifiers: z.array(ModifierTemplate),
  prerequisites: z.array(Prerequisite).optional(),
}).strict();

export type FeatTemplate = z.infer<typeof FeatTemplate>;

export function isFeatTemplate(data: unknown): data is FeatTemplate {
  return FeatTemplate.safeParse(data).success;
}

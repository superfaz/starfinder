import { z } from "zod";
import { IModel } from "./IModel";
import { ModifierType } from "./ModifierType";

export const ModifierTemplate = IModel.extend({
  type: z.union([z.string(), ModifierType]),
  level: z.optional(z.number()),
  name: z.optional(z.string()),
  description: z.optional(z.string()),
  target: z.optional(z.string()),
  value: z.optional(z.union([z.string(), z.number()])),
}).strict();

export type ModifierTemplate = z.infer<typeof ModifierTemplate>;

export function isModifierTemplate(obj: unknown): obj is ModifierTemplate {
  return ModifierTemplate.safeParse(obj).success;
}

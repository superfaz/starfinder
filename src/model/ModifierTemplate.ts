import { z } from "zod";
import { IModelSchema } from "./IModel";
import { ModifierTypeSchema } from "./ModifierType";

export const ModifierTemplateSchema = IModelSchema.extend({
  type: ModifierTypeSchema,
}).passthrough();

export type ModifierTemplate = z.infer<typeof ModifierTemplateSchema>;

export function isModifierTemplate(obj: unknown): obj is ModifierTemplate {
  return ModifierTemplateSchema.safeParse(obj).success;
}

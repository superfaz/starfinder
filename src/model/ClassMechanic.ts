import { z } from "zod";
import { FeatureTemplateSchema } from "./FeatureTemplate";
import { IModelSchema } from "./IModel";

export const ClassMechanicSchema = IModelSchema.extend({
  id: z.string(),
  features: z.array(FeatureTemplateSchema),
});

export type ClassMechanic = z.infer<typeof ClassMechanicSchema>;

export function isClassMechanic(data: unknown): data is ClassMechanic {
  return ClassMechanicSchema.safeParse(data).success;
}

export function asClassMechanic(data: unknown): ClassMechanic {
  return ClassMechanicSchema.parse(data);
}

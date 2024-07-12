import { z } from "zod";
import { FeatureTemplateSchema } from "./FeatureTemplate";
import { IModelSchema } from "./IModel";
import { DescriptionSchema, ReferenceSchema } from "./helper";
import { INamedModelSchema } from "./INamedModel";

export const ClassMechanicStyleSchema = INamedModelSchema.extend({
  reference: ReferenceSchema,
  description: DescriptionSchema,
  features: z.optional(z.array(FeatureTemplateSchema)),
}).strict();

export const ClassMechanicSchema = IModelSchema.extend({
  id: z.string(),
  features: z.array(FeatureTemplateSchema),
  styles: z.array(ClassMechanicStyleSchema),
});

export type ClassMechanic = z.infer<typeof ClassMechanicSchema>;

export function isClassMechanic(data: unknown): data is ClassMechanic {
  return ClassMechanicSchema.safeParse(data).success;
}

export function asClassMechanic(data: unknown): ClassMechanic {
  return ClassMechanicSchema.parse(data);
}

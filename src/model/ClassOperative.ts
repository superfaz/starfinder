import { z } from "zod";
import { FeatureTemplateSchema } from "./FeatureTemplate";
import { IModelSchema } from "./IModel";
import { INamedModelSchema } from "./INamedModel";
import { DescriptionSchema } from "./helper";

export const ClassOperativeSpecializationSchema = INamedModelSchema.extend({
  description: DescriptionSchema,
  variables: z.record(z.union([z.string(), z.number()])),
  features: z.array(FeatureTemplateSchema),
});

export type ClassOperativeSpecialization = z.infer<typeof ClassOperativeSpecializationSchema>;

export const ClassOperativeSchema = IModelSchema.extend({
  id: z.string(),
  specializations: z.array(ClassOperativeSpecializationSchema),
  features: z.array(FeatureTemplateSchema),
});

export type ClassOperative = z.infer<typeof ClassOperativeSchema>;

export function isClassOperative(data: unknown): data is ClassOperative {
  return ClassOperativeSchema.safeParse(data).success;
}

export function asClassOperative(data: unknown): ClassOperative {
  return ClassOperativeSchema.parse(data);
}

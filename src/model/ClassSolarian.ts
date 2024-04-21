import { z } from "zod";
import { FeatureTemplateSchema } from "./FeatureTemplate";
import { IModelSchema } from "./IModel";
import { INamedModelSchema } from "./INamedModel";
import { DescriptionSchema } from "./helper";

export const ClassSolarianRevelationTypeSchema = z.enum(["graviton", "photon"]);

export type ClassSolarianRevelationType = z.infer<typeof ClassSolarianRevelationTypeSchema>;

export const ClassSolarianRevelationSchema = INamedModelSchema.extend({
  type: ClassSolarianRevelationTypeSchema,
  description: DescriptionSchema,
  features: z.array(FeatureTemplateSchema),
});

export type ClassSolarianRevelation = z.infer<typeof ClassSolarianRevelationSchema>;

export const ClassSolarianManifestationSchema = INamedModelSchema.extend({
  description: DescriptionSchema,
  features: z.array(FeatureTemplateSchema),
});

export const ClassSolarianSchema = IModelSchema.extend({
  id: z.string(),
  features: z.array(FeatureTemplateSchema),
  revelations: z.array(ClassSolarianRevelationSchema),
});

export type ClassSolarian = z.infer<typeof ClassSolarianSchema>;

export function isClassSolarian(data: unknown): data is ClassSolarian {
  return ClassSolarianSchema.safeParse(data).success;
}

export function asClassSolarian(data: unknown): ClassSolarian {
  return ClassSolarianSchema.parse(data);
}

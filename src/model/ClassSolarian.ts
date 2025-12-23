import { z } from "zod";
import { FeatureCategorySchema, FeatureTemplateSchema } from "./FeatureTemplate";
import { IModelSchema } from "./IModel";
import { INamedModelSchema } from "./INamedModel";
import { DescriptionSchema, EvolutionsSchema } from "./helper";

export const ClassSolarianColorSchema = INamedModelSchema.extend({
  variables: z.record(z.union([z.string(), z.number()])),
});

export const ClassSolarianManifestationSchema = INamedModelSchema.extend({
  description: DescriptionSchema,
});

export const ClassSolarianRevelationTypeSchema = z.enum(["graviton", "photon"]);

export const ClassSolarianRevelationSchema = INamedModelSchema.extend({
  type: ClassSolarianRevelationTypeSchema,
  level: z.number(),
  category: FeatureCategorySchema,
  zenith: z.boolean(),
  description: DescriptionSchema,
  evolutions: z.optional(EvolutionsSchema),
});

export const ClassSolarianPrerequisiteSchema = IModelSchema.extend({
  type: z.literal("manifestation"),
  value: z.enum(["weapon", "armor"]),
}).strict();

export const ClassSolarianFeatureTemplateSchema = FeatureTemplateSchema.extend({
  prerequisites: z.array(ClassSolarianPrerequisiteSchema).optional(),
});

export type ClassSolarianFeatureTemplate = z.infer<typeof ClassSolarianFeatureTemplateSchema>;

export const ClassSolarianSchema = IModelSchema.extend({
  id: z.string(),
  colors: z.array(ClassSolarianColorSchema),
  manifestations: z.array(ClassSolarianManifestationSchema),
  features: z.array(ClassSolarianFeatureTemplateSchema),
  revelations: z.array(ClassSolarianRevelationSchema),
});

export type ClassSolarian = z.infer<typeof ClassSolarianSchema>;

export function isClassSolarian(data: unknown): data is ClassSolarian {
  return ClassSolarianSchema.safeParse(data).success;
}

export function asClassSolarian(data: unknown): ClassSolarian {
  return ClassSolarianSchema.parse(data);
}

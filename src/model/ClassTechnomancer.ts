import { z } from "zod";
import { FeatureTemplateSchema } from "./FeatureTemplate";
import { IModelSchema } from "./IModel";

export const ClassTechnomancerSchema = IModelSchema.extend({
  id: z.string(),
  features: z.array(FeatureTemplateSchema),
});

export type ClassTechnomancer = z.infer<typeof ClassTechnomancerSchema>;

export function isClassTechnomancer(data: unknown): data is ClassTechnomancer {
  return ClassTechnomancerSchema.safeParse(data).success;
}

export function asClassTechnomancer(data: unknown): ClassTechnomancer {
  return ClassTechnomancerSchema.parse(data);
}

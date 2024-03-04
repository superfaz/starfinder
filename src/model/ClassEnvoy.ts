import { z } from "zod";
import { IModelSchema } from "./IModel";
import { FeatureTemplateSchema } from "./FeatureTemplate";

export const ClassEnvoySchema = IModelSchema.extend({
  id: z.literal("envoy"),
  skills: z.array(z.string()),
  features: z.array(FeatureTemplateSchema),
});

export type ClassEnvoy = z.infer<typeof ClassEnvoySchema>;

export function isClassEnvoy(data: unknown): data is ClassEnvoy {
  return ClassEnvoySchema.safeParse(data).success;
}

export function asClassEnvoy(data: unknown): ClassEnvoy {
  return ClassEnvoySchema.parse(data);
}

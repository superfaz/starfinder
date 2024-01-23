import { z } from "zod";
import { FeatureTemplate } from "./FeatureTemplate";
import { IModel } from "./IModel";
import { INamedModel } from "./INamedModel";
import { Description } from "./helper";

export const ClassOperativeSpecialization = INamedModel.extend({
  description: Description,
  variables: z.record(z.union([z.string(), z.number()])),
  features: z.array(FeatureTemplate),
});

export type ClassOperativeSpecialization = z.infer<typeof ClassOperativeSpecialization>;

export const ClassOperative = IModel.extend({
  id: z.string(),
  specializations: z.array(ClassOperativeSpecialization),
  features: z.array(FeatureTemplate),
});

export type ClassOperative = z.infer<typeof ClassOperative>;

export function isClassOperative(data: unknown): data is ClassOperative {
  return ClassOperative.safeParse(data).success;
}

export function asClassOperative(data: unknown): ClassOperative {
  return ClassOperative.parse(data);
}

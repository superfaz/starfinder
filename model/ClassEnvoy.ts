import { z } from "zod";
import { IModel } from "./IModel";
import { FeatureTemplate } from "./FeatureTemplate";

export const ClassEnvoy = IModel.extend({
  id: z.literal("envoy"),
  skills: z.array(z.string()),
  features: z.array(FeatureTemplate),
});

export type ClassEnvoy = z.infer<typeof ClassEnvoy>;

export function isClassEnvoy(data: unknown): data is ClassEnvoy {
  return ClassEnvoy.safeParse(data).success;
}

export function asClassEnvoy(data: unknown): ClassEnvoy {
  return ClassEnvoy.parse(data);
}

import { z } from "zod";
import { IModel } from "./IModel";
import { FeatureTemplate } from "./FeatureTemplate";
import { INamedModel } from "./INamedModel";
import { Description } from "./helper";

export const ClassMysticConnectionSchema = INamedModel.extend({
  description: Description,
  deities: z.array(z.string()),
  features: z.array(FeatureTemplate),
}).strict();

export type ClassMysticConnection = z.infer<typeof ClassMysticConnectionSchema>;

export const ClassMysticSchema = IModel.extend({
  id: z.literal("mystic"),
  features: z.array(FeatureTemplate),
  connections: z.array(ClassMysticConnectionSchema),
});

export type ClassMystic = z.infer<typeof ClassMysticSchema>;

export function isClassMystic(data: unknown): data is ClassMystic {
  return ClassMysticSchema.safeParse(data).success;
}

export function asClassMystic(data: unknown): ClassMystic {
  return ClassMysticSchema.parse(data);
}

import { z } from "zod";
import { IModelSchema } from "./IModel";
import { FeatureTemplateSchema } from "./FeatureTemplate";
import { INamedModelSchema } from "./INamedModel";
import { DescriptionSchema } from "./helper";

export const ClassMysticConnectionSchema = INamedModelSchema.extend({
  description: DescriptionSchema,
  deities: z.array(z.string()),
  features: z.array(FeatureTemplateSchema),
}).strict();

export type ClassMysticConnection = z.infer<typeof ClassMysticConnectionSchema>;

export const ClassMysticSchema = IModelSchema.extend({
  id: z.literal("mystic"),
  features: z.array(FeatureTemplateSchema),
  connections: z.array(ClassMysticConnectionSchema),
});

export type ClassMystic = z.infer<typeof ClassMysticSchema>;

export function isClassMystic(data: unknown): data is ClassMystic {
  return ClassMysticSchema.safeParse(data).success;
}

export function asClassMystic(data: unknown): ClassMystic {
  return ClassMysticSchema.parse(data);
}

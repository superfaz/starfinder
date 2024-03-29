import { z } from "zod";
import { FeatureTemplateSchema } from "./FeatureTemplate";
import { IModelSchema } from "./IModel";
import { INamedModelSchema } from "./INamedModel";
import { DescriptionSchema } from "./helper";

export const ClassSoldierStyleSchema = INamedModelSchema.extend({
  description: DescriptionSchema,
  features: z.array(FeatureTemplateSchema),
});

export type ClassSoldierStyle = z.infer<typeof ClassSoldierStyleSchema>;

export const ClassSoldierSchema = IModelSchema.extend({
  id: z.string(),
  features: z.array(FeatureTemplateSchema),
  styles: z.array(ClassSoldierStyleSchema),
});

export type ClassSoldier = z.infer<typeof ClassSoldierSchema>;

export function isClassSoldier(data: unknown): data is ClassSoldier {
  return ClassSoldierSchema.safeParse(data).success;
}

export function asClassSoldier(data: unknown): ClassSoldier {
  return ClassSoldierSchema.parse(data);
}

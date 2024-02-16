import { z } from "zod";
import { FeatureTemplate } from "./FeatureTemplate";
import { IModel } from "./IModel";
import { INamedModel } from "./INamedModel";
import { Description } from "./helper";

export const ClassSoldierStyle = INamedModel.extend({
  description: Description,
  features: z.array(FeatureTemplate),
});

export type ClassSoldierStyle = z.infer<typeof ClassSoldierStyle>;

export const ClassSoldier = IModel.extend({
  id: z.string(),
  features: z.array(FeatureTemplate),
  styles: z.array(ClassSoldierStyle),
});

export type ClassSoldier = z.infer<typeof ClassSoldier>;

export function isClassSoldier(data: unknown): data is ClassSoldier {
  return ClassSoldier.safeParse(data).success;
}

export function asClassSoldier(data: unknown): ClassSoldier {
  return ClassSoldier.parse(data);
}

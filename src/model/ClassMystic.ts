import { z } from "zod";
import { IModel } from "./IModel";
import { FeatureTemplate } from "./FeatureTemplate";
import { INamedModel } from "./INamedModel";
import { Description } from "./helper";

export const ClassMysticConnection = INamedModel.extend({
  description: Description,
  deities: z.array(z.string()),
  features: z.array(FeatureTemplate),
}).strict();

export type ClassMysticConnection = z.infer<typeof ClassMysticConnection>;

export const ClassMystic = IModel.extend({
  id: z.literal("mystic"),
  features: z.array(FeatureTemplate),
  connections: z.array(ClassMysticConnection),
});

export type ClassMystic = z.infer<typeof ClassMystic>;

export function isClassMystic(data: unknown): data is ClassMystic {
  return ClassMystic.safeParse(data).success;
}

export function asClassMystic(data: unknown): ClassMystic {
  return ClassMystic.parse(data);
}

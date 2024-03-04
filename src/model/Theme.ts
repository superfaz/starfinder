import { z } from "zod";
import { INamedModel } from "./INamedModel";
import { FeatureTemplateSchema } from "./FeatureTemplate";
import { DescriptionSchema, ReferenceSchema } from "./helper";

export const Theme = INamedModel.extend({
  description: DescriptionSchema,
  reference: ReferenceSchema,
  abilityScores: z.record(z.union([z.undefined(), z.number()])),
  features: z.array(FeatureTemplateSchema),
});

export type Theme = z.infer<typeof Theme>;

export function isTheme(obj: unknown): obj is Theme {
  return Theme.safeParse(obj).success;
}

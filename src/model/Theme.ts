import { z } from "zod";
import { INamedModelSchema } from "./INamedModel";
import { FeatureTemplateSchema } from "./FeatureTemplate";
import { DescriptionSchema, ReferenceSchema } from "./helper";

export const ThemeSchema = INamedModelSchema.extend({
  description: DescriptionSchema,
  reference: ReferenceSchema,
  abilityScores: z.record(z.union([z.undefined(), z.number()])),
  features: z.array(FeatureTemplateSchema),
});

export type Theme = z.infer<typeof ThemeSchema>;

export function isTheme(obj: unknown): obj is Theme {
  return ThemeSchema.safeParse(obj).success;
}

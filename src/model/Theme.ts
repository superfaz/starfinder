import { z } from "zod";
import { FeatureTemplateSchema } from "./FeatureTemplate";
import { IEntrySchema } from "./IEntry";

export const ThemeSchema = IEntrySchema.extend({
  abilityScores: z.record(z.union([z.undefined(), z.number()])),
  features: z.array(FeatureTemplateSchema),
});

export type Theme = z.infer<typeof ThemeSchema>;

export function isTheme(obj: unknown): obj is Theme {
  return ThemeSchema.safeParse(obj).success;
}

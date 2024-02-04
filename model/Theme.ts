import { z } from "zod";
import { INamedModel } from "./INamedModel";
import { FeatureTemplate } from "./FeatureTemplate";
import { Description } from "./helper";

export const Theme = INamedModel.extend({
  description: Description,
  refs: z.array(z.string()),
  abilityScores: z.record(z.union([z.undefined(), z.number()])),
  features: z.array(FeatureTemplate),
});

export type Theme = z.infer<typeof Theme>;

export function isTheme(obj: unknown): obj is Theme {
  return Theme.safeParse(obj).success;
}

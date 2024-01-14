import { z } from "zod";
import { INamedModel } from "./INamedModel";
import { Variant } from "./Variant";
import { FeatureTemplate } from "./FeatureTemplate";

export const Race = INamedModel.extend({
  description: z.string(),
  refs: z.array(z.string()),
  hitPoints: z.number(),
  variants: z.array(Variant),
  names: z.array(z.string()),
  traits: z.array(FeatureTemplate),
  secondaryTraits: z.array(FeatureTemplate),
}).strict();

export type Race = z.infer<typeof Race>;

export function isRace(obj: unknown): obj is Race {
  return Race.safeParse(obj).success;
}

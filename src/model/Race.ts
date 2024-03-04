import { z } from "zod";
import { INamedModel } from "./INamedModel";
import { Variant } from "./Variant";
import { FeatureTemplateSchema } from "./FeatureTemplate";
import { DescriptionSchema, ReferenceSchema } from "./helper";

export const Race = INamedModel.extend({
  description: DescriptionSchema,
  reference: ReferenceSchema,
  hitPoints: z.number(),
  variants: z.array(Variant),
  names: z.array(z.string()),
  traits: z.array(FeatureTemplateSchema),
  secondaryTraits: z.array(FeatureTemplateSchema),
});

export type Race = z.infer<typeof Race>;

export function isRace(obj: unknown): obj is Race {
  return Race.safeParse(obj).success;
}

import { z } from "zod";
import { INamedModelSchema } from "./INamedModel";
import { Variant } from "./Variant";
import { FeatureTemplateSchema } from "./FeatureTemplate";
import { DescriptionSchema, ReferenceSchema } from "./helper";

export const RaceSchema = INamedModelSchema.extend({
  description: DescriptionSchema,
  reference: ReferenceSchema,
  hitPoints: z.number(),
  variants: z.array(Variant),
  names: z.array(z.string()),
  traits: z.array(FeatureTemplateSchema),
  secondaryTraits: z.array(FeatureTemplateSchema),
});

export type Race = z.infer<typeof RaceSchema>;

export function isRace(obj: unknown): obj is Race {
  return RaceSchema.safeParse(obj).success;
}

import { z } from "zod";
import { INamedModelSchema } from "./INamedModel";
import { VariantSchema } from "./Variant";
import { FeatureTemplateSchema } from "./FeatureTemplate";
import { DescriptionSchema, ReferenceSchema } from "./helper";
import { IModelSchema } from "./IModel";
import { ModifierTypes } from "./ModifierType";
import { SizeModifierSchema } from "./ModifierTemplate";

export const HitPointsModifierSchema = IModelSchema.extend({
  type: z.enum([ModifierTypes.hitPoints]),
  level: z.number().optional(),
  value: z.number(),
}).strict();

export const RaceModifierSchema = z.discriminatedUnion("type", [HitPointsModifierSchema, SizeModifierSchema]);

export type RaceModifier = z.infer<typeof RaceModifierSchema>;

export const RaceSchema = INamedModelSchema.extend({
  description: DescriptionSchema,
  reference: ReferenceSchema,
  modifiers: z.array(RaceModifierSchema),
  variants: z.array(VariantSchema),
  names: z.array(z.string()),
  traits: z.array(FeatureTemplateSchema),
  secondaryTraits: z.array(FeatureTemplateSchema),
});

export type Race = z.infer<typeof RaceSchema>;

export function isRace(obj: unknown): obj is Race {
  return RaceSchema.safeParse(obj).success;
}

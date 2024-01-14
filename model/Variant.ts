import { z } from "zod";
import { INamedModel } from "./INamedModel";

export const Variant = INamedModel.extend({
  description: z.string(),
  abilityScores: z.record(z.union([z.number(), z.undefined()])),
});

export type Variant = z.infer<typeof Variant>;

export function isVariant(obj: unknown): obj is Variant {
  return Variant.safeParse(obj).success;
}

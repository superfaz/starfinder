import { z } from "zod";
import { IdSchema, ModifierSchema, PrerequisiteSchema } from "model";
import { IEntryModelSchema } from "model/IEntryModel";

export const Feat = IEntryModelSchema.extend({
  target: z.optional(IdSchema),
  combatFeat: z.boolean().default(false),
  modifiers: z.array(ModifierSchema),
  prerequisites: z.array(PrerequisiteSchema),
});

export type Feat = z.infer<typeof Feat>;

export function isFeat(obj: unknown): obj is Feat {
  return Feat.safeParse(obj).success;
}

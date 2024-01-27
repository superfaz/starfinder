import { z } from "zod";
import { FeatTemplate } from "./FeatTemplate";
import { Modifier } from "./Modifier";

export const Feat = FeatTemplate.extend({
  modifiers: z.array(Modifier),
});

export type Feat = z.infer<typeof Feat>;

export function isFeat(object: unknown): object is Feat {
  return Feat.safeParse(object).success;
}

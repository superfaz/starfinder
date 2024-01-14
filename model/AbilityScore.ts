import { z } from "zod";
import { ICodedModel } from "./ICodedModel";

export const AbilityScore = ICodedModel.extend({
  id: z.enum(["str", "dex", "con", "int", "wis", "cha"]),
});

export type AbilityScore = z.infer<typeof AbilityScore>;

export function isAbilityScore(obj: unknown): obj is AbilityScore {
  return AbilityScore.safeParse(obj).success;
}

import { z } from "zod";
import { ICodedModel } from "./ICodedModel";

const AbilityScoreId = z.enum(["str", "dex", "con", "int", "wis", "cha"]);

export const AbilityScore = ICodedModel.extend({
  id: AbilityScoreId,
});

export type AbilityScore = z.infer<typeof AbilityScore>;

export function isAbilityScore(obj: unknown): obj is AbilityScore {
  return AbilityScore.safeParse(obj).success;
}

export const AbilityScoreIds = AbilityScoreId.enum;

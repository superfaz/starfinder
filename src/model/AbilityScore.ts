import { z } from "zod";
import { ICodedModel } from "./ICodedModel";

export const AbilityScoreIdSchema = z.enum(["str", "dex", "con", "int", "wis", "cha"]);

export type AbilityScoreId = z.infer<typeof AbilityScoreIdSchema>;

export const AbilityScoreSchema = ICodedModel.extend({
  id: AbilityScoreIdSchema,
});

export type AbilityScore = z.infer<typeof AbilityScoreSchema>;

export function isAbilityScore(obj: unknown): obj is AbilityScore {
  return AbilityScoreSchema.safeParse(obj).success;
}

export const AbilityScoreIds = AbilityScoreIdSchema.enum;

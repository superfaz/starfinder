import { z } from "zod";
import { INamedModel } from "./INamedModel";
import { AbilityScoreId } from "./AbilityScore";

export const SavingThrowId = z.enum(["fortitude", "reflex", "will"]);

export const SavingThrow = INamedModel.extend({
  id: SavingThrowId,
  abilityScore: AbilityScoreId,
}).strict();

export type SavingThrow = z.infer<typeof SavingThrow>;

export function isSavingThrow(obj: unknown): obj is SavingThrow {
  return SavingThrow.safeParse(obj).success;
}

export const SavingThrowIds = SavingThrowId.enum;

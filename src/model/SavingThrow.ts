import { z } from "zod";
import { INamedModelSchema } from "./INamedModel";
import { AbilityScoreIdSchema } from "./AbilityScore";

export const SavingThrowId = z.enum(["fortitude", "reflex", "will"]);

export type SavingThrowId = z.infer<typeof SavingThrowId>;

export const SavingThrow = INamedModelSchema.extend({
  id: SavingThrowId,
  abilityScore: AbilityScoreIdSchema,
});

export type SavingThrow = z.infer<typeof SavingThrow>;

export function isSavingThrow(obj: unknown): obj is SavingThrow {
  return SavingThrow.safeParse(obj).success;
}

export const SavingThrowIds = SavingThrowId.enum;

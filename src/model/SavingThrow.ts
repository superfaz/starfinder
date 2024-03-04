import { z } from "zod";
import { INamedModelSchema } from "./INamedModel";
import { AbilityScoreIdSchema } from "./AbilityScore";

export const SavingThrowIdSchema = z.enum(["fortitude", "reflex", "will"]);

export type SavingThrowId = z.infer<typeof SavingThrowIdSchema>;

export const SavingThrowSchema = INamedModelSchema.extend({
  id: SavingThrowIdSchema,
  abilityScore: AbilityScoreIdSchema,
});

export type SavingThrow = z.infer<typeof SavingThrowSchema>;

export function isSavingThrow(obj: unknown): obj is SavingThrow {
  return SavingThrowSchema.safeParse(obj).success;
}

export const SavingThrowIds = SavingThrowIdSchema.enum;

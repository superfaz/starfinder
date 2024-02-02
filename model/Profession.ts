import { z } from "zod";
import { AbilityScoreId } from "./AbilityScore";
import { INamedModel } from "./INamedModel";

export const Profession = INamedModel.extend({
  abilityScore: AbilityScoreId,
}).strict();

export type Profession = z.infer<typeof Profession>;

export function isProfession(obj: unknown): obj is Profession {
  return Profession.safeParse(obj).success;
}

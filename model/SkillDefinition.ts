import { z } from "zod";
import { AbilityScoreId } from "./AbilityScore";
import { INamedModel } from "./INamedModel";

export const SkillDefinition = INamedModel.extend({
  id: z.string(),
  name: z.string(),
  abilityScore: z.optional(AbilityScoreId),
  trainedOnly: z.boolean(),
  armorCheckPenalty: z.boolean(),
}).strict();

export type SkillDefinition = z.infer<typeof SkillDefinition>;

export function isSkillDefinition(obj: unknown): obj is SkillDefinition {
  return SkillDefinition.safeParse(obj).success;
}

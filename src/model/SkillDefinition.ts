import { z } from "zod";
import { AbilityScoreIdSchema } from "./AbilityScore";
import { INamedModelSchema } from "./INamedModel";

export const SkillDefinitionSchema = INamedModelSchema.extend({
  id: z.string(),
  name: z.string(),
  abilityScore: z.optional(AbilityScoreIdSchema),
  trainedOnly: z.boolean(),
  armorCheckPenalty: z.boolean(),
});

export type SkillDefinition = z.infer<typeof SkillDefinitionSchema>;

export function isSkillDefinition(obj: unknown): obj is SkillDefinition {
  return SkillDefinitionSchema.safeParse(obj).success;
}

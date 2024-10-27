"use server";

import { start } from "chain-of-actions";
import { z } from "zod";
import { ActionResult } from "app/helpers-server";
import { DataSets } from "data";
import { NotFoundError, ParsingError } from "logic";
import { IdSchema } from "model";
import { prepareActionContext } from "../../helpers-server";
import { createState, UpdateState } from "./createState";

const UpdateEnvoySkillInputSchema = z.object({
  characterId: IdSchema,
  skillId: IdSchema,
});

export type UpdateEnvoySkillInput = z.infer<typeof UpdateEnvoySkillInputSchema>;

export async function updateEnvoySkill(
  data: UpdateEnvoySkillInput
): Promise<ActionResult<UpdateEnvoySkillInput, UpdateState>> {
  const context = await prepareActionContext(UpdateEnvoySkillInputSchema, data);

  if (!context.success) {
    if (context.error instanceof ParsingError) {
      return { success: false, errors: context.error.errors };
    } else if (context.error instanceof NotFoundError) {
      return { success: false, errors: { characterId: ["Not found"] } };
    } else {
      throw context.error;
    }
  }

  const action = await start(undefined, context.value)
    .onSuccess((_, { input, builder }) => builder.updateEnvoySkill(input.skillId))
    .onSuccess((_, { dataSource, builder }) => dataSource.get(DataSets.Characters).update(builder.character))
    .runAsync();

  if (!action.success) {
    return { success: false, errors: { skillId: ["Invalid"] } };
  }

  return { success: true, ...(await createState(action.value)) };
}

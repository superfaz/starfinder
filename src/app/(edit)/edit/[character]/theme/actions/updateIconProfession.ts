"use server";

import { start } from "chain-of-actions";
import { z } from "zod";
import { ActionResult } from "app/helpers-server";
import { DataSets } from "data";
import { NotFoundError, ParsingError } from "logic";
import { AbilityScoreIdSchema, IdSchema } from "model";
import { prepareActionContext } from "../../helpers-server";
import { createState, UpdateState } from "./createState";

const UpdateIconProfessionInputSchema = z.object({
  characterId: IdSchema,
  abilityScoreId: AbilityScoreIdSchema,
  name: z.string(),
});

export type UpdateIconProfessionInput = z.infer<typeof UpdateIconProfessionInputSchema>;

export async function updateIconProfession(
  data: UpdateIconProfessionInput
): Promise<ActionResult<UpdateIconProfessionInput, UpdateState>> {
  const context = await prepareActionContext(UpdateIconProfessionInputSchema, data);

  if (!context.success) {
    if (context.error instanceof ParsingError) {
      return { success: false, errors: context.error.errors };
    } else if (context.error instanceof NotFoundError) {
      return { success: false, errors: { characterId: ["Not found"] } };
    } else {
      throw context.error;
    }
  }

  const action = await start(context.value)
    .onSuccess(({ input, builder }) => builder.updateIconProfession(input.abilityScoreId, input.name))
    .onSuccess(({ dataSource, builder }) => dataSource.get(DataSets.Characters).update(builder.character))
    .runAsync();

  if (!action.success) {
    return { success: false, errors: { name: ["Invalid"] } };
  }

  return { success: true, ...(await createState(action.value)) };
}

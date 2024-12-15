"use server";

import { start } from "chain-of-actions";
import { z } from "zod";
import { ActionResult } from "app/helpers-server";
import { DataSets } from "data";
import { NotFoundError, ParsingError } from "logic";
import { IdSchema } from "model";
import { prepareActionContext } from "../../helpers-server";
import { createState, UpdateState } from "./createState";

const UpdateMysticConnectionInputSchema = z.object({
  characterId: IdSchema,
  connectionId: IdSchema,
});

export type UpdateMysticConnectionInput = z.infer<typeof UpdateMysticConnectionInputSchema>;

export async function updateMysticConnection(
  data: UpdateMysticConnectionInput
): Promise<ActionResult<UpdateMysticConnectionInput, UpdateState>> {
  const context = await prepareActionContext(UpdateMysticConnectionInputSchema, data);

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
    .onSuccess(({ input, builder }) => builder.updateMysticConnection(input.connectionId))
    .onSuccess(({ dataSource, builder }) => dataSource.get(DataSets.Characters).update(builder.character))
    .runAsync();

  if (!action.success) {
    return { success: false, errors: { connectionId: ["Invalid"] } };
  }

  return { success: true, ...(await createState(action.value)) };
}

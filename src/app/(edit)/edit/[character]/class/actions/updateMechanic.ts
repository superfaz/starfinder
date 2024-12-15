"use server";

import { start } from "chain-of-actions";
import { z } from "zod";
import { ActionResult } from "app/helpers-server";
import { DataSets } from "data";
import { NotFoundError, ParsingError } from "logic";
import { IdSchema } from "model";
import { prepareActionContext } from "../../helpers-server";
import { createState, UpdateState } from "./createState";

const UpdateMechanicStyleInputSchema = z.object({
  characterId: IdSchema,
  styleId: IdSchema,
});

export type UpdateMechanicStyleInput = z.infer<typeof UpdateMechanicStyleInputSchema>;

export async function updateMechanicStyle(
  data: UpdateMechanicStyleInput
): Promise<ActionResult<UpdateMechanicStyleInput, UpdateState>> {
  const context = await prepareActionContext(UpdateMechanicStyleInputSchema, data);

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
    .onSuccess(({ input, builder }) => builder.updateMechanicStyle(input.styleId))
    .onSuccess(({ dataSource, builder }) => dataSource.get(DataSets.Characters).update(builder.character))
    .runAsync();

  if (!action.success) {
    return { success: false, errors: { styleId: ["Invalid"] } };
  }

  return { success: true, ...(await createState(action.value)) };
}

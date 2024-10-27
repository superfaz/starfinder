"use server";

import { start } from "chain-of-actions";
import { z } from "zod";
import { ActionResult } from "app/helpers-server";
import { DataSets } from "data";
import { NotFoundError, ParsingError } from "logic";
import { IdSchema } from "model";
import { prepareActionContext } from "../../helpers-server";
import { createState, UpdateState } from "./createState";

const UpdateClassInputSchema = z.object({
  characterId: IdSchema,
  classId: IdSchema,
});

export type UpdateClassInput = z.infer<typeof UpdateClassInputSchema>;

export async function updateClass(data: UpdateClassInput): Promise<ActionResult<UpdateClassInput, UpdateState>> {
  const context = await prepareActionContext(UpdateClassInputSchema, data);

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
    .onSuccess((_, { input, builder }) => builder.updateClass(input.classId))
    .onSuccess((_, { dataSource, builder }) => dataSource.get(DataSets.Characters).update(builder.character))
    .runAsync();

  if (!action.success) {
    return { success: false, errors: { classId: ["Invalid"] } };
  }

  return { success: true, ...(await createState(action.value)) };
}

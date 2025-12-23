"use server";

import { start } from "chain-of-actions";
import { z } from "zod";
import { ActionResult } from "app/helpers-server";
import { DataSets } from "data";
import { NotFoundError, ParsingError } from "logic";
import { IdSchema } from "model";
import { prepareActionContext } from "../../helpers-server";
import { createState, UpdateState } from "./createState";

const UpdateRaceInputSchema = z.object({
  characterId: IdSchema,
  raceId: IdSchema,
});

export type UpdateRaceInput = z.infer<typeof UpdateRaceInputSchema>;

export async function updateRace(data: UpdateRaceInput): Promise<ActionResult<UpdateRaceInput, UpdateState>> {
  const context = await prepareActionContext(UpdateRaceInputSchema, data);

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
    .onSuccess(({ input, builder }) => builder.updateRace(input.raceId))
    .onSuccess(({ dataSource, builder }) => dataSource.get(DataSets.Characters).update(builder.character))
    .runAsync();

  if (!action.success) {
    return { success: false, errors: { raceId: ["Invalid"] } };
  }

  return { success: true, ...(await createState(action.value)) };
}

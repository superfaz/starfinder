"use server";

import { start } from "chain-of-actions";
import { z } from "zod";
import { ActionResult } from "app/helpers-server";
import { DataSets } from "data";
import { NotFoundError, ParsingError } from "logic";
import { IdSchema } from "model";
import { prepareActionContext } from "../../helpers-server";
import { createState, UpdateState } from "./createState";

const UpdateVariantInputSchema = z.object({
  characterId: IdSchema,
  variantId: IdSchema,
});

type UpdateVariantInput = z.infer<typeof UpdateVariantInputSchema>;

export async function updateVariant(data: UpdateVariantInput): Promise<ActionResult<UpdateVariantInput, UpdateState>> {
  const context = await prepareActionContext(UpdateVariantInputSchema, data);

  if (!context.success) {
    if (context.error instanceof ParsingError) {
      return { success: false, errors: context.error.errors };
    } else if (context.error instanceof NotFoundError) {
      return { success: false, errors: { variantId: ["Not found"] } };
    } else {
      throw context.error;
    }
  }

  const action = await start(context.value)
    .onSuccess(({ input, builder }) => builder.updateRaceVariant(input.variantId))
    .onSuccess(({ dataSource, builder }) => dataSource.get(DataSets.Characters).update(builder.character))
    .runAsync();

  if (!action.success) {
    return { success: false, errors: { variantId: ["Invalid"] } };
  }

  return { success: true, ...(await createState(action.value)) };
}

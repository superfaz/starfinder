"use server";

import { start } from "chain-of-actions";
import { z } from "zod";
import { ActionResult } from "app/helpers-server";
import { DataSets } from "data";
import { NotFoundError, ParsingError } from "logic";
import { IdSchema } from "model";
import { prepareActionContext } from "../../helpers-server";
import { createState, UpdateState } from "./createState";

const UpdateScholarSpecializationInputSchema = z.object({
  characterId: IdSchema,
  specialization: z.string(),
});

export type UpdateScholarSpecializationInput = z.infer<typeof UpdateScholarSpecializationInputSchema>;

export async function updateScholarSpecialization(
  data: UpdateScholarSpecializationInput
): Promise<ActionResult<UpdateScholarSpecializationInput, UpdateState>> {
  const context = await prepareActionContext(UpdateScholarSpecializationInputSchema, data);

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
    .onSuccess((_, { input, builder }) => builder.updateScholarSpecialization(input.specialization))
    .onSuccess((_, { dataSource, builder }) => dataSource.get(DataSets.Characters).update(builder.character))
    .runAsync();

  if (!action.success) {
    return { success: false, errors: { specialization: ["Invalid"] } };
  }

  return { success: true, ...(await createState(action.value)) };
}

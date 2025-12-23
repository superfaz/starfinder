"use server";

import { start } from "chain-of-actions";
import { z } from "zod";
import { ActionResult } from "app/helpers-server";
import { DataSets } from "data";
import { NotFoundError, ParsingError } from "logic";
import { AbilityScoreIdSchema, IdSchema } from "model";
import { prepareActionContext } from "../../helpers-server";
import { createState, UpdateState } from "./createState";

const UpdateThemelessInputSchema = z.object({
  characterId: IdSchema,
  abilityScoreId: AbilityScoreIdSchema,
});

export type UpdateThemelessInput = z.infer<typeof UpdateThemelessInputSchema>;

export async function updateThemelessAbilityScore(
  data: UpdateThemelessInput
): Promise<ActionResult<UpdateThemelessInput, UpdateState>> {
  const context = await prepareActionContext(UpdateThemelessInputSchema, data);

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
    .onSuccess(({ input, builder }) => builder.updateThemelessAbilityScore(input.abilityScoreId))
    .onSuccess(({ dataSource, builder }) => dataSource.get(DataSets.Characters).update(builder.character))
    .runAsync();

  if (!action.success) {
    return { success: false, errors: { abilityScoreId: ["Invalid"] } };
  }

  return { success: true, ...(await createState(action.value)) };
}

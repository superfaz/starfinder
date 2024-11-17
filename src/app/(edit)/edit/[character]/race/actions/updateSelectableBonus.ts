"use server";

import { start } from "chain-of-actions";
import { z } from "zod";
import { ActionResult } from "app/helpers-server";
import { DataSets } from "data";
import { NotFoundError, ParsingError } from "logic";
import { AbilityScoreIdSchema, IdSchema } from "model";
import { prepareActionContext } from "../../helpers-server";
import { createState, UpdateState } from "./createState";

const UpdateSelectableBonusInputSchema = z.object({
  characterId: IdSchema,
  abilityScoreId: AbilityScoreIdSchema,
});

export type UpdateSelectableBonusInput = z.infer<typeof UpdateSelectableBonusInputSchema>;

export async function updateSelectableBonus(data: {
  characterId: string;
  abilityScoreId: string;
}): Promise<ActionResult<UpdateSelectableBonusInput, UpdateState>> {
  const context = await prepareActionContext(UpdateSelectableBonusInputSchema, data);

  if (!context.success) {
    if (context.error instanceof ParsingError) {
      return { success: false, errors: context.error.errors };
    } else if (context.error instanceof NotFoundError) {
      return { success: false, errors: { abilityScoreId: ["Not found"] } };
    } else {
      throw context.error;
    }
  }

  const action = await start(context.value)
    .onSuccess((_, { input, builder }) => builder.updateRaceSelectableBonus(input.abilityScoreId))
    .onSuccess((_, { dataSource, builder }) => dataSource.get(DataSets.Characters).update(builder.character))
    .runAsync();

  if (!action.success) {
    return { success: false, errors: { abilityScoreId: ["Invalid"] } };
  }

  return { success: true, ...(await createState(action.value)) };
}

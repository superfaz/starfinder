"use server";

import { start } from "chain-of-actions";
import { z } from "zod";
import { ActionResult } from "app/helpers-server";
import { DataSets } from "data";
import { NotFoundError, ParsingError } from "logic";
import { IdSchema } from "model";
import { prepareActionContext } from "../../helpers-server";
import { createState, UpdateState } from "./createState";

const UpdateSoldierAbilityScoreInputSchema = z.object({
  characterId: IdSchema,
  abilityScoreId: IdSchema,
});

export type UpdateSoldierAbilityScoreInput = z.infer<typeof UpdateSoldierAbilityScoreInputSchema>;

export async function updateSoldierAbilityScore(
  data: UpdateSoldierAbilityScoreInput
): Promise<ActionResult<UpdateSoldierAbilityScoreInput, UpdateState>> {
  const context = await prepareActionContext(UpdateSoldierAbilityScoreInputSchema, data);

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
    .onSuccess((_, { input, builder }) => builder.updateSoldierAbilityScore(input.abilityScoreId))
    .onSuccess((_, { dataSource, builder }) => dataSource.get(DataSets.Characters).update(builder.character))
    .runAsync();

  if (!action.success) {
    return { success: false, errors: { abilityScoreId: ["Invalid"] } };
  }

  return { success: true, ...(await createState(action.value)) };
}

const UpdateSoldierPrimaryStyleInputSchema = z.object({
  characterId: IdSchema,
  styleId: IdSchema,
});

export type UpdateSoldierPrimaryStyleInput = z.infer<typeof UpdateSoldierPrimaryStyleInputSchema>;

export async function updateSoldierPrimaryStyle(
  data: UpdateSoldierPrimaryStyleInput
): Promise<ActionResult<UpdateSoldierPrimaryStyleInput, UpdateState>> {
  const context = await prepareActionContext(UpdateSoldierPrimaryStyleInputSchema, data);

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
    .onSuccess((_, { input, builder }) => builder.updateSoldierPrimaryStyle(input.styleId))
    .onSuccess((_, { dataSource, builder }) => dataSource.get(DataSets.Characters).update(builder.character))
    .runAsync();

  if (!action.success) {
    return { success: false, errors: { styleId: ["Invalid"] } };
  }

  return { success: true, ...(await createState(action.value)) };
}

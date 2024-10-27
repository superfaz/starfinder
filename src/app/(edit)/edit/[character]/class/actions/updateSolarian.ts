"use server";

import { start } from "chain-of-actions";
import { z } from "zod";
import { ActionResult } from "app/helpers-server";
import { DataSets } from "data";
import { NotFoundError, ParsingError } from "logic";
import { IdSchema } from "model";
import { prepareActionContext } from "../../helpers-server";
import { createState, UpdateState } from "./createState";

const UpdateSolarianColorInputSchema = z.object({
  characterId: IdSchema,
  colorId: IdSchema,
});

export type UpdateSolarianColorInput = z.infer<typeof UpdateSolarianColorInputSchema>;

export async function updateSolarianColor(
  data: UpdateSolarianColorInput
): Promise<ActionResult<UpdateSolarianColorInput, UpdateState>> {
  const context = await prepareActionContext(UpdateSolarianColorInputSchema, data);

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
    .onSuccess((_, { input, builder }) => builder.updateSolarianColor(input.colorId))
    .onSuccess((_, { dataSource, builder }) => dataSource.get(DataSets.Characters).update(builder.character))
    .runAsync();

  if (!action.success) {
    return { success: false, errors: { colorId: ["Invalid"] } };
  }

  return { success: true, ...(await createState(action.value)) };
}

const UpdateSolarianDamageTypeInputSchema = z.object({
  characterId: IdSchema,
  damageTypeId: IdSchema,
});

export type UpdateSolarianDamageTypeInput = z.infer<typeof UpdateSolarianDamageTypeInputSchema>;

export async function updateSolarianDamageType(
  data: UpdateSolarianDamageTypeInput
): Promise<ActionResult<UpdateSolarianDamageTypeInput, UpdateState>> {
  const context = await prepareActionContext(UpdateSolarianDamageTypeInputSchema, data);

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
    .onSuccess((_, { input, builder }) => builder.updateSolarianDamageType(input.damageTypeId))
    .onSuccess((_, { dataSource, builder }) => dataSource.get(DataSets.Characters).update(builder.character))
    .runAsync();

  if (!action.success) {
    return { success: false, errors: { damageTypeId: ["Invalid"] } };
  }

  return { success: true, ...(await createState(action.value)) };
}

const UpdateSolarianManifestationInputSchema = z.object({
  characterId: IdSchema,
  manifestationId: IdSchema,
});

export type UpdateSolarianManifestationInput = z.infer<typeof UpdateSolarianManifestationInputSchema>;

export async function updateSolarianManifestation(
  data: UpdateSolarianManifestationInput
): Promise<ActionResult<UpdateSolarianManifestationInput, UpdateState>> {
  const context = await prepareActionContext(UpdateSolarianManifestationInputSchema, data);

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
    .onSuccess((_, { input, builder }) => builder.updateSolarianDamageType(input.manifestationId))
    .onSuccess((_, { dataSource, builder }) => dataSource.get(DataSets.Characters).update(builder.character))
    .runAsync();

  if (!action.success) {
    return { success: false, errors: { manifestationId: ["Invalid"] } };
  }

  return { success: true, ...(await createState(action.value)) };
}

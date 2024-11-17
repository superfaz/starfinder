"use server";

import { fail, start, succeed } from "chain-of-actions";
import { z } from "zod";
import { ActionResult } from "app/helpers-server";
import { DataSets } from "data";
import { NotFoundError, ParsingError } from "logic";
import { createCharacterPresenter } from "logic/server";
import { IdSchema } from "model";
import { prepareActionContext } from "../../helpers-server";
import { createState, UpdateState } from "./createState";

const UpdateTraitInputSchema = z.object({
  characterId: IdSchema,
  traitId: IdSchema,
  enable: z.boolean(),
});

export type UpdateTraitInput = z.infer<typeof UpdateTraitInputSchema>;

export async function updateSecondaryTrait(
  data: UpdateTraitInput
): Promise<ActionResult<UpdateTraitInput, UpdateState>> {
  const context = await start()
    .onSuccess(() => prepareActionContext(UpdateTraitInputSchema, data))
    .addData(createCharacterPresenter)
    .runAsync();

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
    .onSuccess(async (_, { presenter }) => presenter.getSecondaryRaceTraits())
    .onSuccess((traits, { input }) => succeed(traits.find((t) => t.id === input.traitId)))
    .onSuccess((trait) => (trait !== undefined ? succeed(trait) : fail(new NotFoundError())))
    .onSuccess((trait, { builder, input }) =>
      input.enable ? builder.enableSecondaryTrait(trait) : builder.disableSecondaryTrait(trait)
    )
    .onSuccess((_, { dataSource, builder }) => dataSource.get(DataSets.Characters).update(builder.character))
    .runAsync();

  if (!action.success) {
    if (action.error instanceof NotFoundError) {
      return { success: false, errors: { traitId: ["Not found"] } };
    } else {
      return { success: false, errors: { traitId: ["Invalid"] } };
    }
  }

  return { success: true, ...(await createState(action.value)) };
}

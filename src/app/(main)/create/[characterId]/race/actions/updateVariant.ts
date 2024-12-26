"use server";

import { PromisedResult, fail, onError, onSuccessGrouped, start, succeed } from "chain-of-actions";
import { z } from "zod";
import { DataSourceError, ParsingError, createParsingError } from "logic";
import { CharacterBuilder, characterService } from "logic/server";
import { IdSchema } from "model";
import { prepareActionContext } from "../../context";
import { State, createState } from "../state";

const UpdateVariantInputSchema = z.object({
  characterId: IdSchema,
  variantId: IdSchema,
});

export type UpdateVariantInput = z.infer<typeof UpdateVariantInputSchema>;

export async function updateVariant(data: UpdateVariantInput): PromisedResult<State, ParsingError> {
  const context = await prepareActionContext(UpdateVariantInputSchema, data);
  if (!context.success) {
    return fail(context.error);
  }

  const action = await start()
    .withContext(context.value)
    .add(onSuccessGrouped(CharacterBuilder.updateRaceVariant))
    .add(onSuccessGrouped(characterService.update))
    .add(
      onError((error) => {
        console.error(error);
        return fail(createParsingError({ variantId: ["Invalid"] }));
      })
    )
    .add(onSuccessGrouped(createState))
    .add(
      onError((error) => {
        if (error instanceof DataSourceError) {
          throw error;
        } else {
          return fail(error);
        }
      })
    )
    .runAsync();

  return action.success ? succeed(action.value.state) : fail(action.error);
}

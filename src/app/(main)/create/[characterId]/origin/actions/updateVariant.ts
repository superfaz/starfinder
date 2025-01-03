"use server";

import { PromisedResult, fail, onError, onSuccessGrouped, start, succeed } from "chain-of-actions";
import { z } from "zod";
import { ParsingError, createParsingError, isParsingError } from "logic";
import { CharacterBuilder, characterService } from "logic/server";
import { IdSchema } from "model";
import { prepareActionContext } from "../../context";
import { State } from "../state";
import { createState } from "./createState";

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
        if (isParsingError(error)) {
          return fail(error);
        } else {
          throw error;
        }
      })
    )
    .runAsync();

  return action.success ? succeed(action.value.state) : fail(action.error);
}

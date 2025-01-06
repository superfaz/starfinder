"use server";

import { z } from "zod";
import { PromisedResult, fail, onError, onSuccessGrouped, start, succeed } from "chain-of-actions";
import { ParsingError, createParsingError, isParsingError } from "logic";
import { CharacterBuilder, characterService } from "logic/server";
import { IdSchema } from "model";
import { prepareActionContext } from "../../context";
import { State } from "../state";
import { createState } from "./createState";

const UpdateOriginInputSchema = z.object({
  characterId: IdSchema,
  originId: IdSchema,
});

type UpdateOriginInput = z.infer<typeof UpdateOriginInputSchema>;

export async function updateOrigin(data: UpdateOriginInput): PromisedResult<State, ParsingError> {
  const context = await prepareActionContext(UpdateOriginInputSchema, data);
  if (!context.success) {
    return fail(context.error);
  }

  const action = await start()
    .withContext(context.value)
    .add(onSuccessGrouped(CharacterBuilder.updateOrigin))
    .add(onSuccessGrouped(characterService.update))
    .add(
      onError((error) => {
        console.error(error);
        return fail(createParsingError({ originId: ["Invalid"] }));
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

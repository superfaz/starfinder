"use server";

import { z } from "zod";
import { PromisedResult, fail, onError, onSuccessGrouped, start, succeed } from "chain-of-actions";
import { DataSourceError, NotFoundError, ParsingError, createParsingError } from "logic";
import { CharacterBuilder, characterService } from "logic/server";
import { IdSchema } from "model";
import { prepareActionContext } from "../../context";
import { createState, State } from "../state";

const UpdateRaceInputSchema = z.object({
  characterId: IdSchema,
  raceId: IdSchema,
});

export type UpdateRaceInput = z.infer<typeof UpdateRaceInputSchema>;

export async function updateRace(data: UpdateRaceInput): PromisedResult<State, ParsingError> {
  const context = await prepareActionContext(UpdateRaceInputSchema, data);
  if (!context.success) {
    return fail(context.error);
  }

  const action = await start()
    .withContext(context.value)
    .add(onSuccessGrouped(CharacterBuilder.updateRace))
    .add(onSuccessGrouped(characterService.update))
    .add(
      onError((error) => {
        console.error(error);
        return fail(createParsingError({ raceId: ["Invalid"] }));
      })
    )
    .add(onSuccessGrouped(createState))
    .add(
      onError((error) => {
        if (error instanceof DataSourceError) {
          throw error;
        } else if (error instanceof NotFoundError) {
          throw error;
        } else {
          return fail(error);
        }
      })
    )
    .runAsync();

  return action.success ? succeed(action.value.state) : fail(action.error);
}

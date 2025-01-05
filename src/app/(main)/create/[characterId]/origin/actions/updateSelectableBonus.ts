"use server";

import { fail, onError, onSuccessGrouped, PromisedResult, start, succeed } from "chain-of-actions";
import { z } from "zod";
import { createParsingError, isParsingError, ParsingError } from "logic";
import { CharacterBuilder, characterService } from "logic/server";
import { AbilityScoreIdSchema, IdSchema } from "model";
import { prepareActionContext } from "../../context";
import { State } from "../state";
import { createState } from "./createState";

const UpdateSelectableBonusInputSchema = z.object({
  characterId: IdSchema,
  abilityScoreId: AbilityScoreIdSchema,
});

export type UpdateSelectableBonusInput = z.infer<typeof UpdateSelectableBonusInputSchema>;

export async function updateSelectableBonus(data: {
  characterId: string;
  abilityScoreId: string;
}): PromisedResult<State, ParsingError> {
  const context = await prepareActionContext(UpdateSelectableBonusInputSchema, data);
  if (!context.success) {
    return fail(context.error);
  }

  const action = await start()
    .withContext(context.value)
    .add(onSuccessGrouped(CharacterBuilder.updateOriginSelectableBonus))
    .add(onSuccessGrouped(characterService.update))
    .add(
      onError((error) => {
        console.error(error);
        return fail(createParsingError({ abilityScoreId: ["Invalid"] }));
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

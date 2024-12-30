"use server";

import { fail, onError, onSuccessGrouped, PromisedResult, start, succeed } from "chain-of-actions";
import { z } from "zod";
import { ParsingError } from "logic";
import { CharacterBuilder, characterService, raceService } from "logic/server";
import { Character, IdSchema } from "model";
import { prepareActionContext } from "../../context";
import { createState, State } from "../state";

const UpdateTraitInputSchema = z.object({
  characterId: IdSchema,
  traitId: IdSchema,
  enable: z.boolean(),
});

export type UpdateTraitInput = z.infer<typeof UpdateTraitInputSchema>;

export async function updateSecondaryTrait(data: UpdateTraitInput): PromisedResult<State, ParsingError> {
  const context = await prepareActionContext(UpdateTraitInputSchema, data);

  if (!context.success) {
    return fail(context.error);
  }

  const action = await start()
    .withContext(context.value)
    .add(onSuccessGrouped(({ character }: { character: Character }) => succeed({ raceId: character.race })))
    .add(onSuccessGrouped(raceService.retrieveOne))
    .add(onSuccessGrouped(raceService.retrieveSecondaryTrait))
    .add(
      onSuccessGrouped(({ character, trait, enable }) =>
        enable
          ? CharacterBuilder.enableSecondaryTrait(character, trait)
          : CharacterBuilder.disableSecondaryTrait(character, trait)
      )
    )
    .add(onSuccessGrouped(characterService.update))
    .add(onSuccessGrouped(createState))
    .add(
      onError((error) => {
        throw error;
      })
    )
    .runAsync();

  return succeed(action.value.state);
}

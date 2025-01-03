"use server";

import { fail, onError, onSuccessGrouped, PromisedResult, start, succeed } from "chain-of-actions";
import { z } from "zod";
import { ParsingError } from "logic";
import { CharacterBuilder, characterService, originService } from "logic/server";
import { Character, IdSchema } from "model";
import { prepareActionContext } from "../../context";
import { State } from "../state";
import { createState } from "./createState";

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
    .add(onSuccessGrouped(({ character }: { character: Character }) => succeed({ originId: character.origin })))
    .add(onSuccessGrouped(originService.retrieveOne))
    .add(onSuccessGrouped(originService.retrieveSecondaryTrait))
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

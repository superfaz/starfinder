import {
  addDataGrouped,
  fail,
  onSuccess,
  onSuccessGrouped,
  passThrough,
  PromisedResult,
  start,
  succeed,
} from "chain-of-actions";
import { DataSourceError, NotFoundError } from "logic/errors";
import { IDataSource } from "data";
import { Character } from "model";
import { avatarService, raceService } from "..";

/**
 * Updates the race associated with a character.
 *
 * Ensure that the variant, options, traits and ability scores are reset.
 *
 * @param raceId - the identifier of its new race
 * @returns A promise that resolved to `undefined` in case of success, or an error otherwise.
 */
export async function updateRace(params: {
  dataSource: IDataSource;
  character: Character;
  raceId: string;
}): PromisedResult<{ character: Character }, DataSourceError | NotFoundError> {
  if (params.character.race === params.raceId) {
    // No change
    return succeed({ character: params.character });
  }

  const action = await start()
    .withContext(params)
    .add(onSuccessGrouped(raceService.retrieveOne))
    .add(addDataGrouped(avatarService.retrieveAll))
    .runAsync();

  if (!action.success) {
    return fail(action.error);
  }

  const result: Character = {
    ...params.character,
    race: action.value.race.id,
    raceVariant: action.value.race.variants[0].id,
    raceOptions: undefined,
    traits: action.value.race.traits.map((t) => t.id),
    avatar: action.value.avatars.filter((avatar) => avatar.tags.includes(params.raceId))[0].id,
  };

  return succeed({ character: result });
}

/**
 * Updates the race variant associated with a character.
 *
 * Ensure that the options and ability scores are reset.
 *
 * @param variantId - the identifier of its new race variant
 * @returns A promise that resolved to `undefined` in case of success, or an error otherwise.
 */
export async function updateRaceVariant(params: {
  dataSource: IDataSource;
  character: Character;
  variantId: string;
}): PromisedResult<{ character: Character }, DataSourceError | NotFoundError> {
  if (params.character.raceVariant === params.variantId) {
    // No change
    return succeed({ character: params.character });
  }

  const variant = await start()
    .withContext(params)
    .add(onSuccessGrouped(({ character }: { character: Character }) => succeed({ raceId: character.race })))
    .add(onSuccessGrouped(raceService.retrieveOne))
    .add(onSuccess(({ race }, { variantId }) => succeed(race.variants.find((v) => v.id === variantId))))
    .add(
      passThrough((variant) =>
        variant === undefined ? fail(new NotFoundError("variants", params.variantId)) : succeed()
      )
    )
    .runAsync();

  if (!variant.success) {
    return fail(variant.error);
  }

  const result: Character = {
    ...params.character,
    raceVariant: params.variantId,
    raceOptions: undefined,
  };

  return succeed({ character: result });
}

/**
 * Updates the ability score selected as a bonus for race variant letting the user choose its bonus.
 *
 * Ensure that the ability scores are reset.
 *
 * @param data - the data set
 * @param character - the character to update
 * @param abilityScoreId - the identifier of the selected ability score
 * @returns A promise that resolved to `undefined` in case of success, or an error otherwise.
 */
export async function updateRaceSelectableBonus(params: {
  dataSource: IDataSource;
  character: Character;
  abilityScoreId: string;
}): PromisedResult<{ character: Character }, DataSourceError | NotFoundError> {
  const result: Character = {
    ...params.character,
    raceOptions: { selectableBonus: params.abilityScoreId },
  };

  return succeed({ character: result });
}

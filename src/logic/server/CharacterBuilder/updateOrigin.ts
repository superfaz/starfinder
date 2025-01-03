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
import { avatarService, originService } from "..";

/**
 * Updates the origin associated with a character.
 *
 * Ensure that the variant, options, traits and ability scores are reset.
 *
 * @param originId - the identifier of its new origin
 * @returns A promise that resolved to `undefined` in case of success, or an error otherwise.
 */
export async function updateOrigin(params: {
  dataSource: IDataSource;
  character: Character;
  originId: string;
}): PromisedResult<{ character: Character }, DataSourceError | NotFoundError> {
  if (params.character.origin === params.originId) {
    // No change
    return succeed({ character: params.character });
  }

  const action = await start()
    .withContext(params)
    .add(onSuccessGrouped(originService.retrieveOne))
    .add(addDataGrouped(avatarService.retrieveAll))
    .runAsync();

  if (!action.success) {
    return fail(action.error);
  }

  const result: Character = {
    ...params.character,
    origin: action.value.origin.id,
    variant: action.value.origin.variants[0].id,
    originOptions: undefined,
    traits: action.value.origin.traits.map((t) => t.id),
    avatar: action.value.avatars.filter((avatar) => avatar.tags.includes(params.originId))[0].id,
  };

  return succeed({ character: result });
}

/**
 * Updates the variant associated with a character.
 *
 * Ensure that the options and ability scores are reset.
 *
 * @param variantId - the identifier of its new variant
 * @returns A promise that resolved to `undefined` in case of success, or an error otherwise.
 */
export async function updateOriginVariant(params: {
  dataSource: IDataSource;
  character: Character;
  variantId: string;
}): PromisedResult<{ character: Character }, DataSourceError | NotFoundError> {
  if (params.character.variant === params.variantId) {
    // No change
    return succeed({ character: params.character });
  }

  const variant = await start()
    .withContext(params)
    .add(onSuccessGrouped(({ character }: { character: Character }) => succeed({ originId: character.origin })))
    .add(onSuccessGrouped(originService.retrieveOne))
    .add(onSuccess(({ origin }, { variantId }) => succeed(origin.variants.find((v) => v.id === variantId))))
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
    variant: params.variantId,
    originOptions: undefined,
  };

  return succeed({ character: result });
}

/**
 * Updates the ability score selected as a bonus for variant letting the user choose its bonus.
 *
 * Ensure that the ability scores are reset.
 *
 * @param data - the data set
 * @param character - the character to update
 * @param abilityScoreId - the identifier of the selected ability score
 * @returns A promise that resolved to `undefined` in case of success, or an error otherwise.
 */
export async function updateOriginSelectableBonus(params: {
  dataSource: IDataSource;
  character: Character;
  abilityScoreId: string;
}): PromisedResult<{ character: Character }, DataSourceError | NotFoundError> {
  const result: Character = {
    ...params.character,
    originOptions: { selectableBonus: params.abilityScoreId },
  };

  return succeed({ character: result });
}

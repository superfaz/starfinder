import { fail, onSuccess, PromisedResult, start, succeed } from "chain-of-actions";
import { DataSourceError, NotFoundError } from "logic/errors";
import { DataSets } from "data";
import { Character } from "model";
import { CharacterBuilder } from ".";

/**
 * Updates the race associated with a character.
 *
 * Ensure that the variant, options, traits and ability scores are reset.
 *
 * @param raceId - the identifier of its new race
 * @returns A promise that resolved to `undefined` in case of success, or an error otherwise.
 */
export async function updateRace(
  this: CharacterBuilder,
  raceId: string
): PromisedResult<undefined, DataSourceError | NotFoundError> {
  if (this.character.race === raceId) {
    // No change
    return succeed();
  }

  const race = await start()
    .add(onSuccess(() => this.dataSource.get(DataSets.Races).findOne(raceId)))
    .add(onSuccess((race) => (race === undefined ? fail(new NotFoundError()) : succeed(race))))
    .runAsync();

  if (!race.success) {
    return fail(race.error);
  }

  const avatars = await this.dataSource.get(DataSets.Avatars).getAll();

  if (!avatars.success) {
    return fail(avatars.error);
  }

  const result: Character = {
    ...this.character,
    race: race.value.id,
    raceVariant: race.value.variants[0].id,
    raceOptions: undefined,
    traits: race.value.traits.map((t) => t.id),
  };

  // Special case - prepare the associated options
  if (Object.keys(race.value.variants[0].abilityScores).length === 0) {
    const abilityScores = await this.dataSource.get(DataSets.AbilityScores).getAll();
    if (!abilityScores.success) {
      return fail(abilityScores.error);
    }

    result.raceOptions = { selectableBonus: abilityScores.value[0].id };
  }

  const abilityScores = await this.computeMinimalAbilityScores(result);
  result.abilityScores = abilityScores.success ? abilityScores.value : {};
  result.avatar = avatars.value.filter((avatar) => avatar.tags.includes(raceId))[0].id;

  this.character = result;
  return succeed();
}

/**
 * Updates the race variant associated with a character.
 *
 * Ensure that the options and ability scores are reset.
 *
 * @param variantId - the identifier of its new race variant
 * @returns A promise that resolved to `undefined` in case of success, or an error otherwise.
 */
export async function updateRaceVariant(
  this: CharacterBuilder,
  variantId: string
): PromisedResult<undefined, DataSourceError | NotFoundError> {
  if (this.character.raceVariant === variantId) {
    // No change
    return succeed();
  }

  const variant = await start()
    .add(onSuccess(() => this.dataSource.get(DataSets.Races).findOne(this.character.race)))
    .add(onSuccess((race) => (race === undefined ? fail(new NotFoundError()) : succeed(race))))
    .add(onSuccess((race) => succeed(race.variants.find((v) => v.id === variantId))))
    .add(onSuccess((variant) => (variant === undefined ? fail(new NotFoundError()) : succeed(variant))))
    .runAsync();

  if (!variant.success) {
    return fail(variant.error);
  }

  const result: Character = {
    ...this.character,
    raceVariant: variantId,
    raceOptions: undefined,
  };

  // Special case - prepare the associated options
  console.log(variant.value.name, variant.value.abilityScores);
  if (Object.keys(variant.value.abilityScores).length === 0) {
    const abilityScores = await this.dataSource.get(DataSets.AbilityScores).getAll();
    if (!abilityScores.success) {
      return fail(abilityScores.error);
    }
    result.raceOptions = { selectableBonus: abilityScores.value[0].id };
  }

  const abilityScores = await this.computeMinimalAbilityScores(result);
  result.abilityScores = abilityScores.success ? abilityScores.value : {};

  this.character = result;
  return succeed();
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
export async function updateRaceSelectableBonus(
  this: CharacterBuilder,
  abilityScoreId: string
): PromisedResult<undefined, DataSourceError | NotFoundError> {
  const result: Character = {
    ...this.character,
    raceOptions: { selectableBonus: abilityScoreId },
  };

  const abilityScores = await this.computeMinimalAbilityScores(result);
  result.abilityScores = abilityScores.success ? abilityScores.value : {};

  this.character = result;
  return succeed();
}

import { fail, PromisedResult, succeed } from "chain-of-actions";
import { InvalidError } from "logic/errors";
import { RaceFeature } from "view";
import { CharacterBuilder } from ".";

/**
 * Enables a secondary trait for a character.
 *
 * Ensure that the associated primary traits are disabled.
 *
 * @param trait - the enabled secondary trait
 * @returns A promise that resolved to `undefined` in case of success, or an error otherwise.
 */
export async function enableSecondaryTrait(
  this: CharacterBuilder,
  trait: RaceFeature
): PromisedResult<undefined, InvalidError> {
  const traits = this.character.traits.filter((t) => !trait.replace.find((r) => r.id === t));

  // Validate that the replaced traits were available
  if (traits.length + trait.replace.length !== this.character.traits.length) {
    return fail(new InvalidError());
  }

  this.character = { ...this.character, traits: [...traits, trait.id] };
  return succeed(undefined);
}

/**
 * Disables a secondary trait for a character.
 *
 * Ensure that the associated primary traits are enabled.
 *
 * @param trait - the disabled secondary trait
 * @returns A promise that resolved to `undefined` in case of success, or an error otherwise.
 */
export async function disableSecondaryTrait(
  this: CharacterBuilder,
  trait: RaceFeature
): PromisedResult<undefined, InvalidError> {
  // Validate that the trait was enabled
  if (!this.character.traits.includes(trait.id)) {
    return fail(new InvalidError());
  }

  this.character = {
    ...this.character,
    traits: [...this.character.traits.filter((t) => t !== trait.id), ...trait.replace.map((r) => r.id)],
  };
  return succeed(undefined);
}

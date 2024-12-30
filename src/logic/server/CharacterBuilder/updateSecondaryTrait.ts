import { fail, PromisedResult, succeed } from "chain-of-actions";
import { InvalidError } from "logic/errors";
import { Character, FeatureTemplate } from "model";

/**
 * Enables a secondary trait for a character.
 *
 * Ensure that the associated primary traits are disabled.
 *
 * @param trait - the enabled secondary trait
 * @returns A promise that resolved to `undefined` in case of success, or an error otherwise.
 */
export function enableSecondaryTrait(
  character: Character,
  trait: FeatureTemplate
): PromisedResult<{ character: Character }, InvalidError> {
  if (trait.replace === undefined) {
    return fail(new InvalidError());
  }

  const traits = character.traits.filter((t) => !trait.replace!.find((r) => r === t));

  // Validate that the replaced traits were available
  if (traits.length + trait.replace.length !== character.traits.length) {
    return fail(new InvalidError());
  }

  const result = { ...character, traits: [...traits, trait.id] };
  return succeed({ character: result });
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
  character: Character,
  trait: FeatureTemplate
): PromisedResult<{ character: Character }, InvalidError> {
  if (trait.replace === undefined) {
    return fail(new InvalidError());
  }

  // Validate that the trait was enabled
  if (!character.traits.includes(trait.id)) {
    return fail(new InvalidError());
  }

  const result = {
    ...character,
    traits: [...character.traits.filter((t) => t !== trait.id), ...trait.replace],
  };
  return succeed({ character: result });
}

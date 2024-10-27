import { fail, PromisedResult, start, succeed } from "chain-of-actions";
import { DataSets } from "data";
import { DataSourceError, NotFoundError } from "logic/errors";
import { AbilityScoreIds, Character } from "model";
import { CharacterBuilder } from ".";

/**
 * Updates the class associated with a character.
 *
 * Ensure that the class options and ability scores are reset.
 *
 * @param classId - the identifier of its new class
 * @returns A promise that resolved to `undefined` in case of success, or an error otherwise.
 */
export async function updateClass(
  this: CharacterBuilder,
  classId: string
): PromisedResult<undefined, DataSourceError | NotFoundError> {
  if (this.character.class === classId) {
    // No change
    return succeed(undefined);
  }

  const klass = await start()
    .onSuccess(() => this.dataSource.get(DataSets.Class).findOne(classId))
    .onSuccess((klass) => (klass === undefined ? fail(new NotFoundError()) : succeed(klass)))
    .runAsync();

  if (!klass.success) {
    return fail(klass.error);
  }

  const result: Character = {
    ...this.character,
    class: klass.value.id,
    classOptions: undefined,
  };

  // Special cases - prepare the associated options
  switch (classId) {
    case "envoy":
      result.classOptions = { envoySkill: "bluf" };
      break;
    case "mechanic":
      result.classOptions = { mechanicStyle: "drone" };
      break;
    case "mystic":
      result.classOptions = { mysticConnection: "60ee0f41-3c5b-4aa4-93d8-f139f5b864b3" };
      break;
    case "operative":
      result.classOptions = { operativeSpecialization: "0110533f-eba1-4bad-ae1d-b18c584b7cbc" };
      break;
    case "solarian":
      result.classOptions = {
        solarianColor: "white",
        solarianManifestation: "weapon",
        solarianDamageType: "piercing",
      };
      break;
    case "soldier":
      result.classOptions = {
        soldierAbilityScore: AbilityScoreIds.str,
        soldierPrimaryStyle: "5103271c-c10e-4afc-8750-fb0e3e22c7d5",
      };
      break;
  }

  const abilityScores = await this.computeMinimalAbilityScores(result);
  result.abilityScores = abilityScores.success ? abilityScores.value : {};
  this.character = result;
  return succeed(undefined);
}

/**
 * Updates the skill selected as a class skill for an envoy character.
 *
 * @param character - the character to update
 * @param skillId - the identifier of the selected skill
 * @returns A promise that resolved to `undefined` in case of success, or an error otherwise.
 */
export async function updateEnvoySkill(this: CharacterBuilder, skillId: string): PromisedResult<undefined> {
  this.character = { ...this.character, classOptions: { ...this.character.classOptions, envoySkill: skillId } };

  return succeed(undefined);
}

/**
 * Updates the style selected for a mechanic character.
 *
 * @param character - the character to update
 * @param style - the selected style
 * @returns A promise that resolved to `undefined` in case of success, or an error otherwise.
 */
export async function updateMechanicStyle(this: CharacterBuilder, style: string): PromisedResult<undefined> {
  this.character = {
    ...this.character,
    classOptions: {
      ...this.character.classOptions,
      mechanicStyle: style,
    },
  };
  return succeed(undefined);
}

/**
 * Updates the connection selected for a mystic character.
 *
 * @param character - the character to update
 * @param connection - the selected connection
 * @returns A promise that resolved to `undefined` in case of success, or an error otherwise.
 */
export async function updateMysticConnection(this: CharacterBuilder, connection: string): PromisedResult<undefined> {
  this.character = {
    ...this.character,
    classOptions: {
      ...this.character.classOptions,
      mysticConnection: connection,
    },
  };
  return succeed(undefined);
}

/**
 * Updates the specialization selected for an operative character.
 *
 * @param character - the character to update
 * @param specialization - the selected operative specialization
 * @returns A promise that resolved to `undefined` in case of success, or an error otherwise.
 */
export async function updateOperativeSpecialization(
  this: CharacterBuilder,
  specialization: string
): PromisedResult<undefined> {
  this.character = {
    ...this.character,
    classOptions: {
      ...this.character.classOptions,
      operativeSpecialization: specialization,
    },
  };
  return succeed(undefined);
}

/**
 * Updates the manifestation color selected for a solarian character.
 *
 * @param character - the character to update
 * @param colorId - the identifier of the selected color
 * @returns A promise that resolved to `undefined` in case of success, or an error otherwise.
 */
export async function updateSolarianColor(this: CharacterBuilder, colorId: string): PromisedResult<undefined> {
  this.character = {
    ...this.character,
    classOptions: {
      ...this.character.classOptions,
      solarianColor: colorId,
    },
  };
  return succeed(undefined);
}

/**
 * Updates the manifestation type selected for a solarian character.
 *
 * @param character - the character to update
 * @param manifestationId - the identifier of the selected manifestation
 * @returns A promise that resolved to `undefined` in case of success, or an error otherwise.
 */
export async function updateSolarianManifestation(
  this: CharacterBuilder,
  manifestationId: string
): PromisedResult<undefined> {
  this.character = {
    ...this.character,
    classOptions: {
      ...this.character.classOptions,
      solarianManifestation: manifestationId,
    },
  };
  return succeed(undefined);
}

/**
 * Updates the damage type selected for a solarian weapon.
 *
 * @param character - the character to update
 * @param damageTypeId - the identifier of the selected damage type
 * @returns A promise that resolved to `undefined` in case of success, or an error otherwise.
 */
export async function updateSolarianDamageType(
  this: CharacterBuilder,
  damageTypeId: string
): PromisedResult<undefined> {
  this.character = {
    ...this.character,
    classOptions: {
      ...this.character.classOptions,
      solarianDamageType: damageTypeId,
    },
  };
  return succeed(undefined);
}

/**
 * Updates the primary ability score selected for a soldier character.
 *
 * @param character - the character to update
 * @param abilityScoreId - the identifier of the selected ability score
 * @returns A promise that resolved to `undefined` in case of success, or an error otherwise.
 */
export async function updateSoldierAbilityScore(
  this: CharacterBuilder,
  abilityScoreId: string
): PromisedResult<undefined> {
  this.character = {
    ...this.character,
    classOptions: {
      ...this.character.classOptions,
      soldierAbilityScore: abilityScoreId,
    },
  };
  return succeed(undefined);
}

/**
 * Updates the primary fightying style selected for a soldier character.
 *
 * @param character - the character to update
 * @param styleId - the identifier of the selected style
 * @returns A promise that resolved to `undefined` in case of success, or an error otherwise.
 */
export async function updateSoldierPrimaryStyle(this: CharacterBuilder, styleId: string): PromisedResult<undefined> {
  this.character = {
    ...this.character,
    classOptions: {
      ...this.character.classOptions,
      soldierPrimaryStyle: styleId,
    },
  };
  return succeed(undefined);
}

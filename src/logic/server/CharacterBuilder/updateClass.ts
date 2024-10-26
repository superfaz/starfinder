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
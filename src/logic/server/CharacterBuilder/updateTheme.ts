import { fail, PromisedResult, start, succeed } from "chain-of-actions";
import { DataSets } from "data";
import { DataSourceError, NotFoundError } from "logic/errors";
import { AbilityScoreIds, Character } from "model";
import { CharacterBuilder } from ".";

/**
 * Updates the theme associated with a character.
 *
 * Ensure that the theme options and ability scores are reset.
 *
 * @param themeId - the identifier of its new theme
 * @returns A promise that resolved to `undefined` in case of success, or an error otherwise.
 */
export async function updateTheme(
  this: CharacterBuilder,
  themeId: string
): PromisedResult<undefined, DataSourceError | NotFoundError> {
  if (this.character.theme === themeId) {
    // No change
    return succeed(undefined);
  }

  const theme = await start()
    .onSuccess(() => this.dataSource.get(DataSets.Themes).findOne(themeId))
    .onSuccess((theme) => (theme === undefined ? fail(new NotFoundError()) : succeed(theme)))
    .runAsync();

  if (!theme.success) {
    return fail(theme.error);
  }

  const result: Character = {
    ...this.character,
    theme: theme.value.id,
    themeOptions: undefined,
  };

  // Special cases - prepare the associated options
  if (theme.value.id === "scholar") {
    // Theme: Scholar
    result.themeOptions = {
      scholarSkill: "life",
      scholarSpecialization: "",
    };
  } else if (theme.value.id === "themeless") {
    // Theme: No theme
    result.themeOptions = { themelessAbility: AbilityScoreIds.str };
  }

  const abilityScores = await this.computeMinimalAbilityScores(result);
  result.abilityScores = abilityScores.success ? abilityScores.value : {};

  this.character = result;
  return succeed(undefined);
}

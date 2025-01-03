import { fail, onSuccess, PromisedResult, start, succeed } from "chain-of-actions";
import { DataSets } from "data";
import { DataSourceError } from "logic/errors";
import { Character } from "model";
import { CharacterBuilder } from ".";

/**
 * Computes the minimal ability scores for a specific character.
 *
 * @param character - the reference character
 * @returns The minimal ability scores for the specified character
 */
export async function computeMinimalAbilityScores(
  this: CharacterBuilder,
  character: Character
): PromisedResult<Record<string, number>, DataSourceError> {
  const selectedVariant = await start()
    .add(onSuccess(() => this.dataSource.get(DataSets.Races).findOne(character.origin)))
    .add(onSuccess((selectedRace) => succeed(selectedRace?.variants.find((v) => v.id === character.variant))))
    .runAsync();
  if (!selectedVariant.success) {
    return fail(selectedVariant.error);
  }

  const selectedTheme = await this.dataSource.get(DataSets.Themes).findOne(character.theme);
  if (!selectedTheme.success) {
    return fail(selectedTheme.error);
  }

  const abilityScores = await this.dataSource.get(DataSets.AbilityScores).getAll();
  if (!abilityScores.success) {
    return fail(abilityScores.error);
  }

  const scores: Record<string, number> = {};
  abilityScores.value.forEach((abilityScore) => {
    let score = 10;

    if (selectedVariant.value) {
      score += selectedVariant.value.abilityScores[abilityScore.id] ?? 0;
    }

    if (selectedTheme.value) {
      score += selectedTheme.value.abilityScores[abilityScore.id] ?? 0;
    }

    if (character.originOptions !== undefined && abilityScore.id === character.originOptions.selectableBonus) {
      // Variant with selectable bonus
      score += 2;
    }

    if (
      character.theme === "themeless" &&
      character.themeOptions !== undefined &&
      abilityScore.id === character.themeOptions.themelessAbility
    ) {
      // Theme: No Theme
      score += 1;
    }

    scores[abilityScore.id] = score;
  });

  return succeed(scores);
}

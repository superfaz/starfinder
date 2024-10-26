import { fail, PromisedResult, start, succeed } from "chain-of-actions";
import { DataSets } from "data";
import { DataSourceError, NotFoundError, ThemeNotSetError } from "logic/errors";
import { AbilityScoreId, AbilityScoreIds, Character, simpleHash } from "model";
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

export async function updateIconProfession(
  this: CharacterBuilder,
  abilityScoreId: AbilityScoreId,
  name: string
): PromisedResult<undefined, ThemeNotSetError> {
  if (this.character.theme !== "icon") {
    return fail(new ThemeNotSetError());
  }

  // An icon profession is already set
  if (this.character.themeOptions?.iconProfession) {
    const profession = this.character.professionSkills.find(
      (p) => p.id === this.character.themeOptions?.iconProfession
    );
    if (profession?.name === name && profession.abilityScore === abilityScoreId) {
      // No change
      return succeed(undefined);
    }

    // Remove the current profession
    if (profession) {
      this.character = {
        ...this.character,
        professionSkills: this.character.professionSkills.filter((p) => p.id !== profession.id),
      };
    }
  }

  // The name is empty, remove the theme options
  if (name === "") {
    this.character = {
      ...this.character,
      themeOptions: undefined,
    };
    return succeed(undefined);
  }

  const id = "prof-" + simpleHash(name);

  // Register the change
  const result: Character = {
    ...this.character,
    themeOptions: {
      iconProfession: id,
    },
  };

  // Add the new profession
  result.professionSkills.push({
    id,
    abilityScore: abilityScoreId,
    name,
  });

  this.character = result;
  return succeed(undefined);
}

/**
 * Updates the scholar skill selected for a character.
 *
 * Ensure that the scholar specialization is reset.
 *
 * @param data - the data set
 * @param character - the character to update
 * @param skillId - the identifier of the selected scholar skill
 * @returns A promise that resolved to `undefined` in case of success, or an error otherwise.
 */
export async function updateScholarSkill(this: CharacterBuilder, skillId: string): PromisedResult<undefined> {
  const result: Character = {
    ...this.character,
    themeOptions: {
      ...this.character.themeOptions,
      scholarSkill: skillId,
      scholarSpecialization: "",
    },
  };

  this.character = result;
  return succeed(undefined);
}

/**
 * Updates the scholar specialization selected for a character.
 *
 * @param character - the character to update
 * @param specialization - the selected scholar specialization or its label
 * @returns A promise that resolved to `undefined` in case of success, or an error otherwise.
 */
export async function updateScholarSpecialization(
  this: CharacterBuilder,
  specialization: string
): PromisedResult<undefined> {
  const result = {
    ...this.character,
    themeOptions: {
      ...this.character.themeOptions,
      scholarSpecialization: specialization,
    },
  };

  this.character = result;
  return succeed(undefined);
}

/**
 * Updates the ability score selected as a bonus for a character with 'no theme'.
 *
 * @param data - the data set
 * @param character - the character to update
 * @param abilityScoreId - the identifier of the selected ability score
 * @returns A promise that resolved to `undefined` in case of success, or an error otherwise.
 */
export async function updateThemelessAbilityScore(
  this: CharacterBuilder,
  abilityScoreId: string
): PromisedResult<undefined> {
  const result: Character = {
    ...this.character,
    themeOptions: {
      ...this.character.themeOptions,
      themelessAbility: abilityScoreId,
    },
  };

  const abilityScores = await this.computeMinimalAbilityScores(result);
  result.abilityScores = abilityScores.success ? abilityScores.value : {};

  this.character = result;
  return succeed(undefined);
}

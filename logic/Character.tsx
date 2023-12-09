import { findOrError } from "app/helpers";
import { DataSet } from "data";
import { Character, SecondaryTrait } from "model";

/**
 * Updates the race associated with a character.
 *
 * Ensure that the variant, options, traits and ability scores are reset.
 *
 * @param data The data set
 * @param character The character to update
 * @param raceId The identifier of its new race
 * @returns The updated character
 */
export function updateRace(data: DataSet, character: Character, raceId: string): Character {
  const race = findOrError(data.races, (r) => r.id === raceId);

  if (character.race === raceId) {
    // No change
    return character;
  }

  let result: Character = {
    ...character,
    race: race.id,
    raceVariant: race.variants[0].id,
    raceOptions: undefined,
    traits: race.traits.map((t) => t.id),
    abilityScores: { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 },
  };

  // Special case - prepare the associated options
  if (raceId === "humans") {
    result.raceOptions = { humanBonus: data.abilityScores[0].id };
  }

  return result;
}

/**
 * Updates the race variant associated with a character.
 *
 * Ensure that the options and ability scores are reset.
 *
 * @param data The data set
 * @param character The character to update
 * @param variantId The identifier of its new race variant
 * @returns The updated character
 */
export function updateVariant(data: DataSet, character: Character, variantId: string): Character {
  if (character.raceVariant === variantId) {
    // No change
    return character;
  }

  let result: Character = {
    ...character,
    raceVariant: variantId,
    raceOptions: undefined,
    abilityScores: { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 },
  };

  // Special case - prepare the associated options
  if (variantId === "humans-standard") {
    result.raceOptions = { humanBonus: data.abilityScores[0].id };
  }

  return result;
}

/**
 * Updates the ability score selected as a bonus for a human character.
 *
 * Ensure that the ability scores are reset.
 *
 * @param character The character to update
 * @param abilityScoreId The identifier of the selected ability score
 * @returns The updated character
 */
export function updateHumanBonus(character: Character, abilityScoreId: string): Character {
  return {
    ...character,
    raceOptions: { humanBonus: abilityScoreId },
    abilityScores: { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 },
  };
}

/**
 * Enables a secondary trait for a character.
 *
 * Ensure that the associated primary traits are disabled.
 *
 * @param character The character to update
 * @param trait The enabled secondary trait
 * @returns The updated character
 */
export function enableSecondaryTrait(character: Character, trait: SecondaryTrait): Character {
  let traits = character.traits.filter((t) => !trait.replace.includes(t));
  return { ...character, traits: [...traits, trait.id] };
}

/**
 * Disables a secondary trait for a character.
 *
 * Ensure that the associated primary traits are enabled.
 *
 * @param character The character to update
 * @param trait The disabled secondary trait
 * @returns The updated character
 */
export function disableSecondaryTrait(character: Character, trait: SecondaryTrait): Character {
  return { ...character, traits: character.traits.filter((t) => t !== trait.id).concat(trait.replace) };
}

/**
 * Updates the theme associated with a character.
 *
 * Ensure that the theme options and ability scores are reset.
 *
 * @param data The data set
 * @param character The character to update
 * @param themeId The identifier of its new theme
 * @returns The updated character
 */
export function updateTheme(data: DataSet, character: Character, themeId: string): Character {
  let result: Character = {
    ...character,
    theme: themeId,
    themeOptions: undefined,
    abilityScores: { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 },
  };

  // Special cases - prepare the associated options
  if (themeId === "74e471d9-db80-4fae-9610-44ea8eeedcb3") {
    // Theme: Scholar
    result.themeOptions = {
      scholarSkill: "life",
      scholarSpecialization: data.specials.scholar.life[0],
      scholarLabel: "",
    };
  } else if (themeId === "e1a9a6ad-0c95-4f31-a692-3327c77bb53f") {
    // Theme: No theme
    result.themeOptions = { noThemeAbility: "str" };
  }

  return result;
}

/**
 * Updates the ability score selected as a bonus for a character with 'no theme'.
 *
 * @param character The character to update
 * @param abilityScoreId The identifier of the selected ability score
 * @returns The updated character
 */
export function updateNoThemeAbilityScore(character: Character, abilityScoreId: string): Character {
  return {
    ...character,
    themeOptions: {
      ...character.themeOptions,
      noThemeAbility: abilityScoreId,
    },
    abilityScores: { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 },
  };
}

/**
 * Updates the scholar skill selected for a character.
 *
 * Ensure that the scholar specialization and label are reset.
 *
 * @param character The character to update
 * @param skillId The identifier of the selected scholar skill
 * @returns The updated character
 */
export function updateScholarSkill(character: Character, skillId: string): Character {
  return {
    ...character,
    themeOptions: {
      ...character.themeOptions,
      scholarSkill: skillId,
      scholarSpecialization: "",
      scholarLabel: "",
    },
  };
}

/**
 * Updates the scholar specialization selected for a character.
 *
 * Ensure that the scholar label is reset.
 *
 * @param character The character to update
 * @param specialization The selected scholar specialization
 * @returns The updated character
 */
export function updateScholarSpecialization(character: Character, specialization: string): Character {
  return {
    ...character,
    themeOptions: {
      ...character.themeOptions,
      scholarSpecialization: specialization,
      scholarLabel: "",
    },
  };
}

/**
 * Updates the scholar label entered for a character.
 *
 * @param character The character to update
 * @param label The entered scholar label
 * @returns The updated character
 */
export function updateScholarLabel(character: Character, label: string): Character {
  return {
    ...character,
    themeOptions: {
      ...character.themeOptions,
      scholarLabel: label,
    },
  };
}

/**
 * Updates the class associated with a character.
 *
 * Ensure that the class options and ability scores are reset.
 *
 * @param character The character to update
 * @param classId The identifier of its new class
 * @returns The updated character
 */
export function updateClass(character: Character, classId: string): Character {
  if (character.class === classId) {
    // No change
    return character;
  }

  let result: Character = {
    ...character,
    class: classId,
    classOptions: undefined,
    abilityScores: { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 },
  };

  // Special case - prepare the associated options
  if (classId === "7d165a8f-d874-4d09-88ff-9f2ccd77a3ab") {
    // Class: Soldier
    result.classOptions = { soldierAbilityScore: "str" };
  }

  return result;
}

/**
 * Updates the primary ability score selected for a soldier character.
 *
 * @param character The character to update
 * @param abilityScoreId The identifier of the selected ability score
 * @returns The updated character
 */
export function updateSoldierAbilityScore(character: Character, abilityScoreId: string): Character {
  return {
    ...character,
    classOptions: {
      ...character.classOptions,
      soldierAbilityScore: abilityScoreId,
    },
  };
}

/**
 * Updates one of the ability score associated with a character.
 *
 * @param character The character to update
 * @param abilityScoreId The identifier of the ability score to update
 * @param delta The delta to apply to the ability score
 * @returns The updated character
 */
export function updateAbilityScore(character: Character, abilityScoreId: string, delta: number): Character {
  const score = character.abilityScores[abilityScoreId] + delta;
  return {
    ...character,
    abilityScores: { ...character.abilityScores, [abilityScoreId]: score },
  };
}

/**
 * Updates one of the skill rank associated with a character.
 *
 * If the new skill rank is zero or less, the skill rank will be removed.
 *
 * @param character The character to update
 * @param skillId The identifier of the skill to update
 * @param delta The delta to apply to the skill rank
 * @returns The updated character
 */
export function updateSkillRank(character: Character, skillId: string, delta: number): Character {
  const currentRank = character.skillRanks[skillId];
  if (delta === 0 || (currentRank === undefined && delta <= 0)) {
    // No change
    return character;
  }

  const newRank = currentRank ?? 0 + delta;
  if (newRank < 0) {
    // Remove the rank
    const { [skillId]: _, ...skillRanks } = character.skillRanks;
    return {
      ...character,
      skillRanks,
    };
  } else {
    // Update the rank
    return {
      ...character,
      skillRanks: { ...character.skillRanks, [skillId]: newRank },
    };
  }
}
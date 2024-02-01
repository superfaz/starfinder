import { findOrError } from "app/helpers";
import { EmptyClientDataSet, IClientDataSet } from "data";
import { AbilityScoreIds, Character, EmptyCharacter, Feature, IModel } from "model";
import { computeMinimalAbilityScores } from "./CharacterPresenter";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  data: EmptyClientDataSet,
  character: EmptyCharacter,
  classesDetails: {} as Record<string, IModel>,
};

const mainSlice = createSlice({
  name: "main",
  initialState,
  reducers: {
    initializeData(state, action: PayloadAction<IClientDataSet>) {
      state.data = action.payload;
    },

    updateRace(state, action: PayloadAction<string>) {
      state.character = updateRaceImpl(state.data, state.character, action.payload);
    },

    updateRaceVariant(state, action: PayloadAction<string>) {
      state.character = updateRaceVariantImpl(state.data, state.character, action.payload);
    },

    updateHumanBonus(state, action: PayloadAction<string>) {
      state.character = updateHumanBonusImpl(state.data, state.character, action.payload);
    },

    enableSecondaryTrait(state, action: PayloadAction<Feature>) {
      state.character = enableSecondaryTraitImpl(state.character, action.payload);
    },

    disableSecondaryTrait(state, action: PayloadAction<Feature>) {
      state.character = disableSecondaryTraitImpl(state.character, action.payload);
    },

    updateTheme(state, action: PayloadAction<string>) {
      state.character = updateThemeImpl(state.data, state.character, action.payload);
    },

    updateNoThemeAbilityScore(state, action: PayloadAction<string>) {
      state.character = updateNoThemeAbilityScoreImpl(state.data, state.character, action.payload);
    },

    updateScholarSkill(state, action: PayloadAction<string>) {
      state.character = updateScholarSkillImpl(state.data, state.character, action.payload);
    },

    updateScholarSpecialization(state, action: PayloadAction<string>) {
      state.character = updateScholarSpecializationImpl(state.character, action.payload);
    },

    updateClass(state, action: PayloadAction<string>) {
      state.character = updateClassImpl(state.data, state.character, action.payload);
    },

    updateSoldierAbilityScore(state, action: PayloadAction<string>) {
      state.character = updateSoldierAbilityScoreImpl(state.character, action.payload);
    },

    updateSoldierPrimayStyle(state, action: PayloadAction<string>) {
      state.character = updateSoldierPrimaryStyleImpl(state.character, action.payload);
    },

    updateOperativeSpecialization(state, action: PayloadAction<string>) {
      state.character = updateOperativeSpecializationImpl(state.character, action.payload);
    },

    updateAbilityScore(state, action: PayloadAction<{ id: string; delta: number }>) {
      state.character = updateAbilityScoreImpl(state.character, action.payload.id, action.payload.delta);
    },

    updateSkillRank(state, action: PayloadAction<{ id: string; delta: number }>) {
      state.character = updateSkillRankImpl(state.character, action.payload.id, action.payload.delta);
    },

    updateName(state, action: PayloadAction<string>) {
      state.character.name = action.payload;
    },

    updateAlignment(state, action: PayloadAction<string>) {
      state.character.alignment = action.payload;
    },

    updateSex(state, action: PayloadAction<string>) {
      state.character.sex = action.payload;
    },

    updateHomeWorld(state, action: PayloadAction<string>) {
      state.character.homeWorld = action.payload;
    },

    updateDeity(state, action: PayloadAction<string>) {
      state.character.deity = action.payload;
    },

    updateAvatar(state, action: PayloadAction<string>) {
      state.character.avatar = action.payload;
    },

    addFeat(state, action: PayloadAction<string>) {
      state.character.feats.push({ id: action.payload });
    },

    removeFeat(state, action: PayloadAction<string>) {
      state.character.feats = state.character.feats.filter((f) => f.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(retrieveClassDetails.fulfilled, (state, action) => {
      return { ...state, classesDetails: { ...state.classesDetails, [action.meta.arg]: action.payload } };
    });
  },
});

/**
 * Redux action to retrieve class details using the API.
 * @param classId The ID of the class to retrieve.
 */
export const retrieveClassDetails = createAsyncThunk<IModel, string>("classesDetails/retrieve", async (classId) => {
  const response = await fetch(`/api/classes/${classId}/details`);
  const data = await response.json();
  return data as IModel;
});

export const mutators = mainSlice.actions;

export default mainSlice.reducer;

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
function updateRaceImpl(data: IClientDataSet, character: Character, raceId: string): Character {
  const race = findOrError(data.races, raceId);

  if (character.race === raceId) {
    // No change
    return character;
  }

  const result: Character = {
    ...character,
    race: race.id,
    raceVariant: race.variants[0].id,
    raceOptions: undefined,
    traits: race.traits.map((t) => t.id),
  };

  // Special case - prepare the associated options
  if (raceId === "humans") {
    result.raceOptions = { humanBonus: data.abilityScores[0].id };
  }

  result.abilityScores = computeMinimalAbilityScores(data, result);
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
function updateRaceVariantImpl(data: IClientDataSet, character: Character, variantId: string): Character {
  if (character.raceVariant === variantId) {
    // No change
    return character;
  }

  const result: Character = {
    ...character,
    raceVariant: variantId,
    raceOptions: undefined,
  };

  // Special case - prepare the associated options
  if (variantId === "humans-standard") {
    result.raceOptions = { humanBonus: data.abilityScores[0].id };
  }

  result.abilityScores = computeMinimalAbilityScores(data, result);
  return result;
}

/**
 * Updates the ability score selected as a bonus for a human character.
 *
 * Ensure that the ability scores are reset.
 *
 * @param data The data set
 * @param character The character to update
 * @param abilityScoreId The identifier of the selected ability score
 * @returns The updated character
 */
function updateHumanBonusImpl(data: IClientDataSet, character: Character, abilityScoreId: string): Character {
  const result: Character = {
    ...character,
    raceOptions: { humanBonus: abilityScoreId },
  };

  result.abilityScores = computeMinimalAbilityScores(data, result);
  return result;
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
function enableSecondaryTraitImpl(character: Character, trait: Feature): Character {
  const traits = character.traits.filter((t) => !trait.replace.includes(t));
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
function disableSecondaryTraitImpl(character: Character, trait: Feature): Character {
  return { ...character, traits: [...character.traits.filter((t) => t !== trait.id), ...trait.replace] };
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
function updateThemeImpl(data: IClientDataSet, character: Character, themeId: string): Character {
  const result: Character = {
    ...character,
    theme: themeId,
    themeOptions: undefined,
  };

  // Special cases - prepare the associated options
  if (themeId === "scholar") {
    // Theme: Scholar
    result.themeOptions = {
      scholarSkill: "life",
      scholarSpecialization: "",
    };
  } else if (themeId === "themeless") {
    // Theme: No theme
    result.themeOptions = { noThemeAbility: AbilityScoreIds.str };
  }

  result.abilityScores = computeMinimalAbilityScores(data, result);
  return result;
}

/**
 * Updates the ability score selected as a bonus for a character with 'no theme'.
 *
 * @param data The data set
 * @param character The character to update
 * @param abilityScoreId The identifier of the selected ability score
 * @returns The updated character
 */
function updateNoThemeAbilityScoreImpl(data: IClientDataSet, character: Character, abilityScoreId: string): Character {
  const result: Character = {
    ...character,
    themeOptions: {
      ...character.themeOptions,
      noThemeAbility: abilityScoreId,
    },
  };
  result.abilityScores = computeMinimalAbilityScores(data, result);
  return result;
}

/**
 * Updates the scholar skill selected for a character.
 *
 * Ensure that the scholar specialization is reset.
 *
 * @param data The data set
 * @param character The character to update
 * @param skillId The identifier of the selected scholar skill
 * @returns The updated character
 */
function updateScholarSkillImpl(data: IClientDataSet, character: Character, skillId: string): Character {
  return {
    ...character,
    themeOptions: {
      ...character.themeOptions,
      scholarSkill: skillId,
      scholarSpecialization: "",
    },
  };
}

/**
 * Updates the scholar specialization selected for a character.
 *
 * @param character The character to update
 * @param specialization The selected scholar specialization or its label
 * @returns The updated character
 */
function updateScholarSpecializationImpl(character: Character, specialization: string): Character {
  return {
    ...character,
    themeOptions: {
      ...character.themeOptions,
      scholarSpecialization: specialization,
    },
  };
}

/**
 * Updates the class associated with a character.
 *
 * Ensure that the class options and ability scores are reset.
 *
 * @param data The data set
 * @param character The character to update
 * @param classId The identifier of its new class
 * @returns The updated character
 */
function updateClassImpl(data: IClientDataSet, character: Character, classId: string): Character {
  if (character.class === classId) {
    // No change
    return character;
  }

  const result: Character = {
    ...character,
    class: classId,
    classOptions: undefined,
  };

  // Special cases - prepare the associated options
  if (classId === "soldier") {
    // Class: Soldier
    result.classOptions = {
      soldierAbilityScore: AbilityScoreIds.str,
      soldierPrimaryStyle: "5103271c-c10e-4afc-8750-fb0e3e22c7d5",
    };
  } else if (classId === "operative") {
    // Class: Operative
    result.classOptions = { operativeSpecialization: "0110533f-eba1-4bad-ae1d-b18c584b7cbc" };
  }

  result.abilityScores = computeMinimalAbilityScores(data, result);
  return result;
}

/**
 * Updates the primary ability score selected for a soldier character.
 *
 * @param character The character to update
 * @param abilityScoreId The identifier of the selected ability score
 * @returns The updated character
 */
function updateSoldierAbilityScoreImpl(character: Character, abilityScoreId: string): Character {
  return {
    ...character,
    classOptions: {
      ...character.classOptions,
      soldierAbilityScore: abilityScoreId,
    },
  };
}

/**
 * Updates the primary fightying style selected for a soldier character.
 *
 * @param character The character to update
 * @param styleId The identifier of the selected style
 * @returns The updated character
 */
function updateSoldierPrimaryStyleImpl(character: Character, styleId: string): Character {
  return {
    ...character,
    classOptions: {
      ...character.classOptions,
      soldierPrimaryStyle: styleId,
    },
  };
}

/**
 * Updates the specialization selected for an operative character.
 *
 * @param character The character to update
 * @param specialization The selected operative specialization
 * @returns The updated character
 */
function updateOperativeSpecializationImpl(character: Character, specialization: string): Character {
  return {
    ...character,
    classOptions: {
      ...character.classOptions,
      operativeSpecialization: specialization,
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
function updateAbilityScoreImpl(character: Character, abilityScoreId: string, delta: number): Character {
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
function updateSkillRankImpl(character: Character, skillId: string, delta: number): Character {
  const currentRank = character.skillRanks[skillId];
  if (delta === 0 || (currentRank === undefined && delta <= 0)) {
    // No change
    return character;
  }

  const newRank = (currentRank ?? 0) + delta;
  if (newRank <= 0) {
    // Remove the rank
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

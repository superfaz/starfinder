import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { findOrError } from "app/helpers";
import { EmptyClientDataSet, IClientDataSet } from "data";
import { AbilityScoreIds, type Character, EmptyCharacter, type IModel, type Profession } from "model";
import { RaceFeature } from "view";
import { computeMinimalAbilityScores } from "./CharacterPresenter";

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

    initializeCharacter(state, action: PayloadAction<Character>) {
      state.character = action.payload;
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

    enableSecondaryTrait(state, action: PayloadAction<RaceFeature>) {
      state.character = enableSecondaryTraitImpl(state.character, action.payload);
    },

    disableSecondaryTrait(state, action: PayloadAction<RaceFeature>) {
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

    updateOperativeSpecialization(state, action: PayloadAction<string>) {
      state.character = updateOperativeSpecializationImpl(state.character, action.payload);
    },

    updateMysticConnection(state, action: PayloadAction<string>) {
      state.character = updateMysticConnectionImpl(state.character, action.payload);
    },

    updateSoldierAbilityScore(state, action: PayloadAction<string>) {
      state.character = updateSoldierAbilityScoreImpl(state.character, action.payload);
    },

    updateSoldierPrimayStyle(state, action: PayloadAction<string>) {
      state.character = updateSoldierPrimaryStyleImpl(state.character, action.payload);
    },

    updateAbilityScore(state, action: PayloadAction<{ id: string; delta: number }>) {
      state.character = updateAbilityScoreImpl(state.character, action.payload.id, action.payload.delta);
    },

    addProfessionSkill(state, action: PayloadAction<Profession>) {
      state.character = {
        ...state.character,
        professionSkills: [...state.character.professionSkills, action.payload],
      };
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

    updateDescription(state, action: PayloadAction<string>) {
      state.character.description = action.payload;
    },

    updateAvatar(state, action: PayloadAction<string>) {
      state.character.avatar = action.payload;
    },

    addFeat(state, action: PayloadAction<{ id: string; target?: string }>) {
      state.character.feats.push(action.payload);
    },

    removeFeat(state, action: PayloadAction<{ id: string; target?: string }>) {
      state.character.feats = state.character.feats.filter((f) => f.id !== action.payload.id);
    },

    addSpell(state, action: PayloadAction<{ level: string; id: string }>) {
      const spells = state.character.spells[action.payload.level] ?? [];
      state.character.spells[action.payload.level] = [...spells, action.payload.id];
    },

    removeSpell(state, action: PayloadAction<{ level: string; id: string }>) {
      state.character.spells[action.payload.level] = (state.character.spells[action.payload.level] ?? []).filter(
        (s) => s !== action.payload.id
      );
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
 * @param classId - the ID of the class to retrieve.
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
 * @param data - the data set
 * @param character - the character to update
 * @param raceId - the identifier of its new race
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

  result.avatar = data.avatars.filter((avatar) => avatar.tags.includes(raceId))[0].id;

  return result;
}

/**
 * Updates the race variant associated with a character.
 *
 * Ensure that the options and ability scores are reset.
 *
 * @param data - the data set
 * @param character - the character to update
 * @param variantId - the identifier of its new race variant
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
 * @param data - the data set
 * @param character - the character to update
 * @param abilityScoreId - the identifier of the selected ability score
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

type SubsetRaceFeature = {
  id: string;
  replace: string[];
};

/**
 * Enables a secondary trait for a character.
 *
 * Ensure that the associated primary traits are disabled.
 *
 * @param character - the character to update
 * @param trait - the enabled secondary trait
 * @returns The updated character
 */
function enableSecondaryTraitImpl(character: Character, trait: SubsetRaceFeature): Character {
  const traits = character.traits.filter((t) => !trait.replace.includes(t));
  return { ...character, traits: [...traits, trait.id] };
}

/**
 * Disables a secondary trait for a character.
 *
 * Ensure that the associated primary traits are enabled.
 *
 * @param character - the character to update
 * @param trait - the disabled secondary trait
 * @returns The updated character
 */
function disableSecondaryTraitImpl(character: Character, trait: SubsetRaceFeature): Character {
  return { ...character, traits: [...character.traits.filter((t) => t !== trait.id), ...trait.replace] };
}

/**
 * Updates the theme associated with a character.
 *
 * Ensure that the theme options and ability scores are reset.
 *
 * @param data - the data set
 * @param character - the character to update
 * @param themeId - the identifier of its new theme
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
 * @param data - the data set
 * @param character - the character to update
 * @param abilityScoreId - the identifier of the selected ability score
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
 * @param data - the data set
 * @param character - the character to update
 * @param skillId - the identifier of the selected scholar skill
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
 * @param character - the character to update
 * @param specialization - the selected scholar specialization or its label
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
 * @param data - the data set
 * @param character - the character to update
 * @param classId - the identifier of its new class
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
  if (classId === "mystic") {
    // Class: Mystic
    result.classOptions = { mysticConnection: "60ee0f41-3c5b-4aa4-93d8-f139f5b864b3" };
  } else if (classId === "operative") {
    // Class: Operative
    result.classOptions = { operativeSpecialization: "0110533f-eba1-4bad-ae1d-b18c584b7cbc" };
  } else if (classId === "soldier") {
    // Class: Soldier
    result.classOptions = {
      soldierAbilityScore: AbilityScoreIds.str,
      soldierPrimaryStyle: "5103271c-c10e-4afc-8750-fb0e3e22c7d5",
    };
  }

  result.abilityScores = computeMinimalAbilityScores(data, result);
  return result;
}

/**
 * Updates the specialization selected for an operative character.
 *
 * @param character - the character to update
 * @param specialization - the selected operative specialization
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
 * Updates the connection selected for a mystic character.
 *
 * @param character - the character to update
 * @param specialization - the selected connection
 * @returns The updated character
 */
function updateMysticConnectionImpl(character: Character, connection: string): Character {
  return {
    ...character,
    classOptions: {
      ...character.classOptions,
      mysticConnection: connection,
    },
  };
}

/**
 * Updates the primary ability score selected for a soldier character.
 *
 * @param character - the character to update
 * @param abilityScoreId - the identifier of the selected ability score
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
 * @param character - the character to update
 * @param styleId - the identifier of the selected style
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
 * Updates one of the ability score associated with a character.
 *
 * @param character - the character to update
 * @param abilityScoreId - the identifier of the ability score to update
 * @param delta - the delta to apply to the ability score
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
 * @param character - the character to update
 * @param skillId - the identifier of the skill to update
 * @param delta - the delta to apply to the skill rank
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

class Updators {
  private _character: Character;

  private data: IClientDataSet;

  constructor(data: IClientDataSet, character: Character) {
    this.data = data;
    this._character = { ...character };
  }

  public get character() {
    return this._character;
  }

  updateRace(raceId: string) {
    this._character = updateRaceImpl(this.data, this._character, raceId);
    return this;
  }

  updateRaceVariant(variantId: string) {
    this._character = updateRaceVariantImpl(this.data, this._character, variantId);
    return this;
  }

  updateHumanBonus(abilityScoreId: string) {
    this._character = updateHumanBonusImpl(this.data, this._character, abilityScoreId);
    return this;
  }

  enableSecondaryTrait(traitId: string) {
    const race = findOrError(this.data.races, this._character.race);
    const trait = findOrError(race.secondaryTraits, traitId);
    this._character = enableSecondaryTraitImpl(this._character, { id: trait.id, replace: trait.replace ?? [] });
    return this;
  }

  disableSecondaryTrait(traitId: string) {
    const race = findOrError(this.data.races, this._character.race);
    const trait = findOrError(race.secondaryTraits, traitId);
    this._character = disableSecondaryTraitImpl(this._character, { id: trait.id, replace: trait.replace ?? [] });
    return this;
  }

  updateTheme(themeId: string) {
    this._character = updateThemeImpl(this.data, this._character, themeId);
    return this;
  }

  updateNoThemeAbilityScore(abilityScoreId: string) {
    this._character = updateNoThemeAbilityScoreImpl(this.data, this._character, abilityScoreId);
    return this;
  }

  updateScholarSkill(skillId: string) {
    this._character = updateScholarSkillImpl(this.data, this._character, skillId);
    return this;
  }

  updateScholarSpecialization(specialization: string) {
    this._character = updateScholarSpecializationImpl(this._character, specialization);
    return this;
  }

  updateClass(classId: string) {
    this._character = updateClassImpl(this.data, this._character, classId);
    return this;
  }

  updateOperativeSpecialization(specialization: string) {
    this._character = updateOperativeSpecializationImpl(this._character, specialization);
    return this;
  }

  updateMysticConnection(connection: string) {
    this._character = updateMysticConnectionImpl(this._character, connection);
    return this;
  }

  updateSoldierAbilityScore(abilityScoreId: string) {
    this._character = updateSoldierAbilityScoreImpl(this._character, abilityScoreId);
    return this;
  }

  updateSoldierPrimaryStyle(styleId: string) {
    this._character = updateSoldierPrimaryStyleImpl(this._character, styleId);
    return this;
  }

  updateAbilityScore(abilityScoreId: string, delta: number) {
    this._character = updateAbilityScoreImpl(this._character, abilityScoreId, delta);
    return this;
  }

  updateSkillRank(skillId: string, delta: number) {
    this._character = updateSkillRankImpl(this._character, skillId, delta);
    return this;
  }

  updateName(name: string) {
    this._character = { ...this._character, name };
    return this;
  }

  updateSex(sex: string) {
    this._character = { ...this._character, sex };
    return this;
  }

  updateHomeWorld(homeWorld: string) {
    this._character = { ...this._character, homeWorld };
    return this;
  }

  updateDeity(deity: string) {
    this._character = { ...this._character, deity };
    return this;
  }
}

export const updators = (data: IClientDataSet, character: Character) => new Updators(data, character);

import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { findOrError } from "app/helpers";
import { EmptyClientDataSet, type IClientDataSet } from "data/IClientDataSet";
import {
  AbilityScoreIds,
  type Character,
  EmptyCharacter,
  type IModel,
  type Profession,
  EquipmentDescriptor,
} from "model";
import { computeMinimalAbilityScores } from "./CharacterPresenter";

const initialState = {
  data: EmptyClientDataSet,
  character: { ...EmptyCharacter, id: uuidv4(), userId: "client", updatedAt: new Date().toISOString() },
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

    initializeClassesDetails(state, action: PayloadAction<Record<string, IModel>>) {
      state.classesDetails = action.payload;
    },

    updateRace(state, action: PayloadAction<string>) {
      state.character = updateRaceImpl(state.data, state.character, action.payload);
    },

    updateRaceVariant(state, action: PayloadAction<string>) {
      state.character = updateRaceVariantImpl(state.data, state.character, action.payload);
    },

    updateSelectableBonus(state, action: PayloadAction<string>) {
      state.character = updateSelectableBonusImpl(state.data, state.character, action.payload);
    },

    updateLashuntaStudentSkill1(state, action: PayloadAction<string>) {
      if (state.character.originOptions === undefined) {
        state.character.originOptions = { lashuntaStudentSkill1: action.payload };
      } else {
        state.character.originOptions.lashuntaStudentSkill1 = action.payload;
      }
    },

    updateLashuntaStudentSkill2(state, action: PayloadAction<string>) {
      if (state.character.originOptions === undefined) {
        state.character.originOptions = { lashuntaStudentSkill2: action.payload };
      } else {
        state.character.originOptions.lashuntaStudentSkill2 = action.payload;
      }
    },

    updateShirrenObsessionSkill(state, action: PayloadAction<string>) {
      state.character = updateShirrenObsessionSkillImpl(state.data, state.character, action.payload);
    },

    updateHalforcProfession(state, action: PayloadAction<string>) {
      if (state.character.originOptions === undefined) {
        state.character.originOptions = { halforcProfession: action.payload };
      } else {
        state.character.originOptions.halforcProfession = action.payload;
      }
    },

    updateTheme(state, action: PayloadAction<string>) {
      state.character = updateThemeImpl(state.data, state.character, action.payload);
    },

    updateIconProfession(state, action: PayloadAction<string | undefined>) {
      if (action.payload === undefined) {
        delete state.character.themeOptions;
      } else if (state.character.themeOptions === undefined) {
        state.character.themeOptions = { iconProfession: action.payload };
      } else {
        state.character.themeOptions.iconProfession = action.payload;
      }
    },

    updateThemelessAbilityScore(state, action: PayloadAction<string>) {
      state.character = updateThemelessAbilityScoreImpl(state.data, state.character, action.payload);
    },

    updateScholarSkill(state, action: PayloadAction<string>) {
      state.character = updateScholarSkillImpl(state.data, state.character, action.payload);
    },

    updateScholarSpecialization(state, action: PayloadAction<string>) {
      state.character = updateScholarSpecializationImpl(state.character, action.payload);
    },

    updateThemelessSkill(state, action: PayloadAction<string>) {
      if (state.character.themeOptions === undefined) {
        state.character.themeOptions = { themelessSkill: action.payload };
      } else {
        state.character.themeOptions.themelessSkill = action.payload;
      }
    },

    updateClass(state, action: PayloadAction<string>) {
      state.character = updateClassImpl(state.data, state.character, action.payload);
    },

    updateEnvoySkill(state, action: PayloadAction<string>) {
      state.character = updateEnvoySkillImpl(state.character, action.payload);
    },

    updateMechanicStyle(state, action: PayloadAction<string>) {
      state.character = updateMechanicStyleImpl(state.character, action.payload);
    },

    updateMysticConnection(state, action: PayloadAction<string>) {
      state.character = updateMysticConnectionImpl(state.character, action.payload);
    },

    updateOperativeSpecialization(state, action: PayloadAction<string>) {
      state.character = updateOperativeSpecializationImpl(state.character, action.payload);
    },

    updateSolarianColor(state, action: PayloadAction<string>) {
      state.character = updateSolarianColorImpl(state.character, action.payload);
    },

    updateSolarianManifestation(state, action: PayloadAction<string>) {
      state.character = updateSolarianManifestationImpl(state.character, action.payload);
    },

    updateSolarianDamageType(state, action: PayloadAction<string>) {
      state.character = updateSolarianDamageTypeImpl(state.character, action.payload);
    },

    updateSoldierAbilityScore(state, action: PayloadAction<string>) {
      state.character = updateSoldierAbilityScoreImpl(state.character, action.payload);
    },

    updateSoldierPrimaryStyle(state, action: PayloadAction<string>) {
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

    removeProfessionSkill(state, action: PayloadAction<string>) {
      state.character = {
        ...state.character,
        professionSkills: state.character.professionSkills.filter((p) => p.id !== action.payload),
      };

      delete state.character.skillRanks[action.payload];
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

    updateHomeWorld(state, action: PayloadAction<{ world: string; language: string }>) {
      state.character.homeWorld = action.payload.world;
      state.character.homeWorldLanguage = action.payload.language;
    },

    updateHomeWorldLanguage(state, action: PayloadAction<string>) {
      state.character.homeWorldLanguage = action.payload;
    },

    addLanguage(state, action: PayloadAction<string>) {
      state.character.languages.push(action.payload);
    },

    updateLanguage(state, action: PayloadAction<{ index: number; language: string }>) {
      state.character.languages[action.payload.index] = action.payload.language;
    },

    removeLanguage(state, action: PayloadAction<number>) {
      state.character.languages.splice(action.payload, 1);
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

    updateDroneName(state, action: PayloadAction<string>) {
      if (!state.character.classOptions) {
        state.character.classOptions = {};
      }
      state.character.classOptions.droneName = action.payload;
    },

    updateDroneChassis(state, action: PayloadAction<string>) {
      if (!state.character.classOptions) {
        state.character.classOptions = {};
      }
      state.character.classOptions.droneChassis = action.payload;
    },

    updateDroneSkillUnit(state, action: PayloadAction<string>) {
      if (!state.character.classOptions) {
        state.character.classOptions = {};
      }
      state.character.classOptions.droneSkillUnit = action.payload;
    },

    updateInitialCapital(state, action: PayloadAction<number>) {
      state.character.credits += action.payload - state.character.initialCapital;
      state.character.initialCapital = action.payload;
    },

    updateCredits(state, action: PayloadAction<number>) {
      state.character.credits = action.payload;
    },

    addEquipment(state, action: PayloadAction<EquipmentDescriptor>) {
      state.character = addEquipmentImpl(state.character, action.payload);
    },

    updateEquipmentQuantity(state, action: PayloadAction<{ id: string; delta: number }>) {
      const equipment = state.character.equipment.find((e) => e.id === action.payload.id);
      if (equipment === undefined) {
        return;
      }
      if (equipment.type === "unique" && action.payload.delta !== -1) {
        throw new Error("Cannot update quantity of unique equipment");
      }

      equipment.quantity += action.payload.delta;
      state.character.credits -= equipment.unitaryCost * action.payload.delta;

      if (equipment.quantity <= 0) {
        state.character.equipment = state.character.equipment.filter((e) => e.id !== action.payload.id);
      }
    },

    updateEquipmentMaterial(state, action: PayloadAction<{ id: string; material: string }>) {
      const descriptor = state.character.equipment.find((e) => e.id === action.payload.id);
      if (!descriptor) {
        return;
      }

      const oldMaterial = state.data.equipmentMaterials.find((m) => m.id === descriptor.material);
      const newMaterial = state.data.equipmentMaterials.find((m) => m.id === action.payload.material);

      state.character.credits += oldMaterial?.uniqueCost ?? 0;
      descriptor.unitaryCost -= oldMaterial?.uniqueCost ?? 0;
      state.character.credits -= newMaterial?.uniqueCost ?? 0;
      descriptor.unitaryCost += newMaterial?.uniqueCost ?? 0;

      if (action.payload.material && action.payload.material !== "normal") {
        descriptor.material = action.payload.material;
      } else {
        delete descriptor.material;
      }
    },

    updateEquipmentName(state, action: PayloadAction<{ id: string; name: string }>) {
      const equipment = state.character.equipment.find((e) => e.id === action.payload.id);
      if (!equipment) {
        return;
      }
      if (action.payload.name && action.payload.name !== "") {
        equipment.name = action.payload.name;
      } else {
        delete equipment.name;
      }
    },

    updateEquipmentDescription(state, action: PayloadAction<{ id: string; description: string }>) {
      const equipment = state.character.equipment.find((e) => e.id === action.payload.id);
      if (!equipment) {
        return;
      }
      if (action.payload.description && action.payload.description !== "") {
        equipment.description = action.payload.description;
      } else {
        delete equipment.description;
      }
    },

    addEquipmentFusion(state, action: PayloadAction<{ equipment: string; id: string; cost: number }>) {
      const equipment = state.character.equipment.find((e) => e.id === action.payload.equipment);
      if (!equipment) {
        return;
      }
      if (equipment.category !== "weapon") {
        throw new Error("Cannot add fusion to non-weapon equipment");
      }

      if (equipment.fusions === undefined) {
        equipment.fusions = [];
      }

      equipment.fusions.push(action.payload.id);
      equipment.unitaryCost += action.payload.cost;
      state.character.credits -= action.payload.cost;
    },

    removeEquipmentFusion(state, action: PayloadAction<{ equipment: string; id: string; cost: number }>) {
      const equipment = state.character.equipment.find((e) => e.id === action.payload.equipment);
      if (!equipment || equipment.category !== "weapon" || equipment.fusions === undefined) {
        return;
      }

      const filtered = equipment.fusions.filter((f) => f !== action.payload.id);
      if (filtered.length === equipment.fusions.length) {
        // Not present
        return;
      }

      equipment.unitaryCost -= action.payload.cost;
      state.character.credits += action.payload.cost;
      if (filtered.length === 0) {
        delete equipment.fusions;
      } else {
        equipment.fusions = filtered;
      }
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

  if (character.origin === raceId) {
    // No change
    return character;
  }

  const result: Character = {
    ...character,
    origin: race.id,
    variant: race.variants[0].id,
    originOptions: undefined,
    traits: race.traits.map((t) => t.id),
  };

  // Special case - prepare the associated options
  if (Object.keys(race.variants[0].abilityScores).length === 0) {
    result.originOptions = { selectableBonus: data.abilityScores[0].id };
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
  if (character.variant === variantId) {
    // No change
    return character;
  }

  const race = findOrError(data.races, character.origin);
  const variant = findOrError(race.variants, variantId);
  const result: Character = {
    ...character,
    variant: variantId,
    originOptions: undefined,
  };

  // Special case - prepare the associated options
  if (Object.keys(variant.abilityScores).length === 0) {
    result.originOptions = { selectableBonus: data.abilityScores[0].id };
  }

  result.abilityScores = computeMinimalAbilityScores(data, result);
  return result;
}

/**
 * Updates the ability score selected as a bonus for race variant letting the user choose its bonus.
 *
 * Ensure that the ability scores are reset.
 *
 * @param data - the data set
 * @param character - the character to update
 * @param abilityScoreId - the identifier of the selected ability score
 * @returns The updated character
 */
function updateSelectableBonusImpl(data: IClientDataSet, character: Character, abilityScoreId: string): Character {
  const result: Character = {
    ...character,
    originOptions: { selectableBonus: abilityScoreId },
  };

  result.abilityScores = computeMinimalAbilityScores(data, result);
  return result;
}

/**
 * Updates the skill selected for the "shirren obsession" race trait for a shirren character.
 *
 * @param data - the data set
 * @param character - the character to update
 * @param shirrenObsessionSkill - the identifier of the selected skill
 * @returns The updated character
 */
function updateShirrenObsessionSkillImpl(
  data: IClientDataSet,
  character: Character,
  shirrenObsessionSkill: string
): Character {
  return {
    ...character,
    originOptions: { shirrenObsessionSkill },
  };
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
    result.themeOptions = { themelessAbility: AbilityScoreIds.str };
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
function updateThemelessAbilityScoreImpl(
  data: IClientDataSet,
  character: Character,
  abilityScoreId: string
): Character {
  const result: Character = {
    ...character,
    themeOptions: {
      ...character.themeOptions,
      themelessAbility: abilityScoreId,
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

  result.abilityScores = computeMinimalAbilityScores(data, result);
  return result;
}

/**
 * Updates the skill selected as a class skill for an envoy character.
 *
 * @param character - the character to update
 * @param skillId - the identifier of the selected skill
 * @returns The updated character
 */
function updateEnvoySkillImpl(character: Character, skillId: string): Character {
  return {
    ...character,
    classOptions: {
      ...character.classOptions,
      envoySkill: skillId,
    },
  };
}

/**
 * Updates the style selected for a mechanic character.
 *
 * @param character - the character to update
 * @param style - the selected style
 * @returns The updated character
 */
function updateMechanicStyleImpl(character: Character, style: string): Character {
  return {
    ...character,
    classOptions: {
      ...character.classOptions,
      mechanicStyle: style,
    },
  };
}

/**
 * Updates the connection selected for a mystic character.
 *
 * @param character - the character to update
 * @param connection - the selected connection
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
 * Updates the manifestation color selected for a solarian character.
 *
 * @param character - the character to update
 * @param colorId - the identifier of the selected color
 * @returns The updated character
 */
function updateSolarianColorImpl(character: Character, colorId: string): Character {
  return {
    ...character,
    classOptions: {
      ...character.classOptions,
      solarianColor: colorId,
    },
  };
}

/**
 * Updates the manifestation type selected for a solarian character.
 *
 * @param character - the character to update
 * @param manifestationId - the identifier of the selected manifestation
 * @returns The updated character
 */
function updateSolarianManifestationImpl(character: Character, manifestationId: string): Character {
  return {
    ...character,
    classOptions: {
      ...character.classOptions,
      solarianManifestation: manifestationId,
    },
  };
}

/**
 * Updates the damage type selected for a solarian weapon.
 *
 * @param character - the character to update
 * @param damageTypeId - the identifier of the selected damage type
 * @returns The updated character
 */
function updateSolarianDamageTypeImpl(character: Character, damageTypeId: string): Character {
  return {
    ...character,
    classOptions: {
      ...character.classOptions,
      solarianDamageType: damageTypeId,
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
  const currentRank = character.skillRanks[skillId] as number | undefined;
  if (delta === 0 || (currentRank === undefined && delta <= 0)) {
    // No change
    return character;
  }

  const newRank = (currentRank ?? 0) + delta;
  if (newRank <= 0) {
    // Remove the rank
    // eslint-disable-next-line sonarjs/sonar-no-unused-vars, @typescript-eslint/no-unused-vars
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

function addEquipmentImpl(character: Character, descriptor: EquipmentDescriptor) {
  character.equipment = [...character.equipment, descriptor];
  character.credits -= descriptor.unitaryCost;
  return character;
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

  updateSelectableBonus(abilityScoreId: string) {
    this._character = updateSelectableBonusImpl(this.data, this._character, abilityScoreId);
    return this;
  }

  enableSecondaryTrait(traitId: string) {
    const race = findOrError(this.data.races, this._character.origin);
    const trait = findOrError(race.secondaryTraits, traitId);
    this._character = enableSecondaryTraitImpl(this._character, { id: trait.id, replace: trait.replace ?? [] });
    return this;
  }

  disableSecondaryTrait(traitId: string) {
    const race = findOrError(this.data.races, this._character.origin);
    const trait = findOrError(race.secondaryTraits, traitId);
    this._character = disableSecondaryTraitImpl(this._character, { id: trait.id, replace: trait.replace ?? [] });
    return this;
  }

  updateTheme(themeId: string) {
    this._character = updateThemeImpl(this.data, this._character, themeId);
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

  updateThemelessAbilityScore(abilityScoreId: string) {
    this._character = updateThemelessAbilityScoreImpl(this.data, this._character, abilityScoreId);
    return this;
  }

  updateClass(classId: string) {
    this._character = updateClassImpl(this.data, this._character, classId);
    return this;
  }

  updateMechanicStyle(style: string) {
    this._character = updateMechanicStyleImpl(this._character, style);
    return this;
  }

  updateMysticConnection(connection: string) {
    this._character = updateMysticConnectionImpl(this._character, connection);
    return this;
  }

  updateOperativeSpecialization(specialization: string) {
    this._character = updateOperativeSpecializationImpl(this._character, specialization);
    return this;
  }

  updateSolarianColor(colorId: string) {
    this._character = updateSolarianColorImpl(this._character, colorId);
    return this;
  }

  updateSolarianManifestation(manifestationId: string) {
    this._character = updateSolarianManifestationImpl(this._character, manifestationId);
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

  addEquipment(descriptor: EquipmentDescriptor) {
    this._character = addEquipmentImpl(this._character, descriptor);
    return this;
  }
}

export const updators = (data: IClientDataSet, character: Character) => new Updators(data, character);

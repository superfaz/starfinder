import { fail, PromisedResult, start, succeed } from "chain-of-actions";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { DataSets, IDataSource } from "data";
import { DataSourceError, InvalidError, NotFoundError } from "logic/errors";
import { AbilityScoreIds, Character, EmptyCharacter, IdSchema } from "model";
import { RaceFeature } from "view";

import "server-only";

export class CharacterBuilder {
  private readonly dataSource: IDataSource;

  private character: Character;

  constructor(dataSource: IDataSource, character: Character) {
    this.dataSource = dataSource;
    this.character = character;
  }

  /**
   * Returns the current character.
   *
   * @returns The current character
   */
  getCharacter(): Character {
    return this.character;
  }

  /**
   * Computes the minimal ability scores for a specific character.
   *
   * @param character - the reference character
   * @returns The minimal ability scores for the specified character
   */
  private async computeMinimalAbilityScores(
    character: Character
  ): PromisedResult<Record<string, number>, DataSourceError> {
    const selectedVariant = await start(character.race)
      .onSuccess((raceId) => this.dataSource.get(DataSets.Races).findOne(raceId))
      .onSuccess((selectedRace) => succeed(selectedRace?.variants.find((v) => v.id === character.raceVariant)))
      .runAsync();
    if (!selectedVariant.success) {
      return fail(selectedVariant.error);
    }

    const selectedTheme = await this.dataSource.get(DataSets.Themes).findOne(character.theme);
    if (!selectedTheme.success) {
      return fail(selectedTheme.error);
    }

    const abilityScores = await this.dataSource.get(DataSets.AbilityScore).getAll();
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

      if (character.raceOptions !== undefined && abilityScore.id === character.raceOptions.selectableBonus) {
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

  update(field: string, value: unknown): PromisedResult<undefined, DataSourceError | NotFoundError> {
    switch (field) {
      case "race":
        return this.updateRace(IdSchema.parse(value));
      case "theme":
        return this.updateTheme(IdSchema.parse(value));
      case "class":
        return this.updateClass(IdSchema.parse(value));
      case "name":
        return this.updateName(z.string().parse(value));
      case "description":
        return this.updateDescription(z.string().parse(value));
      default:
        throw new Error(`Unknown field ${field}`);
    }
  }

  /**
   * Updates the race associated with a character.
   *
   * Ensure that the variant, options, traits and ability scores are reset.
   *
   * @param raceId - the identifier of its new race
   * @returns A promise that resolved to `undefined` in case of success, or an error otherwise.
   */
  async updateRace(raceId: string): PromisedResult<undefined, DataSourceError | NotFoundError> {
    if (this.character.race === raceId) {
      // No change
      return succeed(undefined);
    }

    const race = await start()
      .onSuccess(() => this.dataSource.get(DataSets.Races).findOne(raceId))
      .onSuccess((race) => (race === undefined ? fail(new NotFoundError()) : succeed(race)))
      .runAsync();

    if (!race.success) {
      return fail(race.error);
    }

    const avatars = await this.dataSource.get(DataSets.Avatar).getAll();

    if (!avatars.success) {
      return fail(avatars.error);
    }

    const result: Character = {
      ...this.character,
      race: race.value.id,
      raceVariant: race.value.variants[0].id,
      raceOptions: undefined,
      traits: race.value.traits.map((t) => t.id),
    };

    // Special case - prepare the associated options
    if (Object.keys(race.value.variants[0].abilityScores).length === 0) {
      const abilityScores = await this.dataSource.get(DataSets.AbilityScore).getAll();
      if (!abilityScores.success) {
        return fail(abilityScores.error);
      }

      result.raceOptions = { selectableBonus: abilityScores.value[0].id };
    }

    const abilityScores = await this.computeMinimalAbilityScores(result);
    result.abilityScores = abilityScores.success ? abilityScores.value : {};
    result.avatar = avatars.value.filter((avatar) => avatar.tags.includes(raceId))[0].id;

    this.character = result;
    return succeed(undefined);
  }

  /**
   * Updates the race variant associated with a character.
   *
   * Ensure that the options and ability scores are reset.
   *
   * @param variantId - the identifier of its new race variant
   * @returns A promise that resolved to `undefined` in case of success, or an error otherwise.
   */
  async updateRaceVariant(variantId: string): PromisedResult<undefined, DataSourceError | NotFoundError> {
    if (this.character.raceVariant === variantId) {
      // No change
      return succeed(undefined);
    }

    const variant = await start()
      .onSuccess(() => this.dataSource.get(DataSets.Races).findOne(this.character.race))
      .onSuccess((race) => (race === undefined ? fail(new NotFoundError()) : succeed(race)))
      .onSuccess((race) => succeed(race.variants.find((v) => v.id === variantId)))
      .onSuccess((variant) => (variant === undefined ? fail(new NotFoundError()) : succeed(variant)))
      .runAsync();

    if (!variant.success) {
      return fail(variant.error);
    }

    const result: Character = {
      ...this.character,
      raceVariant: variantId,
      raceOptions: undefined,
    };

    // Special case - prepare the associated options
    console.log(variant.value.name, variant.value.abilityScores);
    if (Object.keys(variant.value.abilityScores).length === 0) {
      const abilityScores = await this.dataSource.get(DataSets.AbilityScore).getAll();
      if (!abilityScores.success) {
        return fail(abilityScores.error);
      }
      result.raceOptions = { selectableBonus: abilityScores.value[0].id };
    }

    const abilityScores = await this.computeMinimalAbilityScores(result);
    result.abilityScores = abilityScores.success ? abilityScores.value : {};

    this.character = result;
    return succeed(undefined);
  }

  /**
   * Updates the ability score selected as a bonus for race variant letting the user choose its bonus.
   *
   * Ensure that the ability scores are reset.
   *
   * @param data - the data set
   * @param character - the character to update
   * @param abilityScoreId - the identifier of the selected ability score
   * @returns A promise that resolved to `undefined` in case of success, or an error otherwise.
   */
  async updateRaceSelectableBonus(abilityScoreId: string): PromisedResult<undefined, DataSourceError | NotFoundError> {
    const result: Character = {
      ...this.character,
      raceOptions: { selectableBonus: abilityScoreId },
    };

    const abilityScores = await this.computeMinimalAbilityScores(result);
    result.abilityScores = abilityScores.success ? abilityScores.value : {};

    this.character = result;
    return succeed(undefined);
  }

  /**
   * Updates the theme associated with a character.
   *
   * Ensure that the theme options and ability scores are reset.
   *
   * @param themeId - the identifier of its new theme
   * @returns A promise that resolved to `undefined` in case of success, or an error otherwise.
   */
  async updateTheme(themeId: string): PromisedResult<undefined, DataSourceError | NotFoundError> {
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

  /**
   * Updates the class associated with a character.
   *
   * Ensure that the class options and ability scores are reset.
   *
   * @param classId - the identifier of its new class
   * @returns A promise that resolved to `undefined` in case of success, or an error otherwise.
   */
  async updateClass(classId: string): PromisedResult<undefined, DataSourceError | NotFoundError> {
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
   * Updates the name of a character.
   *
   * @param name - the new name
   * @returns A promise that resolved to `undefined` in case of success, or an error otherwise.
   */
  async updateName(name: string): PromisedResult<undefined> {
    this.character = { ...this.character, name };
    return succeed(undefined);
  }

  /**
   * Updates the description of a character.
   *
   * @param description - the new description
   * @returns A promise that resolved to `undefined` in case of success, or an error otherwise.
   */
  async updateDescription(description: string): PromisedResult<undefined> {
    this.character = { ...this.character, description };
    return succeed(undefined);
  }

  /**
   * Enables a secondary trait for a character.
   *
   * Ensure that the associated primary traits are disabled.
   *
   * @param trait - the enabled secondary trait
   * @returns A promise that resolved to `undefined` in case of success, or an error otherwise.
   */
  async enableSecondaryTrait(trait: RaceFeature): PromisedResult<undefined, InvalidError> {
    const traits = this.character.traits.filter((t) => !trait.replace.find((r) => r.id === t));

    // Validate that the replaced traits were available
    if (traits.length + trait.replace.length !== this.character.traits.length) {
      return fail(new InvalidError());
    }

    this.character = { ...this.character, traits: [...traits, trait.id] };
    return succeed(undefined);
  }

  /**
   * Disables a secondary trait for a character.
   *
   * Ensure that the associated primary traits are enabled.
   *
   * @param trait - the disabled secondary trait
   * @returns A promise that resolved to `undefined` in case of success, or an error otherwise.
   */
  async disableSecondaryTrait(trait: RaceFeature): PromisedResult<undefined, InvalidError> {
    // Validate that the trait was enabled
    if (!this.character.traits.includes(trait.id)) {
      return fail(new InvalidError());
    }

    this.character = {
      ...this.character,
      traits: [...this.character.traits.filter((t) => t !== trait.id), ...trait.replace.map((r) => r.id)],
    };
    return succeed(undefined);
  }
}

export async function createBuilder(
  dataSource: IDataSource,
  userId: string
): PromisedResult<{ builder: CharacterBuilder }>;
export async function createBuilder(
  dataSource: IDataSource,
  character: Character
): PromisedResult<{ builder: CharacterBuilder }>;
export async function createBuilder(
  dataSource: IDataSource,
  characterOrUserId: Character | string
): PromisedResult<{ builder: CharacterBuilder }> {
  if (typeof characterOrUserId === "string") {
    return succeed({
      builder: new CharacterBuilder(dataSource, {
        ...EmptyCharacter,
        id: uuidv4(),
        userId: characterOrUserId,
        updatedAt: new Date().toISOString(),
      }),
    });
  } else {
    return succeed({
      builder: new CharacterBuilder(dataSource, {
        ...characterOrUserId,
        updatedAt: new Date().toISOString(),
      }),
    });
  }
}

import { v4 as uuidv4 } from "uuid";
import { DataSets, IDataSource } from "data";
import { AbilityScoreIds, Character, EmptyCharacter } from "model";
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
  private async computeMinimalAbilityScores(character: Character): Promise<Record<string, number>> {
    const selectedRace = await this.dataSource.get(DataSets.Races).findOne(character.race);
    const selectedVariant = selectedRace?.variants.find((v) => v.id === character.raceVariant);
    const selectedTheme = await this.dataSource.get(DataSets.Themes).findOne(character.theme);
    const abilityScores = await this.dataSource.get(DataSets.AbilityScore).getAll();

    const scores: Record<string, number> = {};
    abilityScores.forEach((abilityScore) => {
      let score = 10;

      if (selectedVariant) {
        score += selectedVariant.abilityScores[abilityScore.id] ?? 0;
      }

      if (selectedTheme) {
        score += selectedTheme.abilityScores[abilityScore.id] ?? 0;
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

    return scores;
  }

  /**
   * Updates the race associated with a character.
   *
   * Ensure that the variant, options, traits and ability scores are reset.
   *
   * @param raceId - the identifier of its new race
   * @returns `true` if `raceId` is valid, `false` otherwise
   */
  async updateRace(raceId: string): Promise<boolean> {
    const race = await this.dataSource.get(DataSets.Races).findOne(raceId);
    if (race === undefined) {
      return false;
    }

    const abilityScores = await this.dataSource.get(DataSets.AbilityScore).getAll();
    const avatars = await this.dataSource.get(DataSets.Avatar).getAll();

    console.log("abilityScores", abilityScores);
    console.log("avatars", avatars);

    if (this.character.race === raceId) {
      // No change
      return true;
    }

    const result: Character = {
      ...this.character,
      race: race.id,
      raceVariant: race.variants[0].id,
      raceOptions: undefined,
      traits: race.traits.map((t) => t.id),
    };

    // Special case - prepare the associated options
    if (Object.keys(race.variants[0].abilityScores).length === 0) {
      result.raceOptions = { selectableBonus: abilityScores[0].id };
    }

    result.abilityScores = await this.computeMinimalAbilityScores(result);
    result.avatar = avatars.filter((avatar) => avatar.tags.includes(raceId))[0].id;

    this.character = result;
    return true;
  }

  /**
   * Updates the theme associated with a character.
   *
   * Ensure that the theme options and ability scores are reset.
   *
   * @param themeId - the identifier of its new theme
   * @returns `true` if `themeId` is valid, `false` otherwise
   */
  async updateTheme(themeId: string): Promise<boolean> {
    const theme = await this.dataSource.get(DataSets.Themes).findOne(themeId);
    if (theme === undefined) {
      return false;
    }

    if (this.character.theme === themeId) {
      // No change
      return true;
    }

    const result: Character = {
      ...this.character,
      theme: theme.id,
      themeOptions: undefined,
    };

    // Special cases - prepare the associated options
    if (theme.id === "scholar") {
      // Theme: Scholar
      result.themeOptions = {
        scholarSkill: "life",
        scholarSpecialization: "",
      };
    } else if (theme.id === "themeless") {
      // Theme: No theme
      result.themeOptions = { themelessAbility: AbilityScoreIds.str };
    }

    result.abilityScores = await this.computeMinimalAbilityScores(result);

    this.character = result;
    return true;
  }

  /**
   * Updates the class associated with a character.
   *
   * Ensure that the class options and ability scores are reset.
   *
   * @param classId - the identifier of its new class
   * @returns `true` if `classId` is valid, `false` otherwise
   */
  async updateClass(classId: string): Promise<boolean> {
    const klass = await this.dataSource.get(DataSets.Class).findOne(classId);
    if (klass === undefined) {
      return false;
    }

    if (this.character.class === classId) {
      // No change
      return true;
    }

    const result: Character = {
      ...this.character,
      class: klass.id,
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

    result.abilityScores = await this.computeMinimalAbilityScores(result);
    this.character = result;
    return true;
  }

  /**
   * Updates the name of a character.
   *
   * @param name - the new name
   */
  async updateName(name: string): Promise<boolean> {
    this.character = { ...this.character, name };
    return true;
  }

  /**
   * Updates the description of a character.
   *
   * @param description - the new description
   */
  async updateDescription(description: string): Promise<boolean> {
    this.character = { ...this.character, description };
    return true;
  }
}

export function createCharacter(dataSource: IDataSource, userId: string): CharacterBuilder {
  return new CharacterBuilder(dataSource, { ...EmptyCharacter, id: uuidv4(), userId });
}

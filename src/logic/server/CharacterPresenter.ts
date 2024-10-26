import { findOrError } from "app/helpers";
import { PromisedResult, succeed, fail } from "chain-of-actions";
import { DataSets, IDataSource } from "data";
import { DataSourceError } from "logic/errors";
import { Templater } from "logic/Templater";
import {
  AbilityScoreIdSchema,
  type AbilityScoreId,
  type Character,
  type Class,
  type Profession,
  type Race,
  type Theme,
} from "model";
import type { RaceFeature, ThemeFeature } from "view";

export class CharacterPresenter {
  private readonly dataSource: IDataSource;
  private readonly character: Character;

  private cachedPrimaryRaceTraits: RaceFeature[] | null = null;
  private cachedSecondaryRaceTraits: RaceFeature[] | null = null;

  constructor(dataSource: IDataSource, character: Character) {
    this.dataSource = dataSource;
    this.character = character;
  }

  getLevel(): number {
    return this.character.level;
  }

  private async createTemplater(context: object = {}): Promise<Templater> {
    const templater = new Templater({
      shirrenObsessionSkill: "any",
      lashuntaStudentSkill1: "any",
      lashuntaStudentSkill2: "any",
      halforcProfession: "any",
      iconProfession: "any",
      themelessSkill: "any",
      level: this.character.level,
      race: this.character.race,
      theme: this.character.theme,
      class: this.character.class,
      ...this.character.raceOptions,
      ...this.character.themeOptions,
      ...this.character.classOptions,
      ...context,
    });

    const klass = await this.getClass();
    if (klass.success && klass.value !== undefined) {
      templater.addToContext("primary", klass.value.primaryAbilityScore);
      if (klass.value.id === "envoy" && this.character.classOptions?.envoySkill) {
        const skill = await this.dataSource.get(DataSets.Skills).getOne(this.character.classOptions.envoySkill);
        if (skill.success) {
          templater.addToContext("envoySkill", skill.value.name);
        }
      }
    }

    return templater;
  }

  async getRace(): PromisedResult<Race | undefined, DataSourceError> {
    if (!this.character.race) {
      return succeed(undefined);
    }

    return await this.dataSource.get(DataSets.Races).findOne(this.character.race);
  }

  async getPrimaryRaceTraits(): PromisedResult<RaceFeature[], DataSourceError> {
    const race = await this.getRace();
    if (!race.success) {
      return fail(race.error);
    } else if (race.value === undefined) {
      return succeed([]);
    }

    const templater = await this.createTemplater();
    if (!this.cachedPrimaryRaceTraits) {
      this.cachedPrimaryRaceTraits = race.value.traits.map((t) => templater.convertRaceFeature(t));
    }

    return succeed(this.cachedPrimaryRaceTraits);
  }

  async getSecondaryRaceTraits(): PromisedResult<RaceFeature[], DataSourceError> {
    const race = await this.getRace();
    if (!race.success) {
      return fail(race.error);
    } else if (race.value === undefined) {
      return succeed([]);
    }

    const templater = await this.createTemplater();
    if (!this.cachedSecondaryRaceTraits) {
      const primaryTraits = await this.getPrimaryRaceTraits();
      if (!primaryTraits.success) {
        return fail(primaryTraits.error);
      }

      const traits = race.value.secondaryTraits.map((t) => templater.convertRaceFeature(t));
      for (const trait of traits) {
        const source = findOrError(race.value.secondaryTraits, trait.id);
        trait.replace =
          source.replace?.map((r) => ({ id: r, name: primaryTraits.value.find((p) => p.id === r)?.name ?? r })) ?? [];
      }

      this.cachedSecondaryRaceTraits = traits;
    }

    return succeed(this.cachedSecondaryRaceTraits);
  }

  async getTheme(): PromisedResult<Theme | undefined, DataSourceError> {
    if (!this.character.theme) {
      return succeed(undefined);
    }

    return await this.dataSource.get(DataSets.Themes).findOne(this.character.theme);
  }

  async getThemeFeatures(): PromisedResult<ThemeFeature[], DataSourceError> {
    const theme = await this.getTheme();
    if (!theme.success) {
      return fail(theme.error);
    } else if (theme.value === undefined) {
      return succeed([]);
    }

    const templater = await this.createTemplater();
    return succeed(theme.value.features.map((f) => templater.convertThemeFeature(f)));
  }

  async getIconProfession(): PromisedResult<Profession | undefined> {
    if (!this.character.themeOptions?.iconProfession) {
      return succeed(undefined);
    }

    const result = this.character.professionSkills.find((p) => p.id === this.character.themeOptions?.iconProfession);
    return succeed(result);
  }

  async getScholarSkill(): PromisedResult<string | undefined> {
    return succeed(this.character.themeOptions?.scholarSkill);
  }

  async getScholarSpecialization(): PromisedResult<string | undefined> {
    return succeed(this.character.themeOptions?.scholarSpecialization);
  }

  async getThemelessAbilityScore(): PromisedResult<AbilityScoreId | undefined> {
    return succeed(AbilityScoreIdSchema.optional().parse(this.character.themeOptions?.themelessAbility));
  }

  async getClass(): PromisedResult<Class | undefined, DataSourceError> {
    if (!this.character.class) {
      return succeed(undefined);
    }

    return await this.dataSource.get(DataSets.Class).findOne(this.character.class);
  }

  async getAllProfessions(): PromisedResult<Profession[], DataSourceError> {
    const professions = await this.dataSource.get(DataSets.Profession).getAll();
    if (!professions.success) {
      return fail(professions.error);
    }

    return succeed([...professions.value, ...this.character.professionSkills]);
  }
}

export function createCharacterPresenter({
  dataSource,
  character,
}: {
  dataSource: IDataSource;
  character: Character;
}): PromisedResult<{ presenter: CharacterPresenter }> {
  return succeed({ presenter: new CharacterPresenter(dataSource, character) });
}

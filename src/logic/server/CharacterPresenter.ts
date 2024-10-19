import { findOrError } from "app/helpers";
import { fail } from "assert";
import { PromisedResult, succeed } from "chain-of-actions";
import { DataSets, IDataSource } from "data";
import { DataSourceError } from "logic/errors";
import { Templater } from "logic/Templater";
import type { Character, Class, Race } from "model";
import type { RaceFeature } from "view";

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

  async getClass(): PromisedResult<Class | undefined, DataSourceError> {
    if (!this.character.class) {
      return succeed(undefined);
    }

    return await this.dataSource.get(DataSets.Class).findOne(this.character.class);
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

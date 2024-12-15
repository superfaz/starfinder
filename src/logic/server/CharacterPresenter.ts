import { PromisedResult, succeed, fail } from "chain-of-actions";
import { findOrError } from "app/helpers";
import { DataSets, IDataSource } from "data";
import { DataSourceError } from "logic/errors";
import { Templater } from "logic/Templater";
import {
  AbilityScoreIdSchema,
  ClassEnvoy,
  ClassMechanic,
  ClassMystic,
  ClassOperative,
  ClassSolarian,
  ClassSoldier,
  ClassTechnomancer,
  FeatureTemplate,
  IModel,
  type AbilityScoreId,
  type Character,
  type Class,
  type Profession,
  type Race,
  type Theme,
} from "model";
import type { ClassFeature, RaceFeature, ThemeFeature } from "view";

function cleanEvolutions(
  evolutions: Record<string, Record<string, string | number | null | undefined> | null | undefined> | undefined
): Record<string, Record<string, string | number>> {
  if (!evolutions) {
    return {};
  }

  const result: Record<string, Record<string, string | number>> = {};
  Object.entries(evolutions).forEach(([level, values]) => {
    result[level] = {};
    if (values) {
      Object.entries(values).forEach(([key, value]) => {
        if (value) {
          result[level][key] = value;
        }
      });
    }
  });

  return result;
}

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
      return succeed();
    }

    return await this.dataSource.get(DataSets.Races).findOne(this.character.race);
  }

  async getPrimaryRaceTraits(): PromisedResult<{ primaryTraits: RaceFeature[] }, DataSourceError> {
    const race = await this.getRace();
    if (!race.success) {
      return fail(race.error);
    } else if (race.value === undefined) {
      return succeed({ primaryTraits: [] });
    }

    const templater = await this.createTemplater();
    if (!this.cachedPrimaryRaceTraits) {
      this.cachedPrimaryRaceTraits = race.value.traits.map((t) => templater.convertRaceFeature(t));
    }

    return succeed({ primaryTraits: this.cachedPrimaryRaceTraits });
  }

  async getSecondaryRaceTraits(): PromisedResult<{ secondaryTraits: RaceFeature[] }, DataSourceError> {
    const race = await this.getRace();
    if (!race.success) {
      return fail(race.error);
    } else if (race.value === undefined) {
      return succeed({ secondaryTraits: [] });
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
          source.replace?.map((r) => ({
            id: r,
            name: primaryTraits.value.primaryTraits.find((p) => p.id === r)?.name ?? r,
          })) ?? [];
      }

      this.cachedSecondaryRaceTraits = traits;
    }

    return succeed({ secondaryTraits: this.cachedSecondaryRaceTraits });
  }

  async getTheme(): PromisedResult<Theme | undefined, DataSourceError> {
    if (!this.character.theme) {
      return succeed();
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
      return succeed();
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
      return succeed();
    }

    return await this.dataSource.get(DataSets.Classes).findOne(this.character.class);
  }

  async getClassDetails(): PromisedResult<IModel | undefined, DataSourceError> {
    const selectedClass = await this.getClass();
    if (!selectedClass.success) {
      return fail(selectedClass.error);
    } else if (selectedClass.value === undefined) {
      return succeed();
    }

    return await this.dataSource.get(DataSets.ClassDetails).getOne(selectedClass.value.id);
  }

  async getClassFeatures(): PromisedResult<ClassFeature[], DataSourceError> {
    const classDetails = await this.getClassDetails();
    if (!classDetails.success) {
      return fail(classDetails.error);
    }

    if (classDetails.value === undefined) {
      return succeed([]);
    }

    switch (classDetails.value.id) {
      case "envoy": {
        const results = (classDetails.value as ClassEnvoy).features.map(async (f) => {
          const level = f.level ?? 1;
          const templater = await this.createTemplater(cleanEvolutions(f.evolutions)[level]);
          return templater.convertClassFeature(f);
        });
        return succeed(await Promise.all(results));
      }
      case "mechanic": {
        const results = (classDetails.value as ClassMechanic).features.map(async (f) => {
          const level = f.level ?? 1;
          const templater = await this.createTemplater(cleanEvolutions(f.evolutions)[level]);
          return templater.convertClassFeature(f);
        });
        return succeed(await Promise.all(results));
      }
      case "mystic": {
        const results = this.getMysticFeatureTemplates(classDetails.value as ClassMystic).map(async (f) => {
          const level = f.level ?? 1;
          const templater = await this.createTemplater(cleanEvolutions(f.evolutions)[level]);
          return templater.convertClassFeature(f);
        });
        return succeed(await Promise.all(results));
      }

      case "operative": {
        const selectedSpecialization = (classDetails.value as ClassOperative).specializations.find(
          (s) => s.id === this.getOperativeSpecialization()
        );
        const results = this.getOperativeFeatureTemplates(classDetails.value as ClassOperative).map(async (f) => {
          const level = f.level ?? 1;
          const templater = await this.createTemplater({
            ...(selectedSpecialization?.variables ?? {}),
            ...cleanEvolutions(f.evolutions)[level],
          });
          return templater.convertClassFeature(f);
        });
        return succeed(await Promise.all(results));
      }

      case "solarian": {
        const manifestation = this.getSolarianManifestation();
        const results = (classDetails.value as ClassSolarian).features
          .filter((f) => !f.prerequisites || f.prerequisites.length === 0 || f.prerequisites[0].value === manifestation)
          .map(async (f) => {
            const level = f.level ?? 1;
            const templater = await this.createTemplater(cleanEvolutions(f.evolutions)[level]);
            return templater.convertClassFeature(f);
          });
        return succeed(await Promise.all(results));
      }

      case "soldier": {
        const results = this.getSoldierFeatureTemplates(classDetails.value as ClassSoldier).map(async (f) => {
          const level = f.level ?? 1;
          const templater = await this.createTemplater(cleanEvolutions(f.evolutions)[level]);
          return templater.convertClassFeature(f);
        });
        return succeed(await Promise.all(results));
      }

      case "technomancer": {
        const results = (classDetails.value as ClassTechnomancer).features.map(async (f) => {
          const level = f.level ?? 1;
          const templater = await this.createTemplater(cleanEvolutions(f.evolutions)[level]);
          return templater.convertClassFeature(f);
        });
        return succeed(await Promise.all(results));
      }

      default:
        return succeed([]);
    }
  }

  getEnvoySkill(): string | undefined {
    return this.character.classOptions?.envoySkill;
  }

  getMechanicStyle(): string | undefined {
    return this.character.classOptions?.mechanicStyle;
  }

  getMysticConnection(): string | undefined {
    return this.character.classOptions?.mysticConnection;
  }

  getOperativeSpecialization(): string | undefined {
    return this.character.classOptions?.operativeSpecialization;
  }

  getSolarianColor(): string | undefined {
    return this.character.classOptions?.solarianColor;
  }

  getSolarianManifestation(): string | undefined {
    return this.character.classOptions?.solarianManifestation;
  }

  getSolarianDamageType(): string | undefined {
    return this.character.classOptions?.solarianDamageType;
  }

  getSoldierAbilityScore(): string | undefined {
    return this.character.classOptions?.soldierAbilityScore;
  }

  getSoldierPrimaryStyle(): string | undefined {
    return this.character.classOptions?.soldierPrimaryStyle;
  }

  private getMysticFeatureTemplates(classDetails: ClassMystic): FeatureTemplate[] {
    const connection = this.getMysticConnection();
    if (!connection) {
      return [];
    }

    const selectedConnection = classDetails.connections.find((s) => s.id === connection);
    const classFeatures: FeatureTemplate[] = classDetails.features;
    const connectionFeatures: FeatureTemplate[] = selectedConnection?.features ?? [];

    return [...classFeatures, ...connectionFeatures];
  }

  private getOperativeFeatureTemplates(operativeData: ClassOperative): FeatureTemplate[] {
    const specialization = this.getOperativeSpecialization();
    if (!specialization) {
      return [];
    }

    const selectedSpecialization = operativeData.specializations.find((s) => s.id === specialization);
    const classFeatures: FeatureTemplate[] = operativeData.features;
    const specializationFeatures: FeatureTemplate[] = selectedSpecialization?.features ?? [];

    return [...classFeatures, ...specializationFeatures];
  }

  private getSoldierFeatureTemplates(classDetails: ClassSoldier): FeatureTemplate[] {
    const primaryStyle = this.getSoldierPrimaryStyle();
    if (!primaryStyle) {
      return [];
    }

    const selectedStyle = classDetails.styles.find((s) => s.id === primaryStyle);
    const classFeatures: FeatureTemplate[] = classDetails.features;
    const specializationFeatures: FeatureTemplate[] = selectedStyle?.features ?? [];

    return [...classFeatures, ...specializationFeatures];
  }

  async getAllProfessions(): PromisedResult<Profession[], DataSourceError> {
    const professions = await this.dataSource.get(DataSets.Professions).getAll();
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

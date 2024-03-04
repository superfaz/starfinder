import { CosmosClient, Database } from "@azure/cosmos";
import * as Sentry from "@sentry/nextjs";
import {
  AbilityScoreSchema,
  Alignment,
  Armor,
  Avatar,
  Book,
  Class,
  DamageType,
  FeatTemplate,
  IModel,
  INamedModel,
  Profession,
  Race,
  SavingThrow,
  SkillDefinition,
  Spell,
  Theme,
  Weapon,
} from "model";
import { IDataSet } from ".";

const cached: Record<string, unknown> = {};

function cache<T>(key: string, fn: () => Promise<T>): () => Promise<T> {
  return async () => {
    if (cached[key]) {
      return cached[key] as T;
    } else {
      const result = await fn();
      cached[key] = result;
      return result;
    }
  };
}

export function clearCache() {
  Object.keys(cached).forEach((key) => delete cached[key]);
}

export class DataSetBuilder {
  private readonly client: CosmosClient;
  private readonly database: Database;

  constructor() {
    if (
      !process.env.STARFINDER_COSMOS_ENDPOINT ||
      !process.env.STARFINDER_COSMOS_KEY ||
      !process.env.STARFINDER_COSMOS_DATABASE
    ) {
      throw new Error("Missing CosmosDB configuration");
    }

    this.client = new CosmosClient({
      endpoint: process.env.STARFINDER_COSMOS_ENDPOINT,
      key: process.env.STARFINDER_COSMOS_KEY,
    });
    this.database = this.client.database(process.env.STARFINDER_COSMOS_DATABASE);
  }

  private async getWithQuery<T extends IModel>(name: string, query: string): Promise<T[]> {
    const preparedQuery = this.database.container(name).items.query(query);
    try {
      const result = await preparedQuery.fetchAll();
      return result.resources as T[];
    } catch (e: unknown) {
      Sentry.captureException(e);
      throw new Error(`Failed to get ${name}`, { cause: e });
    }
  }

  private async getOne<T>(name: string, id: string): Promise<T> {
    const preparedQuery = this.database.container(name).item(id, id);
    try {
      const result = await preparedQuery.read<IModel>();
      return result.resource as T;
    } catch (e: unknown) {
      Sentry.captureException(e);
      throw new Error(`Failed to get ${name}/${id}`, { cause: e });
    }
  }

  async getAll<T extends IModel>(name: string): Promise<T[]> {
    return this.getWithQuery(name, "SELECT * FROM c");
  }

  async getOrdered<T extends IModel>(name: string): Promise<T[]> {
    return this.getWithQuery(name, "SELECT * FROM c ORDER BY c['order']");
  }

  async getNamed<T extends INamedModel>(name: string): Promise<T[]> {
    return this.getWithQuery(name, "SELECT * FROM c ORDER BY c.name");
  }

  async build(): Promise<IDataSet> {
    const data: IDataSet = {
      getAbilityScores: cache("ability-scores", () =>
        this.getOrdered("ability-scores").then((a) => AbilityScoreSchema.array().parse(a))
      ),
      getAlignments: cache("alignments", () => this.getOrdered("alignments").then((a) => Alignment.array().parse(a))),
      getArmors: cache("armors", () => this.getOrdered("armors").then((a) => Armor.array().parse(a))),
      getAvatars: cache("avatars", () => this.getAll("avatars").then((a) => Avatar.array().parse(a))),
      getBooks: cache("books", () => this.getAll("books").then((a) => Book.array().parse(a))),
      getClasses: cache("classes", () => this.getNamed("classes").then((a) => Class.array().parse(a))),
      getClassDetails: <T>(classId: string) => this.getOne<T>("classes-details", classId),
      getDamageTypes: cache("damage-types", () =>
        this.getNamed("damage-types").then((a) => DamageType.array().parse(a))
      ),
      getFeats: cache("feats", () => this.getNamed("feats").then((a) => FeatTemplate.array().parse(a))),
      getProfessions: cache("professions", () => this.getNamed("professions").then((a) => Profession.array().parse(a))),
      getRaces: cache("races", () => this.getNamed("races").then((a) => Race.array().parse(a))),
      getSpells: cache("spells", () => this.getNamed("spells").then((a) => Spell.array().parse(a))),
      getThemes: cache("themes", () => this.getNamed("themes").then((a) => Theme.array().parse(a))),
      getThemeDetails: <T>(themeId: string) => this.getOne<T>("themes-details", themeId),
      getSavingThrows: cache("saving-throws", () =>
        this.getOrdered("saving-throws").then((a) => SavingThrow.array().parse(a))
      ),
      getSkills: cache("skills", () => this.getNamed("skills").then((a) => SkillDefinition.array().parse(a))),
      getWeapons: cache("weapons", () => this.getOrdered("weapons").then((a) => Weapon.array().parse(a))),
    };

    return data;
  }
}

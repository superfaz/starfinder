import { CosmosClient, Database } from "@azure/cosmos";
import { IModel, INamedModel } from "model";
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
    this.client = new CosmosClient({
      endpoint: process.env.STARFINDER_COSMOS_ENDPOINT ?? "https://localhost:8081",
      key:
        process.env.STARFINDER_COSMOS_KEY_RO ??
        "C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==",
    });
    this.database = this.client.database("starfinder");
  }

  private async getWithQuery<T extends IModel>(name: string, query: string): Promise<T[]> {
    const preparedQuery = this.database.container(name).items.query(query);
    try {
      const result = await preparedQuery.fetchAll();
      return result.resources as T[];
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.error(e.message);
      } else {
        console.error(e);
      }
      throw new Error(`Failed to get ${name}`, { cause: e });
    }
  }

  private async getOne<T>(name: string, id: string): Promise<T> {
    const preparedQuery = this.database.container(name).item(id, id);
    try {
      const result = await preparedQuery.read<IModel>();
      return result.resource as T;
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.error(e.message);
      } else {
        console.error(e);
      }

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
      getAbilityScores: cache("ability-scores", () => this.getOrdered("ability-scores")),
      getAlignments: cache("alignments", () => this.getOrdered("alignments")),
      getAvatars: cache("avatars", () => this.getAll("avatars")),
      getClasses: cache("classes", () => this.getNamed("classes")),
      getClassDetails: <T>(classId: string) => this.getOne<T>("classes-details", classId),
      getRaces: cache("races", () => this.getNamed("races")),
      getThemes: cache("themes", () => this.getNamed("themes")),
      getThemeDetails: <T>(themeId: string) => this.getOne<T>("themes-details", themeId),
      getSkills: cache("skills", () => this.getNamed("skills")),
      getArmors: cache("armors", () => this.getOrdered("armors")),
      getWeapons: cache("weapons", () => this.getOrdered("weapons")),
    };

    return data;
  }
}

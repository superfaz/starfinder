import { CosmosClient, Database } from "@azure/cosmos";
import { IModel } from "model";
import { IDataSet } from ".";

export class DataSetBuilder {
  private readonly client: CosmosClient;
  private readonly database: Database;

  constructor() {
    this.client = new CosmosClient({
      endpoint: "https://localhost:8081",
      key: "C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==",
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
      throw new Error(`Failed to get ${name}`);
    }
  }

  private async getOne<T>(name: string, id: string): Promise<T> {
    const preparedQuery = this.database.container(name).item(id, id);
    try {
      const result = await preparedQuery.read<IModel>();
      console.log(result);
      return result.resource as T;
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.error(e.message);
      } else {
        console.error(e);
      }

      throw new Error(`Failed to get ${name}/${id}`);
    }
  }

  async getAll<T extends IModel>(name: string): Promise<T[]> {
    return this.getWithQuery(name, "SELECT * FROM c");
  }

  async getOrdered<T extends IModel>(name: string): Promise<T[]> {
    return this.getWithQuery(name, "SELECT * FROM c ORDER BY c['order']");
  }

  async getNamed<T extends IModel>(name: string): Promise<T[]> {
    return this.getWithQuery(name, "SELECT * FROM c ORDER BY c.name");
  }

  async build(): Promise<IDataSet> {
    const data: IDataSet = {
      getAbilityScores: () => this.getOrdered("ability-scores"),
      getAlignments: () => this.getOrdered("alignments"),
      getAvatars: () => this.getAll("avatars"),
      getClasses: () => this.getNamed("classes"),
      getClassDetails: <T>(classId: string) => this.getOne<T>("classes-details", classId),
      getRaces: () => this.getNamed("races"),
      getThemes: () => this.getNamed("themes"),
      getThemeDetails: <T>(themeId: string) => this.getOne<T>("themes-details", themeId),
      getSkills: () => this.getNamed("skills"),
      getArmors: () => this.getOrdered("armors"),
      getWeapons: () => this.getOrdered("weapons"),
    };

    return data;
  }
}

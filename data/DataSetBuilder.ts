import { CosmosClient, Database } from "@azure/cosmos";
import { IModel } from "model";
import { DataSet } from "./DataSet";

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

  async getAll<T extends IModel>(name: string): Promise<T[]> {
    return this.getWithQuery(name, "SELECT * FROM c");
  }

  async getOrdered<T extends IModel>(name: string): Promise<T[]> {
    return this.getWithQuery(name, "SELECT * FROM c ORDER BY c['order']");
  }

  async getNamed<T extends IModel>(name: string): Promise<T[]> {
    return this.getWithQuery(name, "SELECT * FROM c ORDER BY c.name");
  }

  async build(): Promise<DataSet> {
    const data: DataSet = {
      abilityScores: await this.getOrdered("ability-scores"),
      alignments: await this.getOrdered("alignments"),
      avatars: await this.getAll("avatars"),
      classes: await this.getNamed("classes"),
      races: await this.getNamed("races"),
      themes: await this.getNamed("themes"),
      skills: await this.getNamed("skills"),
      armors: await this.getOrdered("armors"),
      weapons: await this.getOrdered("weapons"),
    };

    return data;
  }
}

import { CosmosClient, Database } from "@azure/cosmos";
import * as Sentry from "@sentry/nextjs";
import { type IModel } from "model";
import { IDataSet, IDataSource, IDescriptor } from "./interfaces";

export class DataSource implements IDataSource {
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

  async getAll<T extends IModel>(descriptor: IDescriptor<T>): Promise<T[]> {
    switch (descriptor.type) {
      case "simple":
        return this.getWithQuery(descriptor.name, "SELECT * FROM c").then((a) => descriptor.schema.array().parse(a));
      case "named":
        return this.getWithQuery(descriptor.name, "SELECT * FROM c ORDER BY c.name").then((a) =>
          descriptor.schema.array().parse(a)
        );
      case "ordered":
        return this.getWithQuery(descriptor.name, "SELECT * FROM c ORDER BY c['order']").then((a) =>
          descriptor.schema.array().parse(a)
        );
      default:
        throw new Error("Method not implemented.");
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

  async get<T extends IModel>(descriptor: IDescriptor<T>): Promise<IDataSet<T>> {
    return {
      getAll: () => this.getAll(descriptor),
      getOne: (id: string) => this.getOne(descriptor.name, id),
    };
  }
}

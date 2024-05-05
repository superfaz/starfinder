import * as Sentry from "@sentry/nextjs";
import { Db, MongoClient, Sort } from "mongodb";
import { type IModel } from "model";
import { IDataSet, IDataSource, IDescriptor } from "./interfaces";

export class DataSource implements IDataSource {
  private readonly client: MongoClient;
  private readonly database: Db;

  constructor() {
    if (!process.env.STARFINDER_MONGO_URI || !process.env.STARFINDER_MONGO_DATABASE) {
      throw new Error("Missing Mongo configuration");
    }

    this.client = new MongoClient(process.env.STARFINDER_MONGO_URI);
    this.database = this.client.db(process.env.STARFINDER_MONGO_DATABASE);
  }

  private async getAll<T extends IModel>(descriptor: IDescriptor<T>): Promise<T[]> {
    let sort: Sort = 1;
    switch (descriptor.type) {
      case "simple":
        sort = {};
        break;
      case "named":
        sort = "name";
        break;
      case "ordered":
        sort = "order";
        break;
      default:
        throw new Error("Method not implemented.");
    }

    const preparedQuery = this.database.collection(descriptor.name).find().sort(sort);
    const results = await preparedQuery.toArray();
    try {
      return descriptor.schema.array().parse(results);
    } catch (e: unknown) {
      Sentry.captureException(e);
      throw new Error(`Failed to get ${descriptor.name}`, { cause: e });
    }
  }

  private async getOne<T extends IModel>(descriptor: IDescriptor<T>, id: string): Promise<T> {
    const isT = (obj: unknown): obj is T => descriptor.schema.safeParse(obj).success;
    const result = await this.database.collection(descriptor.name).findOne({ id });

    if (result === null) {
      throw new Error(`Failed to get ${descriptor.name}/${id}`);
    }

    if (!isT(result)) {
      throw new Error(`Failed to parse ${descriptor.name}/${id}`);
    }

    return result;
  }

  get<T extends IModel>(descriptor: IDescriptor<T>): IDataSet<T> {
    return {
      getAll: () => this.getAll(descriptor),
      getOne: (id: string) => this.getOne(descriptor, id),
    };
  }
}

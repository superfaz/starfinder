import * as Sentry from "@sentry/nextjs";
import { Db, MongoClient, Sort } from "mongodb";
import { type IModel } from "model";
import {
  IDataSource,
  IDescriptor,
  IDynamicDataSet,
  IDynamicDescriptor,
  IStaticDataSet,
  IStaticDescriptor,
} from "./interfaces";

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

  private async create<T extends IModel>(descriptor: IDescriptor<T>, data: T): Promise<T> {
    const protect = descriptor.schema.safeParse(data);
    if (protect.success === false) {
      throw new Error(`Failed to validate a ${descriptor.name}`);
    }

    const result = await this.database.collection(descriptor.name).insertOne(protect.data);
    if (!result.acknowledged) {
      throw new Error(`Failed to create ${descriptor.name}`);
    }

    return protect.data;
  }

  private async update<T extends IModel>(descriptor: IDescriptor<T>, data: T): Promise<T> {
    const protect = descriptor.schema.safeParse(data);
    if (protect.success === false) {
      throw new Error(`Failed to validate a ${descriptor.name}`);
    }

    const result = await this.database.collection(descriptor.name).updateOne({ id: data.id }, protect.data);
    if (!result.acknowledged) {
      throw new Error(`Failed to create ${descriptor.name}`);
    }

    return protect.data;
  }

  private async delete<T extends IModel>(descriptor: IDescriptor<T>, id: string): Promise<void> {
    const result = await this.database.collection(descriptor.name).deleteOne({ id });
    if (!result.acknowledged) {
      throw new Error(`Failed to delete ${descriptor.name}/${id}`);
    }
  }

  get<T extends IModel>(descriptor: IStaticDescriptor<T>): IStaticDataSet<T>;
  get<T extends IModel>(descriptor: IDynamicDescriptor<T>): IDynamicDataSet<T>;
  get<T extends IModel>(descriptor: IDescriptor<T>): IStaticDataSet<T> | IDynamicDataSet<T> {
    if (descriptor.mode === "static") {
      return {
        getAll: () => this.getAll(descriptor),
      } as IStaticDataSet<T>;
    } else {
      return {
        getAll: () => this.getAll(descriptor),
        getOne: (id: string) => this.getOne(descriptor, id),
        create: (data: T) => this.create(descriptor, data),
        update: (data: T) => this.update(descriptor, data),
        delete: (id: string) => this.delete(descriptor, id),
      } as IDynamicDataSet<T>;
    }
  }
}

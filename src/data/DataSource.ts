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

class StaticDataSet<T extends IModel> implements IStaticDataSet<T> {
  protected readonly client: MongoClient;
  protected readonly descriptor: IDescriptor<T>;
  protected readonly database: Db;

  constructor(client: MongoClient, descriptor: IDescriptor<T>, database: string) {
    this.client = client;
    this.descriptor = descriptor;
    this.database = this.client.db(database);
  }

  async getAll(): Promise<T[]> {
    let sort: Sort = 1;
    switch (this.descriptor.type) {
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

    const preparedQuery = this.database.collection(this.descriptor.name).find().sort(sort);
    const results = await preparedQuery.toArray();
    try {
      return this.descriptor.schema.array().parse(results);
    } catch (e: unknown) {
      Sentry.captureException(e);
      throw new Error(`Failed to get ${this.descriptor.name}`, { cause: e });
    }
  }

  async getOne(id: string): Promise<T> {
    const isT = (obj: unknown): obj is T => this.descriptor.schema.safeParse(obj).success;
    const result = await this.database.collection(this.descriptor.name).findOne({ id });

    if (result === null) {
      throw new Error(`Failed to get ${this.descriptor.name}/${id}`);
    }

    if (!isT(result)) {
      throw new Error(`Failed to parse ${this.descriptor.name}/${id}`);
    }

    return result;
  }
}

class DynamicDataSet<T extends IModel> extends StaticDataSet<T> implements IDynamicDataSet<T> {
  constructor(client: MongoClient, descriptor: IDescriptor<T>, database: string) {
    super(client, descriptor, database);
  }

  async create(data: T): Promise<T> {
    const protect = this.descriptor.schema.safeParse(data);
    if (protect.success === false) {
      throw new Error(`Failed to validate a ${this.descriptor.name}`);
    }

    const result = await this.database.collection(this.descriptor.name).insertOne(protect.data);
    if (!result.acknowledged) {
      throw new Error(`Failed to create ${this.descriptor.name}`);
    }

    return protect.data;
  }

  async update(data: T): Promise<T> {
    const protect = this.descriptor.schema.safeParse(data);
    if (protect.success === false) {
      throw new Error(`Failed to validate a ${this.descriptor.name}`);
    }

    const result = await this.database.collection(this.descriptor.name).updateOne({ id: data.id }, protect.data);
    if (!result.acknowledged) {
      throw new Error(`Failed to create ${this.descriptor.name}`);
    }

    return protect.data;
  }

  async delete(id: string): Promise<void> {
    const result = await this.database.collection(this.descriptor.name).deleteOne({ id });
    if (!result.acknowledged) {
      throw new Error(`Failed to delete ${this.descriptor.name}/${id}`);
    }
  }
}

export class DataSource implements IDataSource {
  private readonly client: MongoClient;
  private readonly databasePrefix: string;

  constructor() {
    if (!process.env.STARFINDER_MONGO_URI || !process.env.STARFINDER_MONGO_DATABASE) {
      throw new Error("Missing Mongo configuration");
    }

    this.client = new MongoClient(process.env.STARFINDER_MONGO_URI);
    this.databasePrefix = process.env.STARFINDER_MONGO_DATABASE;
  }

  get<T extends IModel>(descriptor: IStaticDescriptor<T>): IStaticDataSet<T>;
  get<T extends IModel>(descriptor: IDynamicDescriptor<T>): IDynamicDataSet<T>;
  get<T extends IModel>(descriptor: IDescriptor<T>): IStaticDataSet<T> | IDynamicDataSet<T> {
    if (descriptor.mode === "static") {
      return new StaticDataSet(this.client, descriptor, this.databasePrefix + "-fr");
    } else {
      return new DynamicDataSet(this.client, descriptor, this.databasePrefix);
    }
  }
}

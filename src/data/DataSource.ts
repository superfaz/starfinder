import * as Sentry from "@sentry/nextjs";
import { Db, DeleteResult, type Document, type Filter, MongoClient, type Sort } from "mongodb";
import type { IModel } from "model";
import type {
  IDataSource,
  IDescriptor,
  IDynamicDataSet,
  IDynamicDescriptor,
  IStaticDataSet,
  IStaticDescriptor,
} from "./interfaces";
import { unstable_cache } from "next/cache";

import "server-only";

async function findCore<T extends IModel>(
  database: Db,
  descriptor: IDescriptor<T>,
  query: Filter<T> | undefined,
  sort?: Sort,
  limit?: number
): Promise<T[]> {
  if (sort === undefined) {
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
  }

  let preparedQuery = database
    .collection(descriptor.name)
    .find(query as Filter<Document>)
    .sort(sort);

  if (limit !== undefined) {
    preparedQuery = preparedQuery.limit(limit);
  }

  const results = await preparedQuery.toArray();
  try {
    return descriptor.schema.array().parse(results);
  } catch (e: unknown) {
    Sentry.captureException(e);
    throw new Error(`Failed to get ${descriptor.name}`, { cause: e });
  }
}

async function getAllCore<T extends IModel>(database: Db, descriptor: IDescriptor<T>): Promise<T[]> {
  return findCore(database, descriptor, undefined);
}

async function findOneCore<T extends IModel>(
  database: Db,
  descriptor: IDescriptor<T>,
  id: string
): Promise<T | undefined> {
  const isT = (obj: unknown): obj is T => descriptor.schema.safeParse(obj).success;
  const result = await database.collection(descriptor.name).findOne({ id });

  if (result === null) {
    return undefined;
  }

  if (!isT(result)) {
    throw new Error(`Failed to parse ${descriptor.name}/${id}`);
  }

  return result;
}

async function getOneCore<T extends IModel>(database: Db, descriptor: IDescriptor<T>, id: string): Promise<T> {
  const result = await findOneCore(database, descriptor, id);

  if (result === undefined) {
    throw new Error(`Failed to get ${descriptor.name}/${id}`);
  }

  return result;
}

class StaticDataSet<T extends IModel> implements IStaticDataSet<T> {
  protected readonly client: MongoClient;
  protected readonly descriptor: IDescriptor<T>;
  protected readonly database: Db;

  constructor(client: MongoClient, descriptor: IDescriptor<T>, database: string) {
    this.client = client;
    this.descriptor = descriptor;
    this.database = this.client.db(database);
  }

  find = (query: Filter<T>) =>
    unstable_cache(
      (query) => findCore(this.database, this.descriptor, query),
      ["find", this.descriptor.mode, this.descriptor.name]
    )(query);
  getAll = () => getAllCore(this.database, this.descriptor);
  findOne = (id: string) => {
    return unstable_cache(
      (id: string) => findOneCore(this.database, this.descriptor, id),
      ["findOne", this.descriptor.mode, this.descriptor.name]
    )(id);
  };
  getOne = (id: string) => getOneCore(this.database, this.descriptor, id);
}

class DynamicDataSet<T extends IModel> extends StaticDataSet<T> implements IDynamicDataSet<T> {
  constructor(client: MongoClient, descriptor: IDescriptor<T>, database: string) {
    super(client, descriptor, database);
  }

  find = (query: Filter<T>) => findCore(this.database, this.descriptor, query);
  getAll = () => getAllCore(this.database, this.descriptor);
  getOne = (id: string) => getOneCore(this.database, this.descriptor, id);
  findOne = (id: string) => findOneCore(this.database, this.descriptor, id);

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

    const result = await this.database.collection(this.descriptor.name).replaceOne({ id: data.id }, protect.data);
    if (!result.acknowledged) {
      throw new Error(`Failed to create ${this.descriptor.name}`);
    }

    return protect.data;
  }

  async delete(idOrQuery: string | Filter<T>): Promise<void> {
    let result: DeleteResult;
    if (typeof idOrQuery === "string") {
      result = await this.database.collection(this.descriptor.name).deleteOne({ id: idOrQuery });
    } else {
      result = await this.database.collection(this.descriptor.name).deleteOne(idOrQuery as Filter<Document>);
    }

    if (!result.acknowledged) {
      throw new Error(`Failed to delete ${this.descriptor.name}/${idOrQuery}`);
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

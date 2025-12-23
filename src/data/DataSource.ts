import { convert, fail, onSuccess, PromisedResult, start, succeed } from "chain-of-actions";
import { Db, type Document, type Filter, MongoClient, type Sort } from "mongodb";
import { unstable_cache } from "next/cache";
import type { IModel } from "model";
import { createParsingError, DataSourceError, ParsingError } from "logic";
import {
  IDataSource,
  IDescriptor,
  IDynamicDataSet,
  IDynamicDescriptor,
  IStaticDataSet,
  IStaticDescriptor,
} from "./interfaces";

import "server-only";

async function findCore<T extends IModel>(
  database: Db,
  descriptor: IDescriptor<T>,
  query: Filter<T> | undefined,
  sort?: Sort,
  limit?: number
): PromisedResult<T[], DataSourceError | ParsingError> {
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

  return start()
    .add(
      onSuccess(() =>
        convert({
          try: () => preparedQuery.toArray(),
          catch: (e: unknown) => new DataSourceError(`Failed to get ${descriptor.name}`, { cause: e }),
        })
      )
    )
    .add(
      onSuccess((results) => {
        const parsed = descriptor.schema.array().safeParse(results);
        if (parsed.success) {
          return succeed(parsed.data);
        } else {
          console.error(parsed.error.errors);
          console.log(results[0]);
          return fail(createParsingError(parsed.error.flatten().fieldErrors));
        }
      })
    )
    .runAsync();
}

function getAllCore<T extends IModel>(
  database: Db,
  descriptor: IDescriptor<T>
): PromisedResult<T[], DataSourceError | ParsingError> {
  return findCore(database, descriptor, undefined);
}

async function findOneCore<T extends IModel>(
  database: Db,
  descriptor: IDescriptor<T>,
  id: string
): PromisedResult<T | undefined, DataSourceError> {
  const isT = (obj: unknown): obj is T => descriptor.schema.safeParse(obj).success;
  return start()
    .add(
      onSuccess(() =>
        convert({
          try: () => database.collection(descriptor.name).findOne({ id }),
          catch: (e) => new DataSourceError("", { cause: e }),
        })
      )
    )
    .add(
      onSuccess((result) => {
        if (result && !isT(result)) {
          return fail(new DataSourceError(`Failed to parse ${descriptor.name}/${id}`));
        } else {
          return succeed(result === null ? undefined : result);
        }
      })
    )
    .runAsync();
}

function getOneCore<T extends IModel>(
  database: Db,
  descriptor: IDescriptor<T>,
  id: string
): PromisedResult<T, DataSourceError> {
  return start()
    .add(onSuccess(() => findOneCore(database, descriptor, id)))
    .add(
      onSuccess((result) =>
        result ? succeed(result) : fail(new DataSourceError(`Failed to get ${descriptor.name}/${id}`))
      )
    )
    .runAsync();
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

  create(data: T): PromisedResult<T, DataSourceError> {
    const protect = this.descriptor.schema.safeParse(data);
    if (protect.success === false) {
      return fail(new DataSourceError(`Failed to validate a ${this.descriptor.name}`));
    }

    return start()
      .add(
        onSuccess(() =>
          convert({
            try: () => this.database.collection(this.descriptor.name).insertOne(protect.data),
            catch: (e) => new DataSourceError(`Failed to create ${this.descriptor.name}`, { cause: e }),
          })
        )
      )
      .add(
        onSuccess((result) => {
          if (!result.acknowledged) {
            return fail(new DataSourceError(`Failed to create ${this.descriptor.name}`));
          }

          return succeed(protect.data);
        })
      )
      .runAsync();
  }

  update(data: T): PromisedResult<T, DataSourceError> {
    const protect = this.descriptor.schema.safeParse(data);
    if (protect.success === false) {
      return fail(new DataSourceError(`Failed to validate a ${this.descriptor.name}`));
    }

    return start()
      .add(
        onSuccess(() =>
          convert({
            try: () => this.database.collection(this.descriptor.name).replaceOne({ id: data.id }, protect.data),
            catch: (e) => new DataSourceError(`Failed to update ${this.descriptor.name}/${data.id}`, { cause: e }),
          })
        )
      )
      .add(
        onSuccess((result) => {
          if (!result.acknowledged) {
            return fail(new DataSourceError(`Failed to update ${this.descriptor.name}/${data.id}`));
          }
          return succeed(protect.data);
        })
      )
      .runAsync();
  }

  delete(idOrQuery: string | Filter<T>): PromisedResult<undefined, DataSourceError> {
    return start()
      .add(
        onSuccess(() =>
          convert({
            try: () =>
              this.database
                .collection(this.descriptor.name)
                .deleteOne(typeof idOrQuery === "string" ? { id: idOrQuery } : (idOrQuery as Filter<Document>)),
            catch: (e) => new DataSourceError(`Failed to delete ${this.descriptor.name}/${idOrQuery}`, { cause: e }),
          })
        )
      )
      .add(
        onSuccess((result) => {
          if (!result.acknowledged) {
            return fail(new DataSourceError(`Failed to delete ${this.descriptor.name}/${idOrQuery}`));
          }
          return succeed();
        })
      )
      .runAsync();
  }
}

export class DataSource implements IDataSource {
  private readonly client: MongoClient;
  private readonly databasePrefix: string;

  constructor() {
    if (!process.env.STARFINDER_MONGO_URI) {
      throw new Error("Missing Mongo configuration STARFINDER_MONGO_URI");
    }
    if (!process.env.STARFINDER_MONGO_DATABASE) {
      throw new Error("Missing Mongo configuration STARFINDER_MONGO_DATABASE");
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

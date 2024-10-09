import { PromisedResult } from "chain-of-actions";
import { DataSourceError } from "action-errors";
import type { IModel } from "model";
import type { Filter, Sort } from "mongodb";
import type { Schema } from "zod";

interface IBaseDescriptor<T extends IModel> {
  type: "simple" | "named" | "ordered";
  name: string;
  schema: Schema<T>;
}

export interface IStaticDescriptor<T extends IModel> extends IBaseDescriptor<T> {
  mode: "static";
}

export interface IDynamicDescriptor<T extends IModel> extends IBaseDescriptor<T> {
  mode: "dynamic";
}

export type IDescriptor<T extends IModel> = IStaticDescriptor<T> | IDynamicDescriptor<T>;

export interface IStaticDataSet<T extends IModel> {
  getAll(): PromisedResult<T[], DataSourceError>;
  getOne(id: string): PromisedResult<T, DataSourceError>;
  findOne(id: string): PromisedResult<T | undefined, DataSourceError>;
  find(query: Filter<T>, sort?: Sort, limit?: number): PromisedResult<T[], DataSourceError>;
}

export interface IDynamicDataSet<T extends IModel> extends IStaticDataSet<T> {
  create(data: T): PromisedResult<T, DataSourceError>;
  update(data: T): PromisedResult<T, DataSourceError>;
  delete(idOrQuery: string | Filter<T>): PromisedResult<void, DataSourceError>;
}

export interface IDataSource {
  get<T extends IModel>(descriptor: IStaticDescriptor<T>): IStaticDataSet<T>;
  get<T extends IModel>(descriptor: IDynamicDescriptor<T>): IDynamicDataSet<T>;
}

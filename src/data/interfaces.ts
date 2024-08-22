import { IModel } from "model";
import { Schema } from "zod";

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
  getAll(): Promise<T[]>;
  getOne(id: string): Promise<T>;
}

export interface IDynamicDataSet<T extends IModel> extends IStaticDataSet<T> {
  create(data: T): Promise<T>;
  update(data: T): Promise<T>;
  delete(id: string): Promise<void>;
}

export interface IDataSource {
  get<T extends IModel>(descriptor: IStaticDescriptor<T>): IStaticDataSet<T>;
  get<T extends IModel>(descriptor: IDynamicDescriptor<T>): IDynamicDataSet<T>;
}

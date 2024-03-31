import { IModel } from "model";
import { Schema } from "zod";

export interface IDescriptor<T extends IModel> {
  type: "simple" | "named" | "ordered";
  name: string;
  schema: Schema<T>;
}

export interface IDataSet<T extends IModel> {
  getAll(): Promise<T[]>;
  getOne(id: string): Promise<T>;
}

export interface IDataSource {
  get<T extends IModel>(descriptor: IDescriptor<T>): IDataSet<T>;
}

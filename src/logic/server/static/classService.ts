import { PromisedResult } from "chain-of-actions";
import { IStaticDescriptor } from "data";
import { DataSourceError, NotFoundError } from "logic/errors";
import { Class, ClassSchema } from "model";
import { IRetrieveAllParams, retrieveAll, retrieveOne } from "./_services";

const descriptor: IStaticDescriptor<Class> = {
  mode: "static",
  type: "named",
  name: "classes",
  schema: ClassSchema,
};

export const classService = {
  retrieveAll: (params: IRetrieveAllParams) =>
    retrieveAll(params, descriptor, "classes") as PromisedResult<{ classes: Class[] }, DataSourceError>,

  retrieveOne: (params: IRetrieveAllParams & { classId: string }) =>
    retrieveOne({ dataSource: params.dataSource, id: params.classId }, descriptor, "class") as PromisedResult<
      { class: Class },
      DataSourceError | NotFoundError
    >,

  findOne: (params: IRetrieveAllParams & { classId: string }) =>
    params.dataSource.get(descriptor).findOne(params.classId),
};

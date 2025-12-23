import { PromisedResult } from "chain-of-actions";
import { IStaticDescriptor } from "data";
import { DataSourceError, NotFoundError } from "logic/errors";
import { IModel, IModelSchema } from "model";
import { IRetrieveAllParams, retrieveAll, retrieveOne } from "./_services";

const descriptor: IStaticDescriptor<IModel> = {
  mode: "static",
  type: "simple",
  name: "classes-details",
  schema: IModelSchema,
};

export const classDetailService = {
  retrieveAll: (params: IRetrieveAllParams) =>
    retrieveAll(params, descriptor, "classDetails") as PromisedResult<{ classDetails: IModel[] }, DataSourceError>,

  retrieveOne: (params: IRetrieveAllParams & { classId: string }) =>
    retrieveOne({ dataSource: params.dataSource, id: params.classId }, descriptor, "classDetail") as PromisedResult<
      { classDetail: IModel },
      DataSourceError | NotFoundError
    >,
};

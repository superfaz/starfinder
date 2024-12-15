import { PromisedResult } from "chain-of-actions";
import { IStaticDescriptor } from "data";
import { DataSourceError, NotFoundError } from "logic/errors";
import { IModel, IModelSchema } from "model";
import { IRetrieveAllParams, retrieveAll, retrieveOne } from "./_services";

const descriptor: IStaticDescriptor<IModel> = {
  mode: "static",
  type: "simple",
  name: "themes-details",
  schema: IModelSchema,
};

export const themeDetails = {
  retrieveAll: (params: IRetrieveAllParams) =>
    retrieveAll(params, descriptor, "themeDetails") as PromisedResult<{ themeDetails: IModel[] }, DataSourceError>,

  retrieveOne: (params: IRetrieveAllParams & { classId: string }) =>
    retrieveOne({ dataSource: params.dataSource, id: params.classId }, descriptor, "themeDetail") as PromisedResult<
      { themeDetail: IModel },
      DataSourceError | NotFoundError
    >,
};

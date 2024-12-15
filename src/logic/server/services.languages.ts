import { PromisedResult } from "chain-of-actions";
import { IStaticDescriptor } from "data";
import { DataSourceError, NotFoundError } from "logic/errors";
import { INamedModel, INamedModelSchema } from "model";
import { IRetrieveAllParams, retrieveAll, retrieveOne } from "./_services";

const descriptor: IStaticDescriptor<INamedModel> = {
  mode: "static",
  type: "simple",
  name: "languages",
  schema: INamedModelSchema,
};
export const languages = {
  retrieveAll: (params: IRetrieveAllParams) =>
    retrieveAll(params, descriptor, "languages") as PromisedResult<{ languages: INamedModel[] }, DataSourceError>,

  retrieveOne: (params: IRetrieveAllParams & { classId: string }) =>
    retrieveOne({ dataSource: params.dataSource, id: params.classId }, descriptor, "language") as PromisedResult<
      { language: INamedModel },
      DataSourceError | NotFoundError
    >,
};

import { PromisedResult } from "chain-of-actions";
import { IStaticDescriptor } from "data";
import { DataSourceError, NotFoundError } from "logic/errors";
import { Theme, ThemeSchema } from "model";
import { IRetrieveAllParams, retrieveAll, retrieveOne } from "./_services";

const descriptor: IStaticDescriptor<Theme> = {
  mode: "static",
  type: "named",
  name: "themes",
  schema: ThemeSchema,
};

export const themes = {
  retrieveAll: (params: IRetrieveAllParams) =>
    retrieveAll(params, descriptor, "themes") as PromisedResult<{ themes: Theme[] }, DataSourceError>,

  retrieveOne: (params: IRetrieveAllParams & { classId: string }) =>
    retrieveOne({ dataSource: params.dataSource, id: params.classId }, descriptor, "theme") as PromisedResult<
      { theme: Theme },
      DataSourceError | NotFoundError
    >,
};

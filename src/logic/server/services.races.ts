import { PromisedResult } from "chain-of-actions";
import { IStaticDescriptor } from "data";
import { DataSourceError, NotFoundError } from "logic/errors";
import { Race, RaceSchema } from "model";
import { IRetrieveAllParams, retrieveAll, retrieveOne } from "./_services";

const descriptor: IStaticDescriptor<Race> = {
  mode: "static",
  type: "named",
  name: "races",
  schema: RaceSchema,
};

export const races = {
  retrieveAll: (params: IRetrieveAllParams) =>
    retrieveAll(params, descriptor, "races") as PromisedResult<{ races: Race[] }, DataSourceError>,

  retrieveOne: (params: IRetrieveAllParams & { classId: string }) =>
    retrieveOne({ dataSource: params.dataSource, id: params.classId }, descriptor, "race") as PromisedResult<
      { race: Race },
      DataSourceError | NotFoundError
    >,
};

import { PromisedResult } from "chain-of-actions";
import { IStaticDescriptor } from "data";
import { DataSourceError, NotFoundError } from "logic/errors";
import { Deity, DeitySchema } from "model";
import { IRetrieveAllParams, retrieveAll, retrieveOne } from "./_services";

const descriptor: IStaticDescriptor<Deity> = {
  mode: "static",
  type: "named",
  name: "deities",
  schema: DeitySchema,
};

export const deityService = {
  retrieveAll: (params: IRetrieveAllParams) =>
    retrieveAll(params, descriptor, "deities") as PromisedResult<{ deities: Deity[] }, DataSourceError>,

  retrieveOne: (params: IRetrieveAllParams & { deityId: string }) =>
    retrieveOne({ dataSource: params.dataSource, id: params.deityId }, descriptor, "deity") as PromisedResult<
      { deity: Deity },
      DataSourceError | NotFoundError
    >,
};

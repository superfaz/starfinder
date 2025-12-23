import { PromisedResult } from "chain-of-actions";
import { IStaticDescriptor } from "data";
import { DataSourceError, NotFoundError } from "logic/errors";
import { World, WorldSchema } from "model";
import { IRetrieveAllParams, retrieveAll, retrieveOne } from "./_services";

const descriptor: IStaticDescriptor<World> = {
  mode: "static",
  type: "simple",
  name: "worlds",
  schema: WorldSchema,
};

export const worldService = {
  retrieveAll: (params: IRetrieveAllParams) =>
    retrieveAll(params, descriptor, "worlds") as PromisedResult<{ worlds: World[] }, DataSourceError>,

  retrieveOne: (params: IRetrieveAllParams & { worldId: string }) =>
    retrieveOne({ dataSource: params.dataSource, id: params.worldId }, descriptor, "world") as PromisedResult<
      { world: World },
      DataSourceError | NotFoundError
    >,
};

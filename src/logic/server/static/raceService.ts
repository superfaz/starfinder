import { PromisedResult, fail, succeed } from "chain-of-actions";
import { IStaticDescriptor } from "data";
import { DataSourceError, NotFoundError } from "logic/errors";
import { Race, RaceSchema, Variant } from "model";
import { IRetrieveAllParams, retrieveAll, retrieveOne } from "./_services";

const descriptor: IStaticDescriptor<Race> = {
  mode: "static",
  type: "named",
  name: "races",
  schema: RaceSchema,
};

export const raceService = {
  retrieveAll: (params: IRetrieveAllParams) =>
    retrieveAll(params, descriptor, "races") as PromisedResult<{ races: Race[] }, DataSourceError>,

  retrieveOne: (params: IRetrieveAllParams & { raceId: string }) =>
    retrieveOne({ dataSource: params.dataSource, id: params.raceId }, descriptor, "race") as PromisedResult<
      { race: Race },
      DataSourceError | NotFoundError
    >,

  findOne: (params: IRetrieveAllParams & { raceId: string }) =>
    params.dataSource.get(descriptor).findOne(params.raceId),

  retrieveVariant: ({
    race,
    variantId,
  }: {
    race: Race;
    variantId: string;
  }): PromisedResult<{ variant: Variant }, NotFoundError> => {
    const variant = race.variants.find((variant) => variant.id === variantId);
    return variant === undefined ? fail(new NotFoundError("variants", variantId)) : succeed({ variant });
  },
};

import { PromisedResult } from "chain-of-actions";
import { IStaticDescriptor } from "data";
import { DataSourceError, NotFoundError } from "logic/errors";
import { Profession, ProfessionSchema } from "model";
import { IRetrieveAllParams, retrieveAll, retrieveOne } from "./_services";

const descriptor: IStaticDescriptor<Profession> = {
  mode: "static",
  type: "named",
  name: "professions",
  schema: ProfessionSchema,
};

export const professionService = {
  retrieveAll: (params: IRetrieveAllParams) =>
    retrieveAll(params, descriptor, "professions") as PromisedResult<{ professions: Profession[] }, DataSourceError>,

  retrieveOne: (params: IRetrieveAllParams & { professionId: string }) =>
    retrieveOne({ dataSource: params.dataSource, id: params.professionId }, descriptor, "profession") as PromisedResult<
      { profession: Profession },
      DataSourceError | NotFoundError
    >,
};

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

export const professions = {
  retrieveAll: (params: IRetrieveAllParams) =>
    retrieveAll(params, descriptor, "professions") as PromisedResult<{ professions: Profession[] }, DataSourceError>,

  retrieveOne: (params: IRetrieveAllParams & { classId: string }) =>
    retrieveOne({ dataSource: params.dataSource, id: params.classId }, descriptor, "profession") as PromisedResult<
      { profession: Profession },
      DataSourceError | NotFoundError
    >,
};

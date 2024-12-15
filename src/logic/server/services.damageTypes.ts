import { PromisedResult } from "chain-of-actions";
import { IStaticDescriptor } from "data";
import { DataSourceError, NotFoundError } from "logic/errors";
import { DamageType, DamageTypeSchema } from "model";
import { IRetrieveAllParams, retrieveAll, retrieveOne } from "./_services";

const descriptor: IStaticDescriptor<DamageType> = {
  mode: "static",
  type: "named",
  name: "damage-types",
  schema: DamageTypeSchema,
};

export const damageTypes = {
  retrieveAll: (params: IRetrieveAllParams) =>
    retrieveAll(params, descriptor, "damageTypes") as PromisedResult<{ damageTypes: DamageType[] }, DataSourceError>,

  retrieveOne: (params: IRetrieveAllParams & { classId: string }) =>
    retrieveOne({ dataSource: params.dataSource, id: params.classId }, descriptor, "damageType") as PromisedResult<
      { damageType: DamageType },
      DataSourceError | NotFoundError
    >,
};

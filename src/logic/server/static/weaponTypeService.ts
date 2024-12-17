import { PromisedResult } from "chain-of-actions";
import { IStaticDescriptor } from "data";
import { DataSourceError, NotFoundError } from "logic/errors";
import { WeaponType, WeaponTypeSchema } from "model";
import { IRetrieveAllParams, retrieveAll, retrieveOne } from "./_services";

const descriptor: IStaticDescriptor<WeaponType> = {
  mode: "static",
  type: "ordered",
  name: "weapon-types",
  schema: WeaponTypeSchema,
};

export const weaponTypeService = {
  retrieveAll: (params: IRetrieveAllParams) =>
    retrieveAll(params, descriptor, "weaponTypes") as PromisedResult<{ weaponTypes: WeaponType[] }, DataSourceError>,

  retrieveOne: (params: IRetrieveAllParams & { weaponTypeId: string }) =>
    retrieveOne({ dataSource: params.dataSource, id: params.weaponTypeId }, descriptor, "weaponType") as PromisedResult<
      { weaponType: WeaponType },
      DataSourceError | NotFoundError
    >,
};

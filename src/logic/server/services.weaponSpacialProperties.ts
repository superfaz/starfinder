import { PromisedResult } from "chain-of-actions";
import { IStaticDescriptor } from "data";
import { DataSourceError, NotFoundError } from "logic/errors";
import { WeaponSpecialProperty, WeaponSpecialPropertySchema } from "model";
import { IRetrieveAllParams, retrieveAll, retrieveOne } from "./_services";

const descriptor: IStaticDescriptor<WeaponSpecialProperty> = {
  mode: "static",
  type: "named",
  name: "weapon-special-properties",
  schema: WeaponSpecialPropertySchema,
};

export const weaponSpecialProperties = {
  retrieveAll: (params: IRetrieveAllParams) =>
    retrieveAll(params, descriptor, "weaponSpecialProperties") as PromisedResult<
      { weaponSpecialProperties: WeaponSpecialProperty[] },
      DataSourceError
    >,

  retrieveOne: (params: IRetrieveAllParams & { classId: string }) =>
    retrieveOne(
      { dataSource: params.dataSource, id: params.classId },
      descriptor,
      "weaponSpecialProperty"
    ) as PromisedResult<{ weaponSpecialProperty: WeaponSpecialProperty }, DataSourceError | NotFoundError>,
};

import { PromisedResult } from "chain-of-actions";
import { IStaticDescriptor } from "data";
import { DataSourceError, NotFoundError } from "logic/errors";
import { WeaponCategory, WeaponCategorySchema } from "model";
import { IRetrieveAllParams, retrieveAll, retrieveOne } from "./_services";

const descriptor: IStaticDescriptor<WeaponCategory> = {
  mode: "static",
  type: "named",
  name: "weapon-categories",
  schema: WeaponCategorySchema,
};

export const weaponCategories = {
  retrieveAll: (params: IRetrieveAllParams) =>
    retrieveAll(params, descriptor, "weaponCategories") as PromisedResult<
      { weaponCategories: WeaponCategory[] },
      DataSourceError
    >,

  retrieveOne: (params: IRetrieveAllParams & { classId: string }) =>
    retrieveOne({ dataSource: params.dataSource, id: params.classId }, descriptor, "weaponCategory") as PromisedResult<
      { weaponCategory: WeaponCategory },
      DataSourceError | NotFoundError
    >,
};

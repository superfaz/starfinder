import { PromisedResult } from "chain-of-actions";
import { IStaticDescriptor } from "data";
import { DataSourceError, NotFoundError } from "logic/errors";
import { BonusCategory, BonusCategorySchema } from "model";
import { IRetrieveAllParams, retrieveAll, retrieveOne } from "./_services";

const descriptor: IStaticDescriptor<BonusCategory> = {
  mode: "static",
  type: "named",
  name: "bonus-categories",
  schema: BonusCategorySchema,
};

export const bonusCategories = {
  retrieveAll: (params: IRetrieveAllParams) =>
    retrieveAll(params, descriptor, "bonusCategories") as PromisedResult<
      { bonusCategories: BonusCategory[] },
      DataSourceError
    >,

  retrieveOne: (params: IRetrieveAllParams & { classId: string }) =>
    retrieveOne({ dataSource: params.dataSource, id: params.classId }, descriptor, "bonusCategory") as PromisedResult<
      { bonusCategory: BonusCategory },
      DataSourceError | NotFoundError
    >,
};

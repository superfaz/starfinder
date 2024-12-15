import { PromisedResult } from "chain-of-actions";
import { IStaticDescriptor } from "data";
import { DataSourceError, NotFoundError } from "logic/errors";
import { ArmorType, ArmorTypeSchema } from "model";
import { IRetrieveAllParams, retrieveAll, retrieveOne } from "./_services";

const descriptor: IStaticDescriptor<ArmorType> = {
  mode: "static",
  type: "ordered",
  name: "armor-types",
  schema: ArmorTypeSchema,
};

export const armorTypes = {
  retrieveAll: (params: IRetrieveAllParams) =>
    retrieveAll(params, descriptor, "armorTypes") as PromisedResult<{ armorTypes: ArmorType[] }, DataSourceError>,

  retrieveOne: (params: IRetrieveAllParams & { classId: string }) =>
    retrieveOne({ dataSource: params.dataSource, id: params.classId }, descriptor, "armorType") as PromisedResult<
      { armorType: ArmorType },
      DataSourceError | NotFoundError
    >,
};

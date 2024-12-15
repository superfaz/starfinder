import { PromisedResult } from "chain-of-actions";
import { IStaticDescriptor } from "data";
import { DataSourceError, NotFoundError } from "logic/errors";
import { FeatTemplate, FeatTemplateSchema } from "model";
import { IRetrieveAllParams, retrieveAll, retrieveOne } from "./_services";

const descriptor: IStaticDescriptor<FeatTemplate> = {
  mode: "static",
  type: "named",
  name: "feats",
  schema: FeatTemplateSchema,
};

export const feats = {
  retrieveAll: (params: IRetrieveAllParams) =>
    retrieveAll(params, descriptor, "feats") as PromisedResult<{ feats: FeatTemplate[] }, DataSourceError>,

  retrieveOne: (params: IRetrieveAllParams & { classId: string }) =>
    retrieveOne({ dataSource: params.dataSource, id: params.classId }, descriptor, "feat") as PromisedResult<
      { feat: FeatTemplate },
      DataSourceError | NotFoundError
    >,
};

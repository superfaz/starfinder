import { PromisedResult } from "chain-of-actions";
import { IStaticDescriptor } from "data";
import { DataSourceError, NotFoundError } from "logic/errors";
import { BodyPart, BodyPartSchema } from "model";
import { IRetrieveAllParams, retrieveAll, retrieveOne } from "./_services";

const descriptor: IStaticDescriptor<BodyPart> = {
  mode: "static",
  type: "named",
  name: "body-parts",
  schema: BodyPartSchema,
};

export const bodyParts = {
  retrieveAll: (params: IRetrieveAllParams) =>
    retrieveAll(params, descriptor, "bodyParts") as PromisedResult<{ bodyParts: BodyPart[] }, DataSourceError>,

  retrieveOne: (params: IRetrieveAllParams & { classId: string }) =>
    retrieveOne({ dataSource: params.dataSource, id: params.classId }, descriptor, "bodyPart") as PromisedResult<
      { bodyPart: BodyPart },
      DataSourceError | NotFoundError
    >,
};
